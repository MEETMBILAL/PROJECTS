"""Payment views: Stripe & JazzCash initiation, webhooks and callbacks."""
from __future__ import annotations

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.orders.models import Order

from .gateways import jazzcash, stripe
from .models import Payment, Transaction
from .serializers import PaymentInitSerializer


def _get_user_order(request) -> Order | None:
    serializer = PaymentInitSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    order = serializer.validated_data["order"]
    if order.user and order.user != request.user:
        return None
    return order


class StripeIntentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        order = _get_user_order(request)
        if order is None:
            return Response(
                {"detail": "Order not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        result = stripe.create_payment_intent(order.total, "pkr")
        Payment.objects.create(
            order=order,
            gateway=Payment.Gateway.STRIPE,
            amount=order.total,
            currency="PKR",
            reference=result.get("client_secret", ""),
            raw_response=result,
        )
        return Response(result)


class StripeWebhookView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes: list = []

    def post(self, request):
        signature = request.META.get("HTTP_STRIPE_SIGNATURE", "")
        event = stripe.verify_webhook(request.body, signature)
        if event is None:
            return Response(
                {"detail": "Webhook signature verification skipped/failed."},
                status=status.HTTP_200_OK,
            )
        event_type = event.get("type", "unknown")
        if event_type == "payment_intent.succeeded":
            intent = event["data"]["object"]
            payment = Payment.objects.filter(
                reference=intent.get("client_secret", "")
            ).first()
            if payment:
                payment.status = Payment.Status.SUCCEEDED
                payment.save(update_fields=["status", "updated_at"])
                payment.order.is_paid = True
                payment.order.status = Order.Status.CONFIRMED
                payment.order.save(update_fields=["is_paid", "status"])
                Transaction.objects.create(
                    payment=payment, event_type=event_type, payload=event
                )
        return Response({"received": True})


class JazzCashInitiateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        order = _get_user_order(request)
        if order is None:
            return Response(
                {"detail": "Order not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        result = jazzcash.initiate_payment(order.order_number, order.total)
        Payment.objects.create(
            order=order,
            gateway=Payment.Gateway.JAZZCASH,
            amount=order.total,
            reference=result.get("txn_ref", ""),
            raw_response=result,
        )
        return Response(result)


class JazzCashCallbackView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes: list = []

    def post(self, request):
        params = request.data
        verified = jazzcash.verify_callback(params)
        response_code = params.get("pp_ResponseCode")
        txn_ref = params.get("pp_TxnRefNo", "")
        payment = Payment.objects.filter(reference=txn_ref).first()
        if payment and verified and response_code == "000":
            payment.status = Payment.Status.SUCCEEDED
            payment.save(update_fields=["status", "updated_at"])
            payment.order.is_paid = True
            payment.order.status = Order.Status.CONFIRMED
            payment.order.save(update_fields=["is_paid", "status"])
        return Response({"verified": verified})
