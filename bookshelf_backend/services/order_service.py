"""Order business logic: creating orders from carts, totals, cancellation."""
from __future__ import annotations

from decimal import Decimal

from django.db import transaction
from django.db.models import F
from rest_framework.exceptions import ValidationError

from apps.catalogue.models import Book
from apps.orders.models import Order, OrderItem
from apps.orders.tasks import send_order_confirmation_task

from .cart_service import get_or_create_cart


def calculate_shipping(subtotal: Decimal) -> Decimal:
    from django.conf import settings

    free_threshold = Decimal(str(settings.FREE_SHIPPING_THRESHOLD))
    if subtotal >= free_threshold or subtotal == 0:
        return Decimal("0.00")
    return Decimal(str(settings.DEFAULT_SHIPPING_FEE))


def apply_coupon(subtotal: Decimal, coupon_code: str):
    """Return (discount, coupon) for a valid coupon, else (0, None)."""
    from apps.promotions.models import Coupon

    if not coupon_code:
        return Decimal("0.00"), None
    coupon = Coupon.objects.filter(code__iexact=coupon_code).first()
    if not coupon or not coupon.is_valid(subtotal):
        raise ValidationError("Invalid or expired coupon.")
    return coupon.calculate_discount(subtotal), coupon


@transaction.atomic
def create_order_from_cart(request, *, shipping_address, payment_method, coupon_code="", notes=""):
    """Create an Order from the current user's cart and decrement stock."""
    cart = get_or_create_cart(request)
    items = list(cart.items.select_related("book").all())
    if not items:
        raise ValidationError("Your cart is empty.")

    # Validate stock availability up front.
    for item in items:
        if item.book.stock < item.quantity:
            raise ValidationError(
                f"Insufficient stock for '{item.book.title}'."
            )

    subtotal = sum((item.total_price for item in items), Decimal("0.00"))
    discount, coupon = apply_coupon(subtotal, coupon_code)
    shipping_fee = calculate_shipping(subtotal - discount)
    total = subtotal - discount + shipping_fee

    user = request.user if request.user.is_authenticated else None
    order = Order.objects.create(
        user=user,
        status=Order.Status.PENDING,
        payment_method=payment_method,
        email=getattr(user, "email", "") or shipping_address.get("email", ""),
        phone=shipping_address.get("phone", ""),
        shipping_address=shipping_address,
        subtotal=subtotal,
        shipping_fee=shipping_fee,
        discount=discount,
        total=total,
        coupon_code=coupon.code if coupon else "",
        notes=notes,
    )

    order_items = []
    for item in items:
        order_items.append(
            OrderItem(
                order=order,
                book=item.book,
                quantity=item.quantity,
                unit_price=item.unit_price,
                total_price=item.total_price,
                title_snapshot=item.book.title,
                cover_snapshot=item.book.cover_image,
            )
        )
        Book.objects.filter(pk=item.book.pk).update(
            stock=F("stock") - item.quantity,
            sale_count=F("sale_count") + item.quantity,
        )
    OrderItem.objects.bulk_create(order_items)

    if coupon:
        coupon.register_use()

    cart.items.all().delete()

    transaction.on_commit(lambda: send_order_confirmation_task.delay(order.id))
    return order


@transaction.atomic
def cancel_order(order: Order) -> Order:
    if order.status in (Order.Status.SHIPPED, Order.Status.DELIVERED):
        raise ValidationError("This order can no longer be cancelled.")
    if order.status == Order.Status.CANCELLED:
        raise ValidationError("This order is already cancelled.")

    for item in order.items.all():
        if item.book:
            Book.objects.filter(pk=item.book.pk).update(
                stock=F("stock") + item.quantity
            )
    order.status = Order.Status.CANCELLED
    order.save(update_fields=["status", "updated_at"])
    return order
