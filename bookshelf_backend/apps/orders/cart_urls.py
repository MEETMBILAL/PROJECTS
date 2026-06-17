"""Cart URLs (mounted under /api/v1/cart/)."""
from django.urls import path

from .views import (
    ApplyCouponView,
    CartAddView,
    CartClearView,
    CartRemoveView,
    CartUpdateView,
    CartView,
)

app_name = "cart"

urlpatterns = [
    path("", CartView.as_view(), name="detail"),
    path("add/", CartAddView.as_view(), name="add"),
    path("update/<int:item_id>/", CartUpdateView.as_view(), name="update"),
    path("remove/<int:item_id>/", CartRemoveView.as_view(), name="remove"),
    path("clear/", CartClearView.as_view(), name="clear"),
    path("apply-coupon/", ApplyCouponView.as_view(), name="apply-coupon"),
]
