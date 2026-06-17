"""Serializers for promotions."""
from rest_framework import serializers

from apps.catalogue.serializers import BookListSerializer

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
            "cta_text",
            "placement",
            "order",
        ]


class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = [
            "id",
            "code",
            "description",
            "discount_type",
            "discount_value",
            "min_order_amount",
            "valid_until",
        ]


class FlashSaleSerializer(serializers.ModelSerializer):
    books = BookListSerializer(many=True, read_only=True)
    is_live = serializers.BooleanField(read_only=True)

    class Meta:
        model = FlashSale
        fields = [
            "id",
            "title",
            "description",
            "books",
            "discount_percentage",
            "starts_at",
            "ends_at",
            "is_live",
        ]
