"""Business logic for creating and managing orders."""
from __future__ import annotations

from decimal import Decimal

from django.conf import settings
from django.db import transaction

from apps.inventory.models import StockMovement
from apps.orders.models import Cart, Order, OrderItem
from apps.promotions.models import Coupon
from core.exceptions import ServiceError


def calculate_shipping_fee(subtotal: Decimal) -> Decimal:
    """Free shipping above the configured threshold, otherwise a flat fee."""
    threshold = Decimal(str(settings.FREE_SHIPPING_THRESHOLD))
    flat = Decimal(str(settings.DEFAULT_SHIPPING_FEE))
    if subtotal >= threshold:
        return Decimal("0.00")
    return flat


def resolve_coupon_discount(code: str, subtotal: Decimal) -> tuple[Decimal, Coupon | None]:
    """Validate a coupon code and return the discount + coupon instance."""
    if not code:
        return Decimal("0.00"), None
    try:
        coupon = Coupon.objects.get(code__iexact=code)
    except Coupon.DoesNotExist as exc:
        raise ServiceError("Invalid coupon code.", status_code=404) from exc
    if not coupon.is_valid():
        raise ServiceError("This coupon is no longer valid.")
    discount = coupon.calculate_discount(subtotal)
    if discount <= 0:
        raise ServiceError(
            f"This coupon requires a minimum order of "
            f"{coupon.min_order_amount} {settings.DEFAULT_CURRENCY}."
        )
    return discount, coupon


@transaction.atomic
def create_order_from_cart(
    *,
    user,
    cart: Cart,
    shipping_address: dict,
    payment_method: str = Order.PaymentMethod.COD,
    coupon_code: str = "",
    notes: str = "",
) -> Order:
    """Convert a cart into an order, decrementing stock atomically."""
    items = list(cart.items.select_related("book"))
    if not items:
        raise ServiceError("Your cart is empty.")

    for item in items:
        if item.quantity > item.book.stock:
            raise ServiceError(
                f"Not enough stock for '{item.book.title}'. "
                f"Only {item.book.stock} left."
            )

    subtotal = sum((item.total_price for item in items), Decimal("0.00"))
    discount, coupon = resolve_coupon_discount(coupon_code, subtotal)
    shipping_fee = calculate_shipping_fee(subtotal)
    total = subtotal - discount + shipping_fee

    order = Order.objects.create(
        user=user,
        status=Order.Status.PENDING,
        payment_method=payment_method,
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
        book = item.book
        book.stock -= item.quantity
        book.sale_count += item.quantity
        book.save(update_fields=["stock", "sale_count", "updated_at"])
        StockMovement.objects.create(
            book=book,
            movement_type=StockMovement.MovementType.OUTBOUND,
            quantity=-item.quantity,
            reason="Order placed",
            reference=order.order_number,
        )
    OrderItem.objects.bulk_create(order_items)

    if coupon:
        coupon.used_count += 1
        coupon.save(update_fields=["used_count", "updated_at"])

    cart.items.all().delete()
    return order


@transaction.atomic
def cancel_order(*, order: Order) -> Order:
    """Cancel an order and restock its items."""
    if order.status in {Order.Status.SHIPPED, Order.Status.DELIVERED}:
        raise ServiceError("Shipped or delivered orders cannot be cancelled.")
    if order.status == Order.Status.CANCELLED:
        raise ServiceError("This order is already cancelled.")

    for item in order.items.select_related("book"):
        if item.book:
            item.book.stock += item.quantity
            item.book.save(update_fields=["stock", "updated_at"])
            StockMovement.objects.create(
                book=item.book,
                movement_type=StockMovement.MovementType.INBOUND,
                quantity=item.quantity,
                reason="Order cancelled",
                reference=order.order_number,
            )
    order.status = Order.Status.CANCELLED
    order.save(update_fields=["status", "updated_at"])
    return order
