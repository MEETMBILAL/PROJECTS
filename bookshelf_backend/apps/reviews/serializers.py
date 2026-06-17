"""Serializers for reviews."""
from rest_framework import serializers

from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = [
            "id",
            "book",
            "user_name",
            "rating",
            "title",
            "comment",
            "is_verified_purchase",
            "helpful_count",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "book",
            "user_name",
            "is_verified_purchase",
            "helpful_count",
            "created_at",
        ]

    def get_user_name(self, obj):
        return obj.user.display_name


class ReviewWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ["rating", "title", "comment"]
