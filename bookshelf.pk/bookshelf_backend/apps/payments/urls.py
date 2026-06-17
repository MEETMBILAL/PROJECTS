"""URL routes for the payments app (mounted under /api/v1/payments/)."""
from __future__ import annotations

from django.urls import path

from .views import (
    JazzCashCallbackView,
    JazzCashInitiateView,
    StripeIntentView,
    StripeWebhookView,
)

urlpatterns = [
    path("stripe/intent/", StripeIntentView.as_view(), name="stripe-intent"),
    path("stripe/webhook/", StripeWebhookView.as_view(), name="stripe-webhook"),
    path(
        "jazzcash/initiate/",
        JazzCashInitiateView.as_view(),
        name="jazzcash-initiate",
    ),
    path(
        "jazzcash/callback/",
        JazzCashCallbackView.as_view(),
        name="jazzcash-callback",
    ),
]
