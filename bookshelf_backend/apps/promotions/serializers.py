from rest_framework import serializers

from .models import Banner, Coupon, FlashSale


class BannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = ["id", "title", "subtitle", "image", "link", "cta_text", "position", "order"]


class CouponValidationSerializer(serializers.Serializer):
    code = serializers.CharField()
    order_amount = serializers.DecimalField(max_digits=10, decimal_places=2)


class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = ["code", "description", "discount_type", "discount_value", "min_order_amount"]


class FlashSaleSerializer(serializers.ModelSerializer):
    is_live = serializers.BooleanField(read_only=True)

    class Meta:
        model = FlashSale
        fields = ["id", "name", "description", "discount_percentage", "starts_at", "ends_at", "is_live"]
