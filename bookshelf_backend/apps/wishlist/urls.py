from django.urls import path

from .views import WishlistAddView, WishlistRemoveView, WishlistView

urlpatterns = [
    path("", WishlistView.as_view(), name="wishlist"),
    path("add/", WishlistAddView.as_view(), name="wishlist-add"),
    path("remove/<int:book_id>/", WishlistRemoveView.as_view(), name="wishlist-remove"),
]
