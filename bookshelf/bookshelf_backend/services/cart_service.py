"""Cart business logic.

All cart mutations flow through this module so that views remain thin and the
same logic can be reused by the order flow, tests, and management commands.
"""
from __future__ import annotations

from typing import Optional

from django.contrib.auth import get_user_model

from apps.catalogue.models import Book
from apps.orders.models import Cart, CartItem

User = get_user_model()


def get_or_create_cart(
    user: Optional["User"] = None, session_id: Optional[str] = None
) -> Cart:
    """Return the active cart for a user or anonymous session, creating it."""
    if user and user.is_authenticated:
        cart, _ = Cart.objects.get_or_create(user=user)
        return cart
    if not session_id:
        raise ValueError("A session_id is required for anonymous carts.")
    cart, _ = Cart.objects.get_or_create(session_id=session_id, user=None)
    return cart


def add_item(cart: Cart, book: Book, quantity: int = 1) -> CartItem:
    """Add ``quantity`` of ``book`` to the cart (incrementing if present)."""
    item, created = CartItem.objects.get_or_create(
        cart=cart, book=book, defaults={"quantity": quantity}
    )
    if not created:
        item.quantity += quantity
        item.save(update_fields=["quantity", "updated_at"])
    return item


def update_item(cart: Cart, item_id: int, quantity: int) -> CartItem:
    """Set the absolute quantity for a cart item."""
    item = CartItem.objects.get(cart=cart, pk=item_id)
    item.quantity = quantity
    item.save(update_fields=["quantity", "updated_at"])
    return item


def remove_item(cart: Cart, item_id: int) -> None:
    CartItem.objects.filter(cart=cart, pk=item_id).delete()


def clear_cart(cart: Cart) -> None:
    cart.items.all().delete()


def merge_carts(session_cart: Cart, user_cart: Cart) -> Cart:
    """Merge an anonymous session cart into the authenticated user's cart."""
    for item in session_cart.items.all():
        add_item(user_cart, item.book, item.quantity)
    session_cart.delete()
    return user_cart
