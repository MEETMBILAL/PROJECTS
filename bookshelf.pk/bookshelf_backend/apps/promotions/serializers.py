"""Serializers for the promotions app."""
from __future__ import annotations

from rest_framework import serializers

from .models import Banner, Coupon, FlashSale


class BannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = ("id", "title", "subtitle", "image", "link", "placement", "order")


class CouponSerializer(serializers.ModelSerializer):
    is_valid = serializers.BooleanField(read_only=True)

    class Meta:
        model = Coupon
        fields = (
            "id",
            "code",
            "description",
            "discount_type",
            "value",
            "min_order_amount",
            "max_discount",
            "valid_until",
            "is_valid",
        )


class FlashSaleSerializer(serializers.ModelSerializer):
    is_live = serializers.BooleanField(read_only=True)

    class Meta:
        model = FlashSale
        fields = (
            "id",
            "name",
            "description",
            "discount_percentage",
            "starts_at",
            "ends_at",
            "is_live",
        )
