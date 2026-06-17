"""Serializers for payments."""
from rest_framework import serializers

from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            "id",
            "order",
            "gateway",
            "reference",
            "amount",
            "currency",
            "status",
            "created_at",
        ]
        read_only_fields = fields


class StripeIntentSerializer(serializers.Serializer):
    order_number = serializers.CharField()


class JazzCashInitiateSerializer(serializers.Serializer):
    order_number = serializers.CharField()
