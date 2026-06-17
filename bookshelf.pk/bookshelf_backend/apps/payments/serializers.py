"""Serializers for the payments app."""
from __future__ import annotations

from rest_framework import serializers

from .models import Payment, Transaction


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ("id", "transaction_id", "status", "amount", "created_at")


class PaymentSerializer(serializers.ModelSerializer):
    transactions = TransactionSerializer(many=True, read_only=True)

    class Meta:
        model = Payment
        fields = (
            "id",
            "order",
            "provider",
            "status",
            "amount",
            "currency",
            "reference",
            "transactions",
            "created_at",
        )


class PaymentIntentSerializer(serializers.Serializer):
    order_number = serializers.CharField()
