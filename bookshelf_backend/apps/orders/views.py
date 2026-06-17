"""Views for cart and orders."""
from decimal import Decimal

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

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


class CartView(APIView):
    """Retrieve the current cart and mutate its items."""

    def get(self, request):
        cart = cart_service.get_or_create_cart(request)
        return Response(CartSerializer(cart, context={"request": request}).data)


class CartAddView(APIView):
    def post(self, request):
        serializer = AddToCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        cart_service.add_to_cart(
            request,
            serializer.validated_data["book_id"],
            serializer.validated_data["quantity"],
        )
        cart = cart_service.get_or_create_cart(request)
        return Response(
            CartSerializer(cart, context={"request": request}).data,
            status=status.HTTP_201_CREATED,
        )


class CartUpdateView(APIView):
    def patch(self, request, item_id):
        serializer = UpdateCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        cart_service.update_cart_item(
            request, item_id, serializer.validated_data["quantity"]
        )
        cart = cart_service.get_or_create_cart(request)
        return Response(CartSerializer(cart, context={"request": request}).data)


class CartRemoveView(APIView):
    def delete(self, request, item_id):
        cart_service.remove_cart_item(request, item_id)
        cart = cart_service.get_or_create_cart(request)
        return Response(CartSerializer(cart, context={"request": request}).data)


class CartClearView(APIView):
    def delete(self, request):
        cart_service.clear_cart(request)
        cart = cart_service.get_or_create_cart(request)
        return Response(CartSerializer(cart, context={"request": request}).data)


class ApplyCouponView(APIView):
    def post(self, request):
        serializer = ApplyCouponSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        cart = cart_service.get_or_create_cart(request)
        subtotal = cart.subtotal
        discount, coupon = order_service.apply_coupon(
            subtotal, serializer.validated_data["coupon_code"]
        )
        return Response(
            {
                "coupon_code": coupon.code,
                "discount": discount,
                "subtotal": subtotal,
                "total": subtotal - discount,
            }
        )


class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "order_number"

    def get_queryset(self):
        return (
            Order.objects.filter(user=self.request.user)
            .prefetch_related("items")
        )

    @action(detail=False, methods=["post"], url_path="create")
    def create_order(self, request):
        serializer = CreateOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = order_service.create_order_from_cart(
            request,
            shipping_address=serializer.validated_data["shipping_address"],
            payment_method=serializer.validated_data["payment_method"],
            coupon_code=serializer.validated_data.get("coupon_code", ""),
            notes=serializer.validated_data.get("notes", ""),
        )
        return Response(
            OrderSerializer(order, context={"request": request}).data,
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["post"])
    def cancel(self, request, order_number=None):
        order = self.get_object()
        order_service.cancel_order(order)
        return Response(OrderSerializer(order, context={"request": request}).data)
