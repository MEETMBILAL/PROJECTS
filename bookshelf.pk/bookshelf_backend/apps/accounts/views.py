"""Views for authentication and account management."""
from __future__ import annotations

from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from core.permissions import IsOwner

from .models import Address
from .serializers import (
    AddressSerializer,
    EmailTokenObtainPairSerializer,
    PasswordChangeSerializer,
    ProfileUpdateSerializer,
    RegisterSerializer,
    UserSerializer,
)

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """Register a new user and return JWT tokens."""

    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "user": UserSerializer(user).data,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(TokenObtainPairView):
    """Obtain a JWT token pair using email + password."""

    serializer_class = EmailTokenObtainPairSerializer
    permission_classes = [permissions.AllowAny]


class LogoutView(APIView):
    """Blacklist the supplied refresh token."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        refresh = request.data.get("refresh")
        if not refresh:
            return Response(
                {"detail": "Refresh token is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            token = RefreshToken(refresh)
            token.blacklist()
        except TokenError:
            return Response(
                {"detail": "Invalid or expired token."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response({"detail": "Logged out successfully."})


class ProfileView(APIView):
    """Retrieve or update the authenticated user's profile."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def patch(self, request):
        serializer = ProfileUpdateSerializer(
            request.user, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(UserSerializer(request.user).data)


class PasswordChangeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = PasswordChangeSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "Password updated successfully."})


class PasswordResetRequestView(APIView):
    """Stub password-reset endpoint that always responds success.

    A production implementation would email a tokenised reset link.
    """

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email", "")
        # Intentionally do not reveal whether the email exists.
        return Response(
            {
                "detail": (
                    "If an account exists for "
                    f"{email}, a reset link has been sent."
                )
            }
        )


class AddressViewSet(viewsets.ModelViewSet):
    """CRUD for the authenticated user's saved addresses."""

    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return Address.objects.none()
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        if serializer.validated_data.get("is_default"):
            Address.objects.filter(user=self.request.user).update(is_default=False)
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        if serializer.validated_data.get("is_default"):
            Address.objects.filter(user=self.request.user).exclude(
                pk=serializer.instance.pk
            ).update(is_default=False)
        serializer.save()
