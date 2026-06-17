"""Promotion URLs (mounted under /api/v1/)."""
from django.urls import path

from .views import BannerListView, CouponValidateView, FlashSaleListView

urlpatterns = [
    path("banners/", BannerListView.as_view(), name="banners"),
    path("flash-sales/", FlashSaleListView.as_view(), name="flash-sales"),
    path(
        "coupons/validate/",
        CouponValidateView.as_view(),
        name="coupon-validate",
    ),
]
