"""Stripe gateway integration (with a safe development stub).

If the ``stripe`` package and ``STRIPE_SECRET_KEY`` are available a real
PaymentIntent is created; otherwise a deterministic stub is returned so the
checkout flow remains testable without credentials.
"""
from __future__ import annotations

from decimal import Decimal

from django.conf import settings


def create_payment_intent(amount: Decimal, currency: str = "pkr") -> dict:
    """Create a Stripe PaymentIntent and return its client secret."""
    secret_key = settings.STRIPE_SECRET_KEY
    # Stripe expects the smallest currency unit (paisa for PKR).
    amount_minor = int(Decimal(str(amount)) * 100)

    if not secret_key:
        return {
            "stub": True,
            "client_secret": f"pi_stub_secret_{amount_minor}",
            "amount": amount_minor,
            "currency": currency,
            "publishable_key": settings.STRIPE_PUBLISHABLE_KEY,
        }

    try:
        import stripe

        stripe.api_key = secret_key
        intent = stripe.PaymentIntent.create(
            amount=amount_minor,
            currency=currency,
            automatic_payment_methods={"enabled": True},
        )
        return {
            "stub": False,
            "client_secret": intent.client_secret,
            "amount": amount_minor,
            "currency": currency,
            "publishable_key": settings.STRIPE_PUBLISHABLE_KEY,
        }
    except Exception as exc:  # pragma: no cover - network/credential errors
        return {"error": str(exc)}


def verify_webhook(payload: bytes, signature: str) -> dict | None:
    """Validate a Stripe webhook signature and return the parsed event."""
    secret = settings.STRIPE_WEBHOOK_SECRET
    if not secret:
        return None
    try:
        import stripe

        return stripe.Webhook.construct_event(payload, signature, secret)
    except Exception:  # pragma: no cover
        return None
