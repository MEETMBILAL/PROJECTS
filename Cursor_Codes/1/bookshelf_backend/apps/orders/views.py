"""Cart and order views."""
from __future__ import annotations

from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from services import cart_service
from services.order_service import (
    OrderError,
    apply_coupon,
    cancel_order,
    create_order_from_cart,
)

from .models import Order
from .serializers import (
    AddToCartSerializer,
    CartSerializer,
    CreateOrderSerializer,
    OrderSerializer,
    UpdateCartItemSerializer,
)


def _resolve_cart(request):
    """Return the cart for the current user or anonymous session."""
    if request.user.is_authenticated:
        return cart_service.get_or_create_cart(user=request.user)
    if not request.session.session_key:
        request.session.create()
    return cart_service.get_or_create_cart(
        session_id=request.session.session_key
    )


class CartView(APIView):
    """Full cart CRUD exposed under /api/v1/cart/."""

    permission_classes = [permissions.AllowAny]

    def get(self, request):
        cart = _resolve_cart(request)
        return Response(CartSerializer(cart).data)


class CartActionsView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, op=None, item_id=None):
        cart = _resolve_cart(request)

        if op == "add":
            serializer = AddToCartSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            cart_service.add_item(
                cart,
                serializer.validated_data["book_id"],
                serializer.validated_data["quantity"],
            )
        elif op == "clear":
            cart_service.clear_cart(cart)
        elif op == "apply-coupon":
            code = request.data.get("coupon_code", "")
            discount = apply_coupon(cart.subtotal, code)
            return Response(
                {
                    "coupon_code": code,
                    "discount": str(discount),
                    "valid": discount > 0,
                    "cart": CartSerializer(cart).data,
                }
            )
        else:
            return Response(
                {"detail": "Unknown cart operation."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(CartSerializer(cart).data)

    def patch(self, request, op=None, item_id=None):
        cart = _resolve_cart(request)
        serializer = UpdateCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            cart_service.update_item(
                cart, item_id, serializer.validated_data["quantity"]
            )
        except Exception:
            return Response(
                {"detail": "Cart item not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(CartSerializer(cart).data)

    def delete(self, request, op=None, item_id=None):
        cart = _resolve_cart(request)
        if op == "clear":
            cart_service.clear_cart(cart)
        elif item_id is not None:
            cart_service.remove_item(cart, item_id)
        return Response(CartSerializer(cart).data)


class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    """List and retrieve the authenticated user's orders."""

    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "order_number"

    def get_queryset(self):
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
        try:
            order = create_order_from_cart(
                cart=cart, **serializer.validated_data
            )
        except OrderError as exc:
            return Response(
                {"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST
            )
        return Response(
            OrderSerializer(order).data, status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=["post"])
    def cancel(self, request, order_number=None):
        order = self.get_object()
        try:
            cancel_order(order)
        except OrderError as exc:
            return Response(
                {"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST
            )
        return Response(OrderSerializer(order).data)
