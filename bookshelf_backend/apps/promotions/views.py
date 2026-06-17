from rest_framework import permissions
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from core.utils import error_response, success_response

from .models import Banner, Coupon, FlashSale
from .serializers import (
    BannerSerializer,
    CouponSerializer,
    CouponValidationSerializer,
    FlashSaleSerializer,
)


class BannerListView(ListAPIView):
    serializer_class = BannerSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None
    queryset = Banner.objects.filter(is_active=True)


class FlashSaleListView(ListAPIView):
    serializer_class = FlashSaleSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None
    queryset = FlashSale.objects.filter(is_active=True)


class ApplyCouponView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = CouponValidationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        code = serializer.validated_data["code"]
        amount = serializer.validated_data["order_amount"]
        coupon = Coupon.objects.filter(code__iexact=code).first()
        if not coupon or not coupon.is_valid(amount):
            return Response(error_response("Invalid or expired coupon."), status=400)
        discount = coupon.calculate_discount(amount)
        return Response(
            success_response(
                {
                    "coupon": CouponSerializer(coupon).data,
                    "discount": discount,
                    "total_after_discount": amount - discount,
                },
                "Coupon applied",
            )
        )
