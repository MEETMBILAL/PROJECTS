"""Views for inventory management (staff-only)."""
from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser

from .models import StockItem, StockMovement
from .serializers import StockItemSerializer, StockMovementSerializer


class StockItemViewSet(viewsets.ModelViewSet):
    queryset = StockItem.objects.select_related("book").all()
    serializer_class = StockItemSerializer
    permission_classes = [IsAdminUser]


class StockMovementViewSet(viewsets.ModelViewSet):
    queryset = StockMovement.objects.select_related("book").all()
    serializer_class = StockMovementSerializer
    permission_classes = [IsAdminUser]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
