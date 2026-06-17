"""Authentication URLs (mounted under /api/v1/auth/)."""
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    ChangePasswordView,
    LoginView,
    LogoutView,
    PasswordResetRequestView,
    RegisterView,
)

app_name = "auth"

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("password/reset/", PasswordResetRequestView.as_view(), name="password_reset"),
    path("password/change/", ChangePasswordView.as_view(), name="password_change"),
]
