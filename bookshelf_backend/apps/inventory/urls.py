"""Inventory URLs (mounted under /api/v1/inventory/)."""
from rest_framework.routers import DefaultRouter

from .views import StockItemViewSet, StockMovementViewSet

app_name = "inventory"

router = DefaultRouter()
router.register("stock-items", StockItemViewSet, basename="stock-item")
router.register("movements", StockMovementViewSet, basename="movement")

urlpatterns = router.urls
