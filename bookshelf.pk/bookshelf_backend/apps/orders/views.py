"""Views for carts and orders."""
from __future__ import annotations

from decimal import Decimal

from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from core.exceptions import ServiceError
from services import cart_service, order_service

from .models import Order
from .serializers import (
    AddToCartSerializer,
    ApplyCouponSerializer,
    CartSerializer,
    CreateOrderSerializer,
    OrderSerializer,
    UpdateCartItemSerializer,
)
from .tasks import send_order_confirmation


def _session_id(request) -> str | None:
    return request.headers.get("X-Session-Id") or request.query_params.get(
        "session_id"
    )


def _resolve_cart(request):
    return cart_service.get_or_create_cart(
        user=request.user if request.user.is_authenticated else None,
        session_id=_session_id(request),
    )


class CartView(APIView):
    """Retrieve the current cart and mutate its contents."""

    permission_classes = [permissions.AllowAny]

    def get(self, request):
        cart = _resolve_cart(request)
        return Response(CartSerializer(cart).data)


class CartAddView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = AddToCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        cart = _resolve_cart(request)
        cart_service.add_to_cart(
            cart=cart,
            book_id=serializer.validated_data["book_id"],
            quantity=serializer.validated_data["quantity"],
        )
        return Response(CartSerializer(cart).data, status=status.HTTP_201_CREATED)


class CartUpdateView(APIView):
    permission_classes = [permissions.AllowAny]

    def patch(self, request, item_id: int):
        serializer = UpdateCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        cart = _resolve_cart(request)
        cart_service.update_cart_item(
            cart=cart,
            item_id=item_id,
            quantity=serializer.validated_data["quantity"],
        )
        return Response(CartSerializer(cart).data)


class CartRemoveView(APIView):
    permission_classes = [permissions.AllowAny]

    def delete(self, request, item_id: int):
        cart = _resolve_cart(request)
        cart_service.remove_cart_item(cart=cart, item_id=item_id)
        return Response(CartSerializer(cart).data)


class CartClearView(APIView):
    permission_classes = [permissions.AllowAny]

    def delete(self, request):
        cart = _resolve_cart(request)
        cart_service.clear_cart(cart=cart)
        return Response(CartSerializer(cart).data)


class CartApplyCouponView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ApplyCouponSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        cart = _resolve_cart(request)
        discount, coupon = order_service.resolve_coupon_discount(
            serializer.validated_data["code"], cart.subtotal
        )
        return Response(
            {
                "code": coupon.code,
                "discount": discount,
                "subtotal": cart.subtotal,
                "total_after_discount": cart.subtotal - discount,
            }
        )


class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    """List and retrieve the authenticated user's orders."""

    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "order_number"

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return Order.objects.none()
        return (
            Order.objects.filter(user=self.request.user)
            .prefetch_related("items")
            .order_by("-created_at")
        )

    @action(detail=False, methods=["post"], url_path="create")
    def create_order(self, request):
        serializer = CreateOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        cart = cart_service.get_or_create_cart(user=request.user)
        order = order_service.create_order_from_cart(
            user=request.user,
            cart=cart,
            shipping_address=serializer.validated_data["shipping_address"],
            payment_method=serializer.validated_data["payment_method"],
            coupon_code=serializer.validated_data.get("coupon_code", ""),
            notes=serializer.validated_data.get("notes", ""),
        )
        send_order_confirmation.delay(order.pk)
        return Response(
            OrderSerializer(order).data, status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=["post"])
    def cancel(self, request, order_number=None):
        order = self.get_object()
        order_service.cancel_order(order=order)
        return Response(OrderSerializer(order).data)
