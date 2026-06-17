"""Serializers for the reviews app."""
from __future__ import annotations

from rest_framework import serializers

from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = (
            "id",
            "book",
            "user",
            "user_name",
            "rating",
            "title",
            "comment",
            "is_verified_purchase",
            "created_at",
        )
        read_only_fields = ("id", "book", "user", "is_verified_purchase", "created_at")

    def get_user_name(self, obj) -> str:
        return obj.user.get_full_name() if obj.user else "Anonymous"
