"""URL routes for carts and orders."""
from __future__ import annotations

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    CartAddView,
    CartApplyCouponView,
    CartClearView,
    CartRemoveView,
    CartUpdateView,
    CartView,
    OrderViewSet,
)

router = DefaultRouter()
router.register("orders", OrderViewSet, basename="order")

cart_patterns = [
    path("", CartView.as_view(), name="cart"),
    path("add/", CartAddView.as_view(), name="cart-add"),
    path("update/<int:item_id>/", CartUpdateView.as_view(), name="cart-update"),
    path("remove/<int:item_id>/", CartRemoveView.as_view(), name="cart-remove"),
    path("clear/", CartClearView.as_view(), name="cart-clear"),
    path("apply-coupon/", CartApplyCouponView.as_view(), name="cart-coupon"),
]

urlpatterns = [
    path("cart/", include(cart_patterns)),
    path("", include(router.urls)),
]
