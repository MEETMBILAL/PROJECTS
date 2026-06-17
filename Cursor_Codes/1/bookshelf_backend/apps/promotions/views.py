"""Promotion views: banners, flash sales, coupon validation."""
from __future__ import annotations

from django.utils import timezone
from rest_framework import permissions
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Banner, Coupon, FlashSale
from .serializers import (
    BannerSerializer,
    CouponValidateSerializer,
    FlashSaleSerializer,
)


class BannerListView(ListAPIView):
    serializer_class = BannerSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    def get_queryset(self):
        queryset = Banner.objects.filter(is_active=True)
        placement = self.request.query_params.get("placement")
        if placement:
            queryset = queryset.filter(placement=placement)
        return queryset


class FlashSaleListView(ListAPIView):
    serializer_class = FlashSaleSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    def get_queryset(self):
        now = timezone.now()
        return FlashSale.objects.filter(
            is_active=True, starts_at__lte=now, ends_at__gte=now
        )


class CouponValidateView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = CouponValidateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        code = serializer.validated_data["code"]
        subtotal = serializer.validated_data["subtotal"]
        coupon = Coupon.objects.filter(code__iexact=code).first()
        if not coupon or not coupon.is_valid(subtotal):
            return Response(
                {"valid": False, "discount": "0", "message": "Invalid coupon."}
            )
        return Response(
            {
                "valid": True,
                "discount": str(coupon.discount_amount(subtotal)),
                "message": "Coupon applied.",
            }
        )
