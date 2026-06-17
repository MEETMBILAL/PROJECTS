"""URL routes for the inventory app."""
from __future__ import annotations

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import StockItemViewSet, StockMovementViewSet

router = DefaultRouter()
router.register("inventory/stock", StockItemViewSet, basename="stockitem")
router.register(
    "inventory/movements", StockMovementViewSet, basename="stockmovement"
)

urlpatterns = [path("", include(router.urls))]
