"""Views for the inventory app (staff-only)."""
from __future__ import annotations

from rest_framework import permissions, viewsets

from .models import StockItem, StockMovement
from .serializers import StockItemSerializer, StockMovementSerializer


class StockItemViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = StockItem.objects.select_related("book").all()
    serializer_class = StockItemSerializer
    permission_classes = [permissions.IsAdminUser]


class StockMovementViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = StockMovement.objects.select_related("book").all()
    serializer_class = StockMovementSerializer
    permission_classes = [permissions.IsAdminUser]
