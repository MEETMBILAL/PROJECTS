"""Cart business logic."""
from __future__ import annotations

from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError

from apps.catalogue.models import Book
from apps.orders.models import Cart, CartItem


def get_or_create_cart(request) -> Cart:
    """Resolve the cart for the current request (user-based or session-based)."""
    if request.user and request.user.is_authenticated:
        cart, _ = Cart.objects.get_or_create(user=request.user)
        # Merge an anonymous session cart into the user cart on login.
        session_id = request.session.session_key
        if session_id:
            session_cart = Cart.objects.filter(
                session_id=session_id, user__isnull=True
            ).first()
            if session_cart and session_cart.pk != cart.pk:
                _merge_carts(session_cart, cart)
        return cart

    if not request.session.session_key:
        request.session.create()
    session_id = request.session.session_key
    cart, _ = Cart.objects.get_or_create(session_id=session_id, user__isnull=True)
    return cart


def _merge_carts(source: Cart, target: Cart) -> None:
    for item in source.items.all():
        existing = target.items.filter(book=item.book).first()
        if existing:
            existing.quantity += item.quantity
            existing.save()
        else:
            item.cart = target
            item.save()
    source.delete()


def add_to_cart(request, book_id: int, quantity: int = 1) -> CartItem:
    if quantity < 1:
        raise ValidationError("Quantity must be at least 1.")
    cart = get_or_create_cart(request)
    book = get_object_or_404(Book, pk=book_id, is_active=True)
    if book.stock < quantity:
        raise ValidationError(f"Only {book.stock} copies of '{book.title}' available.")

    item, created = CartItem.objects.get_or_create(cart=cart, book=book)
    new_quantity = quantity if created else item.quantity + quantity
    if new_quantity > book.stock:
        raise ValidationError(f"Only {book.stock} copies of '{book.title}' available.")
    item.quantity = new_quantity
    item.save()
    return item


def update_cart_item(request, item_id: int, quantity: int) -> CartItem:
    cart = get_or_create_cart(request)
    item = get_object_or_404(CartItem, pk=item_id, cart=cart)
    if quantity < 1:
        item.delete()
        return None
    if quantity > item.book.stock:
        raise ValidationError(f"Only {item.book.stock} copies available.")
    item.quantity = quantity
    item.save()
    return item


def remove_cart_item(request, item_id: int) -> None:
    cart = get_or_create_cart(request)
    item = get_object_or_404(CartItem, pk=item_id, cart=cart)
    item.delete()


def clear_cart(request) -> None:
    cart = get_or_create_cart(request)
    cart.items.all().delete()
