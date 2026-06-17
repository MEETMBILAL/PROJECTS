"""Serializers for payments."""
from __future__ import annotations

from rest_framework import serializers

from apps.orders.models import Order

from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            "id",
            "order",
            "gateway",
            "status",
            "amount",
            "currency",
            "reference",
            "created_at",
        ]
        read_only_fields = fields


class PaymentInitSerializer(serializers.Serializer):
    order_number = serializers.SlugRelatedField(
        slug_field="order_number",
        queryset=Order.objects.all(),
        source="order",
    )
