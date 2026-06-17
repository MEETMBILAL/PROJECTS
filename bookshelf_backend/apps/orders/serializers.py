from rest_framework import serializers

from apps.catalogue.serializers import BookListSerializer

from .models import Cart, CartItem, Order, OrderItem


class CartItemSerializer(serializers.ModelSerializer):
    book = BookListSerializer(read_only=True)
    line_total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = ["id", "book", "quantity", "line_total"]


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    subtotal = serializers.SerializerMethodField()
    item_count = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ["id", "items", "subtotal", "item_count", "created_at"]

    def get_subtotal(self, obj):
        return sum((item.line_total for item in obj.items.all()), 0)

    def get_item_count(self, obj):
        return sum(item.quantity for item in obj.items.all())


class AddToCartSerializer(serializers.Serializer):
    book_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1, default=1)


class UpdateCartItemSerializer(serializers.Serializer):
    quantity = serializers.IntegerField(min_value=0)


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ["id", "book", "quantity", "unit_price", "total_price", "title_snapshot"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "order_number",
            "status",
            "shipping_address",
            "subtotal",
            "shipping_fee",
            "discount",
            "total",
            "coupon_code",
            "notes",
            "items",
            "created_at",
        ]
        read_only_fields = fields


class CreateOrderSerializer(serializers.Serializer):
    shipping_address = serializers.JSONField()
    coupon_code = serializers.CharField(required=False, allow_blank=True, default="")
    notes = serializers.CharField(required=False, allow_blank=True, default="")
