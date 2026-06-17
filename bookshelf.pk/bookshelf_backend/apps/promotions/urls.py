"""URL routes for the promotions app."""
from __future__ import annotations

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import BannerViewSet, FlashSaleViewSet

router = DefaultRouter()
router.register("banners", BannerViewSet, basename="banner")
router.register("flash-sales", FlashSaleViewSet, basename="flashsale")

urlpatterns = [path("", include(router.urls))]
