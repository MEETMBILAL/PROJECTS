"""Serializers for carts and orders."""
from __future__ import annotations

from rest_framework import serializers

from apps.catalogue.serializers import BookListSerializer

from .models import Cart, CartItem, Order, OrderItem


class CartItemSerializer(serializers.ModelSerializer):
    book = BookListSerializer(read_only=True)
    unit_price = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )
    total_price = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )

    class Meta:
        model = CartItem
        fields = ("id", "book", "quantity", "unit_price", "total_price")


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    subtotal = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )
    total_items = serializers.IntegerField(read_only=True)

    class Meta:
        model = Cart
        fields = ("id", "items", "subtotal", "total_items", "updated_at")


class AddToCartSerializer(serializers.Serializer):
    book_id = serializers.IntegerField()
    quantity = serializers.IntegerField(default=1, min_value=1)


class UpdateCartItemSerializer(serializers.Serializer):
    quantity = serializers.IntegerField(min_value=1)


class ApplyCouponSerializer(serializers.Serializer):
    code = serializers.CharField()


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = (
            "id",
            "book",
            "title_snapshot",
            "cover_snapshot",
            "quantity",
            "unit_price",
            "total_price",
        )


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    total_items = serializers.IntegerField(read_only=True)
    status_display = serializers.CharField(
        source="get_status_display", read_only=True
    )

    class Meta:
        model = Order
        fields = (
            "id",
            "order_number",
            "status",
            "status_display",
            "payment_method",
            "is_paid",
            "shipping_address",
            "subtotal",
            "shipping_fee",
            "discount",
            "total",
            "coupon_code",
            "notes",
            "tracking_number",
            "total_items",
            "items",
            "created_at",
        )
        read_only_fields = fields


class CreateOrderSerializer(serializers.Serializer):
    shipping_address = serializers.JSONField()
    payment_method = serializers.ChoiceField(
        choices=Order.PaymentMethod.choices, default=Order.PaymentMethod.COD
    )
    coupon_code = serializers.CharField(required=False, allow_blank=True, default="")
    notes = serializers.CharField(required=False, allow_blank=True, default="")
