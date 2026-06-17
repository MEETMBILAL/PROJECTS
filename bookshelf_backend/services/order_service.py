"""Business logic for order creation and lifecycle."""
from __future__ import annotations

from decimal import Decimal

from django.conf import settings
from django.db import transaction

from apps.orders.models import Cart, Order, OrderItem
from apps.promotions.models import Coupon
from core.utils import generate_order_number


class OrderService:
    """Creates orders from carts, applying shipping and discounts."""

    @staticmethod
    def _shipping_fee(subtotal: Decimal) -> Decimal:
        threshold = Decimal(str(settings.FREE_SHIPPING_THRESHOLD))
        if subtotal >= threshold:
            return Decimal("0.00")
        return Decimal(str(settings.DEFAULT_SHIPPING_FEE))

    @staticmethod
    def _coupon_discount(coupon_code: str, subtotal: Decimal) -> Decimal:
        if not coupon_code:
            return Decimal("0.00")
        try:
            coupon = Coupon.objects.get(code__iexact=coupon_code, is_active=True)
        except Coupon.DoesNotExist:
            return Decimal("0.00")
        if not coupon.is_valid(subtotal):
            return Decimal("0.00")
        return coupon.calculate_discount(subtotal)

    @classmethod
    @transaction.atomic
    def create_order_from_cart(
        cls,
        *,
        cart: Cart,
        user,
        shipping_address: dict,
        coupon_code: str = "",
        notes: str = "",
    ) -> Order:
        """Convert a cart into a confirmed order, snapshotting prices."""
        items = list(cart.items.select_related("book"))
        if not items:
            raise ValueError("Cannot create an order from an empty cart.")

        subtotal = sum(
            (item.book.effective_price * item.quantity for item in items),
            Decimal("0.00"),
        )
        shipping_fee = cls._shipping_fee(subtotal)
        discount = cls._coupon_discount(coupon_code, subtotal)
        total = subtotal + shipping_fee - discount

        order = Order.objects.create(
            user=user if user and user.is_authenticated else None,
            order_number=generate_order_number(),
            status="pending",
            shipping_address=shipping_address,
            subtotal=subtotal,
            shipping_fee=shipping_fee,
            discount=discount,
            total=total,
            coupon_code=coupon_code,
            notes=notes,
        )

        order_items = []
        for item in items:
            book = item.book
            unit_price = book.effective_price
            order_items.append(
                OrderItem(
                    order=order,
                    book=book,
                    quantity=item.quantity,
                    unit_price=unit_price,
                    total_price=unit_price * item.quantity,
                    title_snapshot=book.title,
                )
            )
            book.stock = max(book.stock - item.quantity, 0)
            book.sale_count += item.quantity
            book.save(update_fields=["stock", "sale_count", "updated_at"])

        OrderItem.objects.bulk_create(order_items)
        cart.items.all().delete()
        return order

    @staticmethod
    def cancel_order(order: Order) -> Order:
        if order.status in {"shipped", "delivered", "cancelled", "refunded"}:
            raise ValueError(f"Cannot cancel an order in '{order.status}' state.")
        order.status = "cancelled"
        order.save(update_fields=["status", "updated_at"])
        return order
