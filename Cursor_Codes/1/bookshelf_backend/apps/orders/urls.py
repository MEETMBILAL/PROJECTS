"""Order & cart URLs (mounted under /api/v1/)."""
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import CartActionsView, CartView, OrderViewSet

router = DefaultRouter()
router.register("orders", OrderViewSet, basename="order")

urlpatterns = [
    path("cart/", CartView.as_view(), name="cart"),
    path(
        "cart/<str:op>/",
        CartActionsView.as_view(),
        name="cart-action",
    ),
    path(
        "cart/<str:op>/<int:item_id>/",
        CartActionsView.as_view(),
        name="cart-item-action",
    ),
    path("", include(router.urls)),
]
