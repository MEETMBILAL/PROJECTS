"""Views for the promotions app."""
from __future__ import annotations

from django.utils import timezone
from rest_framework import permissions, viewsets

from .models import Banner, FlashSale
from .serializers import BannerSerializer, FlashSaleSerializer


class BannerViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = BannerSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None
    filterset_fields = ["placement"]

    def get_queryset(self):
        return Banner.objects.filter(is_active=True)


class FlashSaleViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = FlashSaleSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    def get_queryset(self):
        now = timezone.now()
        return FlashSale.objects.filter(
            is_active=True, starts_at__lte=now, ends_at__gte=now
        )
