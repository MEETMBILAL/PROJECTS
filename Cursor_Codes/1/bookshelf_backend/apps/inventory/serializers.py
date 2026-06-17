"""Serializers for inventory."""
from __future__ import annotations

from rest_framework import serializers

from .models import StockItem, StockMovement


class StockItemSerializer(serializers.ModelSerializer):
    book_title = serializers.CharField(source="book.title", read_only=True)
    is_low = serializers.BooleanField(read_only=True)

    class Meta:
        model = StockItem
        fields = [
            "id",
            "book",
            "book_title",
            "quantity",
            "low_stock_threshold",
            "warehouse",
            "is_low",
        ]


class StockMovementSerializer(serializers.ModelSerializer):
    book_title = serializers.CharField(source="book.title", read_only=True)

    class Meta:
        model = StockMovement
        fields = [
            "id",
            "book",
            "book_title",
            "movement_type",
            "quantity",
            "reference",
            "note",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]
