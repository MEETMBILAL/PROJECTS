"""Order creation and lifecycle business logic."""
from __future__ import annotations

from decimal import Decimal

from django.conf import settings
from django.db import transaction

from apps.catalogue.models import Book
from apps.inventory.models import StockMovement
from apps.orders.models import Cart, Order, OrderItem


class OrderError(Exception):
    """Raised when an order cannot be created (empty cart, no stock, ...)."""


def calculate_shipping(subtotal: Decimal) -> Decimal:
    """Free shipping above the configured threshold, flat fee otherwise."""
    threshold = Decimal(str(settings.FREE_SHIPPING_THRESHOLD))
    if subtotal >= threshold:
        return Decimal("0")
    return Decimal(str(settings.DEFAULT_SHIPPING_FEE))


def apply_coupon(subtotal: Decimal, coupon_code: str) -> Decimal:
    """Return the discount amount for a coupon code, or zero if invalid."""
    if not coupon_code:
        return Decimal("0")
    # Imported lazily to avoid a hard dependency cycle with promotions.
    from apps.promotions.models import Coupon

    coupon = Coupon.objects.filter(code__iexact=coupon_code).first()
    if not coupon or not coupon.is_valid(subtotal):
        return Decimal("0")
    return coupon.discount_amount(subtotal)


@transaction.atomic
def create_order_from_cart(
    *,
    cart: Cart,
    shipping_address: dict,
    payment_method: str,
    contact_email: str = "",
    contact_phone: str = "",
    coupon_code: str = "",
    notes: str = "",
) -> Order:
    """Convert a cart into a confirmed order, decrementing stock atomically.

    Raises :class:`OrderError` when the cart is empty or stock is insufficient.
    """
    items = list(cart.items.select_related("book").all())
    if not items:
        raise OrderError("Cannot create an order from an empty cart.")

    subtotal = Decimal("0")
    # Lock book rows to prevent overselling under concurrency.
    book_ids = [item.book_id for item in items]
    locked_books = {
        book.id: book
        for book in Book.objects.select_for_update().filter(id__in=book_ids)
    }
    for item in items:
        book = locked_books[item.book_id]
        if book.stock < item.quantity:
            raise OrderError(f"Insufficient stock for '{book.title}'.")
        subtotal += book.effective_price * item.quantity

    shipping_fee = calculate_shipping(subtotal)
    discount = apply_coupon(subtotal, coupon_code)
    total = subtotal + shipping_fee - discount
    if total < 0:
        total = Decimal("0")

    order = Order.objects.create(
        user=cart.user,
        shipping_address=shipping_address,
        payment_method=payment_method,
        contact_email=contact_email,
        contact_phone=contact_phone,
        subtotal=subtotal,
        shipping_fee=shipping_fee,
        discount=discount,
        total=total,
        coupon_code=coupon_code,
        notes=notes,
    )

    for item in items:
        book = locked_books[item.book_id]
        OrderItem.objects.create(
            order=order,
            book=book,
            quantity=item.quantity,
            unit_price=book.effective_price,
            total_price=book.effective_price * item.quantity,
            title_snapshot=book.title,
            cover_snapshot=book.cover_image,
        )
        book.stock -= item.quantity
        book.sale_count += item.quantity
        book.save(update_fields=["stock", "sale_count"])
        StockMovement.objects.create(
            book=book,
            movement_type=StockMovement.MovementType.OUTBOUND,
            quantity=-item.quantity,
            reference=order.order_number,
            note="Order placed.",
        )

    cart.items.all().delete()

    # Fire the confirmation email asynchronously (eager in dev).
    try:
        from apps.orders.tasks import send_order_confirmation_email

        send_order_confirmation_email.delay(order.pk)
    except Exception:
        pass

    return order


@transaction.atomic
def cancel_order(order: Order) -> Order:
    """Cancel an order and restock its items."""
    if order.status in {Order.Status.SHIPPED, Order.Status.DELIVERED}:
        raise OrderError("Shipped or delivered orders cannot be cancelled.")
    if order.status == Order.Status.CANCELLED:
        return order

    for item in order.items.select_related("book").all():
        if item.book:
            item.book.stock += item.quantity
            item.book.save(update_fields=["stock"])
            StockMovement.objects.create(
                book=item.book,
                movement_type=StockMovement.MovementType.RETURN,
                quantity=item.quantity,
                reference=order.order_number,
                note="Order cancelled.",
            )
    order.status = Order.Status.CANCELLED
    order.save(update_fields=["status", "updated_at"])
    return order
