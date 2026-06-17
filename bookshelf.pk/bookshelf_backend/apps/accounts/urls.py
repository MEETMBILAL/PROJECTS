"""URL routes for authentication and account management."""
from __future__ import annotations

from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    AddressViewSet,
    LoginView,
    LogoutView,
    PasswordChangeView,
    PasswordResetRequestView,
    ProfileView,
    RegisterView,
)

router = DefaultRouter()
router.register("account/addresses", AddressViewSet, basename="address")

auth_patterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("password/change/", PasswordChangeView.as_view(), name="password_change"),
    path(
        "password/reset/",
        PasswordResetRequestView.as_view(),
        name="password_reset",
    ),
]

urlpatterns = [
    path("auth/", include(auth_patterns)),
    path("account/profile/", ProfileView.as_view(), name="profile"),
    path("", include(router.urls)),
]
