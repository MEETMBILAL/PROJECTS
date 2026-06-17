from rest_framework import serializers

from .models import Payment, Transaction


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ["id", "order", "method", "status", "amount", "currency", "reference", "created_at"]
        read_only_fields = ["id", "status", "created_at"]


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ["id", "payment", "gateway", "gateway_transaction_id", "is_successful", "created_at"]


class StripeIntentSerializer(serializers.Serializer):
    order_number = serializers.CharField()


class JazzCashInitiateSerializer(serializers.Serializer):
    order_number = serializers.CharField()
