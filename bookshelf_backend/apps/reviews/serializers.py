from rest_framework import serializers

from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.get_full_name", read_only=True)
    user_avatar = serializers.CharField(source="user.avatar", read_only=True)

    class Meta:
        model = Review
        fields = [
            "id",
            "book",
            "user_name",
            "user_avatar",
            "rating",
            "title",
            "comment",
            "is_verified_purchase",
            "created_at",
        ]
        read_only_fields = ["id", "book", "user_name", "user_avatar", "is_verified_purchase", "created_at"]


class ReviewWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ["rating", "title", "comment"]
