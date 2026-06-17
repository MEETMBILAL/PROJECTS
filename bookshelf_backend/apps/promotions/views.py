"""Views for promotions."""
from django.utils import timezone
from rest_framework import viewsets

from .models import Banner, FlashSale
from .serializers import BannerSerializer, FlashSaleSerializer


class BannerViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = BannerSerializer
    pagination_class = None

    def get_queryset(self):
        queryset = Banner.objects.filter(is_active=True)
        placement = self.request.query_params.get("placement")
        if placement:
            queryset = queryset.filter(placement=placement)
        return queryset


class FlashSaleViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = FlashSaleSerializer
    pagination_class = None

    def get_queryset(self):
        now = timezone.now()
        return (
            FlashSale.objects.filter(
                is_active=True, starts_at__lte=now, ends_at__gte=now
            )
            .prefetch_related("books")
        )
