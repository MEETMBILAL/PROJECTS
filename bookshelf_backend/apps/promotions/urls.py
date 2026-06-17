"""Promotion URLs (mounted under /api/v1/promotions/)."""
from rest_framework.routers import DefaultRouter

from .views import BannerViewSet, FlashSaleViewSet

app_name = "promotions"

router = DefaultRouter()
router.register("banners", BannerViewSet, basename="banner")
router.register("flash-sales", FlashSaleViewSet, basename="flash-sale")

urlpatterns = router.urls
