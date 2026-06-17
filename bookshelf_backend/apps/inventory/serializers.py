"""Serializers for inventory."""
from rest_framework import serializers

from .models import StockItem, StockMovement


class StockItemSerializer(serializers.ModelSerializer):
    book_title = serializers.CharField(source="book.title", read_only=True)
    is_low_stock = serializers.BooleanField(read_only=True)

    class Meta:
        model = StockItem
        fields = [
            "id",
            "book",
            "book_title",
            "quantity",
            "low_stock_threshold",
            "warehouse_location",
            "is_low_stock",
        ]


class StockMovementSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockMovement
        fields = [
            "id",
            "book",
            "movement_type",
            "quantity",
            "reference",
            "note",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]
