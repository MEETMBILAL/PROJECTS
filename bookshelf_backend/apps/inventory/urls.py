from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import StockItemViewSet, StockMovementViewSet

router = DefaultRouter()
router.register("inventory/stock-items", StockItemViewSet, basename="stock-item")
router.register("inventory/movements", StockMovementViewSet, basename="stock-movement")

urlpatterns = [path("", include(router.urls))]
