from django.urls import path

from .views import ApplyCouponView, BannerListView, FlashSaleListView

urlpatterns = [
    path("banners/", BannerListView.as_view(), name="banners"),
    path("flash-sales/", FlashSaleListView.as_view(), name="flash-sales"),
    path("cart/apply-coupon/", ApplyCouponView.as_view(), name="apply-coupon"),
]
