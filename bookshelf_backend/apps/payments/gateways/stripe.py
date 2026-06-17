"""Stripe gateway integration (stub-ready)."""
from __future__ import annotations

from decimal import Decimal

from django.conf import settings


class StripeGateway:
    """Thin wrapper around the Stripe SDK.

    The implementation is integration-ready: when ``STRIPE_SECRET_KEY`` is
    configured the real SDK is used, otherwise a deterministic stub response is
    returned so the rest of the system can be exercised end-to-end without
    live credentials.
    """

    def __init__(self):
        self.secret_key = settings.STRIPE_SECRET_KEY
        self.enabled = bool(self.secret_key)

    def create_payment_intent(self, amount: Decimal, currency: str = "pkr", metadata=None):
        metadata = metadata or {}
        # Stripe expects the smallest currency unit (e.g. paisa for PKR).
        amount_minor = int(Decimal(amount) * 100)
        if not self.enabled:
            return {
                "id": "pi_stub_intent",
                "client_secret": "pi_stub_intent_secret",
                "amount": amount_minor,
                "currency": currency,
                "status": "requires_payment_method",
                "stub": True,
            }
        import stripe

        stripe.api_key = self.secret_key
        intent = stripe.PaymentIntent.create(
            amount=amount_minor,
            currency=currency,
            metadata=metadata,
            automatic_payment_methods={"enabled": True},
        )
        return {
            "id": intent["id"],
            "client_secret": intent["client_secret"],
            "amount": intent["amount"],
            "currency": intent["currency"],
            "status": intent["status"],
            "stub": False,
        }

    def verify_webhook(self, payload: bytes, signature: str):
        if not self.enabled or not settings.STRIPE_WEBHOOK_SECRET:
            import json

            return json.loads(payload.decode() or "{}")
        import stripe

        return stripe.Webhook.construct_event(
            payload, signature, settings.STRIPE_WEBHOOK_SECRET
        )
