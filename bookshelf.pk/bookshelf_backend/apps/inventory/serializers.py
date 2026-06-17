"""Serializers for the inventory app."""
from __future__ import annotations

from rest_framework import serializers

from .models import StockItem, StockMovement


class StockItemSerializer(serializers.ModelSerializer):
    book_title = serializers.CharField(source="book.title", read_only=True)
    available = serializers.IntegerField(read_only=True)
    needs_reorder = serializers.BooleanField(read_only=True)

    class Meta:
        model = StockItem
        fields = (
            "id",
            "book",
            "book_title",
            "location",
            "reserved",
            "reorder_level",
            "available",
            "needs_reorder",
        )


class StockMovementSerializer(serializers.ModelSerializer):
    book_title = serializers.CharField(source="book.title", read_only=True)

    class Meta:
        model = StockMovement
        fields = (
            "id",
            "book",
            "book_title",
            "movement_type",
            "quantity",
            "reason",
            "reference",
            "created_at",
        )
