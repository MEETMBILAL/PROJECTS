from rest_framework import serializers

from .models import StockItem, StockMovement


class StockMovementSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockMovement
        fields = [
            "id",
            "stock_item",
            "movement_type",
            "quantity",
            "reason",
            "reference",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class StockItemSerializer(serializers.ModelSerializer):
    book_title = serializers.CharField(source="book.title", read_only=True)
    needs_reorder = serializers.BooleanField(read_only=True)
    movements = StockMovementSerializer(many=True, read_only=True)

    class Meta:
        model = StockItem
        fields = [
            "id",
            "book",
            "book_title",
            "quantity",
            "reorder_level",
            "location",
            "needs_reorder",
            "movements",
            "updated_at",
        ]
        read_only_fields = ["id", "updated_at"]
