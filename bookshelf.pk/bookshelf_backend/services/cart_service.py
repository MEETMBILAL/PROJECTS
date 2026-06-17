"""Business logic for cart operations.

Carts can be owned by an authenticated user or, for anonymous visitors,
keyed by a session id supplied via the ``X-Session-Id`` header.
"""
from __future__ import annotations

from django.db import transaction

from apps.catalogue.models import Book
from apps.orders.models import Cart, CartItem
from core.exceptions import ServiceError


def get_or_create_cart(*, user=None, session_id: str | None = None) -> Cart:
    """Return the cart for the given user or session, creating it if needed."""
    if user is not None and user.is_authenticated:
        cart, _ = Cart.objects.get_or_create(user=user)
        return cart
    if not session_id:
        raise ServiceError(
            "A session id is required for anonymous carts.", status_code=400
        )
    cart, _ = Cart.objects.get_or_create(session_id=session_id, user__isnull=True)
    return cart


@transaction.atomic
def add_to_cart(*, cart: Cart, book_id: int, quantity: int = 1) -> CartItem:
    """Add ``quantity`` of a book to the cart (or increment if present)."""
    if quantity < 1:
        raise ServiceError("Quantity must be at least 1.")
    try:
        book = Book.objects.get(pk=book_id, is_active=True)
    except Book.DoesNotExist as exc:
        raise ServiceError("Book not found.", status_code=404) from exc

    item, created = CartItem.objects.get_or_create(cart=cart, book=book)
    new_quantity = quantity if created else item.quantity + quantity
    if new_quantity > book.stock:
        raise ServiceError(
            f"Only {book.stock} copies of '{book.title}' are in stock."
        )
    item.quantity = new_quantity
    item.save()
    return item


@transaction.atomic
def update_cart_item(*, cart: Cart, item_id: int, quantity: int) -> CartItem:
    """Set the absolute quantity for a cart item."""
    try:
        item = cart.items.select_related("book").get(pk=item_id)
    except CartItem.DoesNotExist as exc:
        raise ServiceError("Cart item not found.", status_code=404) from exc
    if quantity < 1:
        raise ServiceError("Quantity must be at least 1.")
    if quantity > item.book.stock:
        raise ServiceError(f"Only {item.book.stock} copies are in stock.")
    item.quantity = quantity
    item.save()
    return item


def remove_cart_item(*, cart: Cart, item_id: int) -> None:
    deleted, _ = cart.items.filter(pk=item_id).delete()
    if not deleted:
        raise ServiceError("Cart item not found.", status_code=404)


def clear_cart(*, cart: Cart) -> None:
    cart.items.all().delete()


def merge_carts(*, user_cart: Cart, session_cart: Cart) -> Cart:
    """Merge an anonymous session cart into an authenticated user's cart."""
    for item in session_cart.items.select_related("book"):
        existing = user_cart.items.filter(book=item.book).first()
        if existing:
            existing.quantity = min(
                existing.quantity + item.quantity, item.book.stock
            )
            existing.save()
        else:
            item.cart = user_cart
            item.save()
    session_cart.delete()
    return user_cart
