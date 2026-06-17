from rest_framework import permissions, viewsets

from .models import StockItem, StockMovement
from .serializers import StockItemSerializer, StockMovementSerializer


class StockItemViewSet(viewsets.ModelViewSet):
    serializer_class = StockItemSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = StockItem.objects.select_related("book").prefetch_related("movements")


class StockMovementViewSet(viewsets.ModelViewSet):
    serializer_class = StockMovementSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = StockMovement.objects.select_related("stock_item")
