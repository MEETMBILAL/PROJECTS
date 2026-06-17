"""Serializers for cart and orders."""
from __future__ import annotations

from rest_framework import serializers

from apps.catalogue.models import Book
from apps.catalogue.serializers import BookListSerializer

from .models import Cart, CartItem, Order, OrderItem


class CartItemSerializer(serializers.ModelSerializer):
    book = BookListSerializer(read_only=True)
    book_id = serializers.PrimaryKeyRelatedField(
        queryset=Book.objects.filter(is_active=True),
        source="book",
        write_only=True,
    )
    unit_price = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )
    total_price = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )

    class Meta:
        model = CartItem
        fields = [
            "id",
            "book",
            "book_id",
            "quantity",
            "unit_price",
            "total_price",
        ]


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    subtotal = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )
    total_items = serializers.IntegerField(read_only=True)

    class Meta:
        model = Cart
        fields = ["id", "items", "subtotal", "total_items"]


class AddToCartSerializer(serializers.Serializer):
    book_id = serializers.PrimaryKeyRelatedField(
        queryset=Book.objects.filter(is_active=True)
    )
    quantity = serializers.IntegerField(min_value=1, default=1)


class UpdateCartItemSerializer(serializers.Serializer):
    quantity = serializers.IntegerField(min_value=1)


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = [
            "id",
            "book",
            "quantity",
            "unit_price",
            "total_price",
            "title_snapshot",
            "cover_snapshot",
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "order_number",
            "status",
            "payment_method",
            "is_paid",
            "shipping_address",
            "contact_email",
            "contact_phone",
            "subtotal",
            "shipping_fee",
            "discount",
            "total",
            "coupon_code",
            "notes",
            "items",
            "created_at",
        ]
        read_only_fields = fields


class CreateOrderSerializer(serializers.Serializer):
    shipping_address = serializers.JSONField()
    payment_method = serializers.ChoiceField(
        choices=Order.PaymentMethod.choices,
        default=Order.PaymentMethod.COD,
    )
    contact_email = serializers.EmailField(required=False, allow_blank=True)
    contact_phone = serializers.CharField(
        required=False, allow_blank=True, max_length=20
    )
    coupon_code = serializers.CharField(
        required=False, allow_blank=True, max_length=50
    )
    notes = serializers.CharField(required=False, allow_blank=True)
