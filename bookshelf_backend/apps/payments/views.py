"""Payment views: Stripe + JazzCash."""
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.orders.models import Order

from .gateways.jazzcash import JazzCashGateway
from .gateways.stripe import StripeGateway
from .models import Payment, Transaction
from .serializers import JazzCashInitiateSerializer, StripeIntentSerializer


class StripeIntentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = StripeIntentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = get_object_or_404(
            Order, order_number=serializer.validated_data["order_number"], user=request.user
        )
        gateway = StripeGateway()
        intent = gateway.create_payment_intent(
            order.total, metadata={"order_number": order.order_number}
        )
        Payment.objects.create(
            order=order,
            gateway=Payment.Gateway.STRIPE,
            amount=order.total,
            currency=order.subtotal and "PKR",
            status=Payment.Status.PENDING,
            gateway_response=intent,
        )
        return Response({"client_secret": intent["client_secret"], "intent": intent})


class StripeWebhookView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        gateway = StripeGateway()
        signature = request.META.get("HTTP_STRIPE_SIGNATURE", "")
        try:
            event = gateway.verify_webhook(request.body, signature)
        except Exception as exc:  # pragma: no cover
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        event_type = event.get("type", "unknown")
        data_object = event.get("data", {}).get("object", {})
        order_number = data_object.get("metadata", {}).get("order_number")
        if order_number and event_type == "payment_intent.succeeded":
            order = Order.objects.filter(order_number=order_number).first()
            if order:
                order.payment_status = Order.PaymentStatus.PAID
                order.status = Order.Status.CONFIRMED
                order.save(update_fields=["payment_status", "status", "updated_at"])
                payment = order.payments.filter(gateway=Payment.Gateway.STRIPE).first()
                if payment:
                    payment.status = Payment.Status.SUCCEEDED
                    payment.save(update_fields=["status", "updated_at"])
                    Transaction.objects.create(
                        payment=payment, event_type=event_type, raw_payload=event
                    )
        return Response({"received": True})


class JazzCashInitiateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = JazzCashInitiateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = get_object_or_404(
            Order, order_number=serializer.validated_data["order_number"], user=request.user
        )
        gateway = JazzCashGateway()
        payload = gateway.initiate(order, order.total)
        Payment.objects.create(
            order=order,
            gateway=Payment.Gateway.JAZZCASH,
            amount=order.total,
            status=Payment.Status.PENDING,
            gateway_response=payload,
        )
        return Response(payload)


class JazzCashCallbackView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        gateway = JazzCashGateway()
        data = request.data
        if not gateway.verify_callback(data):
            return Response(
                {"detail": "Invalid signature."}, status=status.HTTP_400_BAD_REQUEST
            )
        response_code = data.get("pp_ResponseCode")
        bill_ref = data.get("pp_BillReference")
        order = Order.objects.filter(order_number=bill_ref).first()
        if order:
            payment = order.payments.filter(gateway=Payment.Gateway.JAZZCASH).first()
            if response_code == "000":
                order.payment_status = Order.PaymentStatus.PAID
                order.status = Order.Status.CONFIRMED
                order.save(update_fields=["payment_status", "status", "updated_at"])
                if payment:
                    payment.status = Payment.Status.SUCCEEDED
                    payment.save(update_fields=["status", "updated_at"])
            elif payment:
                payment.status = Payment.Status.FAILED
                payment.save(update_fields=["status", "updated_at"])
            if payment:
                Transaction.objects.create(
                    payment=payment, event_type="jazzcash.callback", raw_payload=dict(data)
                )
        return Response({"received": True})
