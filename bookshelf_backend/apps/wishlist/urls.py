"""Wishlist URLs (mounted under /api/v1/wishlist/)."""
from django.urls import path

from .views import WishlistAddView, WishlistRemoveView, WishlistView

app_name = "wishlist"

urlpatterns = [
    path("", WishlistView.as_view(), name="list"),
    path("add/", WishlistAddView.as_view(), name="add"),
    path("remove/<int:book_id>/", WishlistRemoveView.as_view(), name="remove"),
]
