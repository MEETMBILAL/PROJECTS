from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from core.utils import error_response, success_response
from services.cart_service import CartService
from services.order_service import OrderService

from .models import CartItem, Order
from .serializers import (
    AddToCartSerializer,
    CartSerializer,
    CreateOrderSerializer,
    OrderSerializer,
    UpdateCartItemSerializer,
)


def _get_session_id(request) -> str:
    if not request.session.session_key:
        request.session.create()
    return request.session.session_key


def _resolve_cart(request):
    user = request.user if request.user.is_authenticated else None
    session_id = None if user else _get_session_id(request)
    return CartService.get_or_create_cart(user=user, session_id=session_id)


class CartView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        cart = _resolve_cart(request)
        return Response(success_response(CartSerializer(cart, context={"request": request}).data))


class CartAddView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = AddToCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        cart = _resolve_cart(request)
        try:
            CartService.add_item(
                cart,
                serializer.validated_data["book_id"],
                serializer.validated_data["quantity"],
            )
        except Exception:  # noqa: BLE001
            return Response(
                error_response("Book not found or unavailable."),
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(
            success_response(
                CartSerializer(cart, context={"request": request}).data,
                "Item added to cart",
            )
        )


class CartUpdateView(APIView):
    permission_classes = [permissions.AllowAny]

    def patch(self, request, item_id):
        cart = _resolve_cart(request)
        item = cart.items.filter(pk=item_id).first()
        if not item:
            return Response(error_response("Cart item not found."), status=status.HTTP_404_NOT_FOUND)
        serializer = UpdateCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        CartService.update_item(item, serializer.validated_data["quantity"])
        return Response(
            success_response(
                CartSerializer(cart, context={"request": request}).data,
                "Cart updated",
            )
        )


class CartRemoveView(APIView):
    permission_classes = [permissions.AllowAny]

    def delete(self, request, item_id):
        cart = _resolve_cart(request)
        deleted, _ = CartItem.objects.filter(cart=cart, pk=item_id).delete()
        if not deleted:
            return Response(error_response("Cart item not found."), status=status.HTTP_404_NOT_FOUND)
        return Response(
            success_response(
                CartSerializer(cart, context={"request": request}).data,
                "Item removed",
            )
        )


class CartClearView(APIView):
    permission_classes = [permissions.AllowAny]

    def delete(self, request):
        cart = _resolve_cart(request)
        CartService.clear(cart)
        return Response(success_response(message="Cart cleared"))


class OrderListView(ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (
            Order.objects.filter(user=self.request.user)
            .prefetch_related("items")
        )


class OrderCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = CreateOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        cart = _resolve_cart(request)
        try:
            order = OrderService.create_order_from_cart(
                cart=cart,
                user=request.user,
                shipping_address=serializer.validated_data["shipping_address"],
                coupon_code=serializer.validated_data.get("coupon_code", ""),
                notes=serializer.validated_data.get("notes", ""),
            )
        except ValueError as exc:
            return Response(error_response(str(exc)), status=status.HTTP_400_BAD_REQUEST)

        from .tasks import send_order_confirmation_email

        send_order_confirmation_email.delay(order.id)
        return Response(
            success_response(OrderSerializer(order).data, "Order created"),
            status=status.HTTP_201_CREATED,
        )


class OrderDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, order_number):
        order = Order.objects.filter(user=request.user, order_number=order_number).first()
        if not order:
            return Response(error_response("Order not found."), status=status.HTTP_404_NOT_FOUND)
        return Response(success_response(OrderSerializer(order).data))


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def cancel_order(request, order_number):
    order = Order.objects.filter(user=request.user, order_number=order_number).first()
    if not order:
        return Response(error_response("Order not found."), status=status.HTTP_404_NOT_FOUND)
    try:
        OrderService.cancel_order(order)
    except ValueError as exc:
        return Response(error_response(str(exc)), status=status.HTTP_400_BAD_REQUEST)
    return Response(success_response(OrderSerializer(order).data, "Order cancelled"))
