from django.urls import path

from .views import (
    JazzCashInitiateView,
    StripeIntentView,
    jazzcash_callback,
    stripe_webhook,
)

urlpatterns = [
    path("stripe/intent/", StripeIntentView.as_view(), name="stripe-intent"),
    path("stripe/webhook/", stripe_webhook, name="stripe-webhook"),
    path("jazzcash/initiate/", JazzCashInitiateView.as_view(), name="jazzcash-initiate"),
    path("jazzcash/callback/", jazzcash_callback, name="jazzcash-callback"),
]
