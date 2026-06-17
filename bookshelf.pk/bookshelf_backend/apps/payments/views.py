"""Views for the payments app (Stripe + JazzCash stubs)."""
from __future__ import annotations

from django.shortcuts import get_object_or_404
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.orders.models import Order

from .gateways.jazzcash import JazzCashGateway
from .gateways.stripe import StripeGateway
from .models import Payment, Transaction
from .serializers import PaymentIntentSerializer


def _get_user_order(request, order_number: str) -> Order:
    return get_object_or_404(Order, order_number=order_number, user=request.user)


class StripeIntentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = PaymentIntentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = _get_user_order(request, serializer.validated_data["order_number"])

        gateway = StripeGateway()
        intent = gateway.create_payment_intent(
            amount=order.total,
            currency=order.shipping_address.get("currency", "pkr"),
            metadata={"order_number": order.order_number},
        )
        Payment.objects.create(
            order=order,
            provider=Payment.Provider.STRIPE,
            status=Payment.Status.PROCESSING,
            amount=order.total,
            currency="PKR",
            reference=intent["payment_intent_id"],
            raw_response=intent,
        )
        return Response(intent)


class StripeWebhookView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes: list = []

    def post(self, request):
        gateway = StripeGateway()
        signature = request.headers.get("Stripe-Signature", "")
        try:
            event = gateway.verify_webhook(
                payload=request.body, signature=signature
            )
        except Exception:  # noqa: BLE001
            return Response(
                {"detail": "Invalid signature."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        event_type = event.get("type") if isinstance(event, dict) else event.type
        if event_type == "payment_intent.succeeded":
            obj = (
                event["data"]["object"]
                if isinstance(event, dict)
                else event.data.object
            )
            reference = obj.get("id") if isinstance(obj, dict) else obj.id
            payment = Payment.objects.filter(reference=reference).first()
            if payment:
                payment.status = Payment.Status.SUCCEEDED
                payment.save(update_fields=["status", "updated_at"])
                payment.order.is_paid = True
                payment.order.status = Order.Status.CONFIRMED
                payment.order.save(update_fields=["is_paid", "status", "updated_at"])
        return Response({"received": True})


class JazzCashInitiateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = PaymentIntentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = _get_user_order(request, serializer.validated_data["order_number"])

        gateway = JazzCashGateway()
        payload = gateway.initiate_payment(
            amount=order.total, order_number=order.order_number
        )
        Payment.objects.create(
            order=order,
            provider=Payment.Provider.JAZZCASH,
            status=Payment.Status.PROCESSING,
            amount=order.total,
            currency="PKR",
            reference=payload["fields"].get("pp_TxnRefNo", ""),
            raw_response=payload,
        )
        return Response(payload)


class JazzCashCallbackView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes: list = []

    def post(self, request):
        gateway = JazzCashGateway()
        data = request.data
        if not gateway.verify_callback(dict(data)):
            return Response(
                {"detail": "Signature verification failed."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        ref = data.get("pp_TxnRefNo", "")
        response_code = data.get("pp_ResponseCode", "")
        payment = Payment.objects.filter(reference=ref).first()
        if payment:
            Transaction.objects.create(
                payment=payment,
                transaction_id=ref,
                status=response_code,
                amount=payment.amount,
                payload=dict(data),
            )
            if response_code == "000":
                payment.status = Payment.Status.SUCCEEDED
                payment.order.is_paid = True
                payment.order.status = Order.Status.CONFIRMED
                payment.order.save(
                    update_fields=["is_paid", "status", "updated_at"]
                )
            else:
                payment.status = Payment.Status.FAILED
            payment.save(update_fields=["status", "updated_at"])
        return Response({"received": True})
