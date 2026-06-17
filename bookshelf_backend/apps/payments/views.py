from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.orders.models import Order
from core.utils import error_response, success_response

from .gateways.jazzcash import JazzCashGateway
from .gateways.stripe import StripeGateway
from .models import Payment, Transaction
from .serializers import JazzCashInitiateSerializer, StripeIntentSerializer


class StripeIntentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = StripeIntentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = Order.objects.filter(
            order_number=serializer.validated_data["order_number"], user=request.user
        ).first()
        if not order:
            return Response(error_response("Order not found."), status=status.HTTP_404_NOT_FOUND)
        gateway = StripeGateway()
        intent = gateway.create_payment_intent(
            amount=order.total, currency="pkr", metadata={"order_number": order.order_number}
        )
        Payment.objects.get_or_create(
            order=order,
            method="stripe",
            defaults={"amount": order.total, "currency": "PKR"},
        )
        return Response(success_response(intent, "Payment intent created"))


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def stripe_webhook(request):
    gateway = StripeGateway()
    sig_header = request.META.get("HTTP_STRIPE_SIGNATURE", "")
    try:
        event = gateway.verify_webhook(request.body, sig_header)
    except Exception:  # noqa: BLE001
        return Response(error_response("Invalid webhook signature."), status=status.HTTP_400_BAD_REQUEST)

    if event.get("type") == "payment_intent.succeeded":
        order_number = event.get("data", {}).get("metadata", {}).get("order_number")
        if order_number:
            payment = Payment.objects.filter(order__order_number=order_number, method="stripe").first()
            if payment:
                payment.status = "succeeded"
                payment.save(update_fields=["status", "updated_at"])
                payment.order.status = "confirmed"
                payment.order.save(update_fields=["status", "updated_at"])
                Transaction.objects.create(
                    payment=payment,
                    gateway="stripe",
                    gateway_transaction_id=event.get("data", {}).get("id", ""),
                    raw_response=event.get("data", {}),
                    is_successful=True,
                )
    return Response(success_response(message="Webhook processed"))


class JazzCashInitiateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = JazzCashInitiateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = Order.objects.filter(
            order_number=serializer.validated_data["order_number"], user=request.user
        ).first()
        if not order:
            return Response(error_response("Order not found."), status=status.HTTP_404_NOT_FOUND)
        gateway = JazzCashGateway()
        result = gateway.initiate_payment(amount=order.total, order_number=order.order_number)
        Payment.objects.get_or_create(
            order=order, method="jazzcash", defaults={"amount": order.total}
        )
        return Response(success_response(result, "JazzCash payment initiated"))


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def jazzcash_callback(request):
    gateway = JazzCashGateway()
    data = request.data
    is_valid = gateway.verify_callback(data)
    order_number = data.get("pp_BillReference", "")
    payment = Payment.objects.filter(order__order_number=order_number, method="jazzcash").first()
    if payment:
        payment.status = "succeeded" if is_valid else "failed"
        payment.reference = data.get("pp_RetreivalReferenceNo", "")
        payment.save(update_fields=["status", "reference", "updated_at"])
        if is_valid:
            payment.order.status = "confirmed"
            payment.order.save(update_fields=["status", "updated_at"])
        Transaction.objects.create(
            payment=payment,
            gateway="jazzcash",
            gateway_transaction_id=data.get("pp_TxnRefNo", ""),
            raw_response=dict(data),
            is_successful=is_valid,
        )
    return Response(success_response({"verified": is_valid}, "Callback processed"))
