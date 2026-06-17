"""Serializers for accounts: registration, profile and addresses."""
from __future__ import annotations

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Address

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "username",
            "full_name",
            "phone",
            "avatar",
            "is_staff",
            "date_joined",
        )
        read_only_fields = ("id", "is_staff", "date_joined")


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, validators=[validate_password], style={"input_type": "password"}
    )
    password_confirm = serializers.CharField(
        write_only=True, style={"input_type": "password"}
    )

    class Meta:
        model = User
        fields = (
            "email",
            "username",
            "full_name",
            "phone",
            "password",
            "password_confirm",
        )

    def validate(self, attrs):
        if attrs["password"] != attrs.pop("password_confirm"):
            raise serializers.ValidationError(
                {"password_confirm": "Passwords do not match."}
            )
        return attrs

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User.objects.create_user(password=password, **validated_data)
        return user


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Adds the serialized user object to the JWT login response."""

    username_field = User.USERNAME_FIELD

    def validate(self, attrs):
        data = super().validate(attrs)
        data["user"] = UserSerializer(self.user).data
        return data


class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("full_name", "phone", "avatar", "username")


class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(
        required=True, write_only=True, validators=[validate_password]
    )

    def validate_old_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect.")
        return value

    def save(self, **kwargs):
        user = self.context["request"].user
        user.set_password(self.validated_data["new_password"])
        user.save(update_fields=["password"])
        return user


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = (
            "id",
            "label",
            "recipient_name",
            "recipient_phone",
            "street",
            "city",
            "province",
            "postal_code",
            "country",
            "is_default",
            "created_at",
        )
        read_only_fields = ("id", "created_at")
