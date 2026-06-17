"""Payment URLs (mounted under /api/v1/)."""
from django.urls import path

from .views import (
    JazzCashCallbackView,
    JazzCashInitiateView,
    StripeIntentView,
    StripeWebhookView,
)

urlpatterns = [
    path(
        "payments/stripe/intent/",
        StripeIntentView.as_view(),
        name="stripe-intent",
    ),
    path(
        "payments/stripe/webhook/",
        StripeWebhookView.as_view(),
        name="stripe-webhook",
    ),
    path(
        "payments/jazzcash/initiate/",
        JazzCashInitiateView.as_view(),
        name="jazzcash-initiate",
    ),
    path(
        "payments/jazzcash/callback/",
        JazzCashCallbackView.as_view(),
        name="jazzcash-callback",
    ),
]
