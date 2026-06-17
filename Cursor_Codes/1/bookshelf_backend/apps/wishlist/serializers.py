"""Serializers for the wishlist."""
from __future__ import annotations

from rest_framework import serializers

from apps.catalogue.serializers import BookListSerializer

from .models import WishlistItem


class WishlistItemSerializer(serializers.ModelSerializer):
    book = BookListSerializer(read_only=True)

    class Meta:
        model = WishlistItem
        fields = ["id", "book", "created_at"]
