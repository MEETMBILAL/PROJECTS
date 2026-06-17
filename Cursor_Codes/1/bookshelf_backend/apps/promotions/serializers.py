"""Serializers for promotions."""
from __future__ import annotations

from rest_framework import serializers

from .models import Banner, Coupon, FlashSale


class BannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = [
            "id",
            "title",
            "subtitle",
            "image",
            "link",
            "placement",
            "order",
        ]


class CouponValidateSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=50)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2)


class FlashSaleSerializer(serializers.ModelSerializer):
    is_live = serializers.BooleanField(read_only=True)

    class Meta:
        model = FlashSale
        fields = [
            "id",
            "name",
            "description",
            "discount_percentage",
            "starts_at",
            "ends_at",
            "is_live",
        ]


class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = [
            "id",
            "code",
            "description",
            "discount_type",
            "value",
            "min_order_amount",
            "max_discount",
            "valid_to",
        ]
