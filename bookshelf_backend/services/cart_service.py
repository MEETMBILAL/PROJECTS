"""Business logic for cart operations."""
from __future__ import annotations

from decimal import Decimal

from django.db import transaction

from apps.catalogue.models import Book
from apps.orders.models import Cart, CartItem


class CartService:
    """Encapsulates cart retrieval and mutation logic."""

    @staticmethod
    def get_or_create_cart(user=None, session_id: str | None = None) -> Cart:
        """Return the active cart for an authenticated user or anonymous session."""
        if user and user.is_authenticated:
            cart, _ = Cart.objects.get_or_create(user=user)
            return cart
        if not session_id:
            raise ValueError("A session_id is required for anonymous carts.")
        cart, _ = Cart.objects.get_or_create(session_id=session_id, user=None)
        return cart

    @staticmethod
    @transaction.atomic
    def add_item(cart: Cart, book_id: int, quantity: int = 1) -> CartItem:
        """Add a book to the cart or increment an existing line item."""
        book = Book.objects.get(pk=book_id, is_active=True)
        item, created = CartItem.objects.get_or_create(
            cart=cart, book=book, defaults={"quantity": quantity}
        )
        if not created:
            item.quantity += quantity
            item.save(update_fields=["quantity", "updated_at"])
        return item

    @staticmethod
    def update_item(item: CartItem, quantity: int) -> CartItem:
        if quantity <= 0:
            item.delete()
            return item
        item.quantity = quantity
        item.save(update_fields=["quantity", "updated_at"])
        return item

    @staticmethod
    def clear(cart: Cart) -> None:
        cart.items.all().delete()

    @staticmethod
    def get_totals(cart: Cart) -> dict:
        """Compute subtotal and item count for a cart."""
        subtotal = Decimal("0.00")
        count = 0
        for item in cart.items.select_related("book"):
            subtotal += item.book.effective_price * item.quantity
            count += item.quantity
        return {"subtotal": subtotal, "item_count": count}
