"""Stripe gateway integration stub.

Wraps the Stripe SDK so the rest of the app can stay gateway-agnostic. When no
secret key is configured the gateway operates in mock mode and returns
deterministic placeholder data so local development works without credentials.
"""
from __future__ import annotations

from decimal import Decimal

from django.conf import settings


class StripeGateway:
    def __init__(self) -> None:
        self.secret_key = settings.STRIPE_SECRET_KEY
        self.enabled = bool(self.secret_key)

    def create_payment_intent(self, *, amount: Decimal, currency: str = "pkr", metadata: dict | None = None) -> dict:
        """Create a Stripe PaymentIntent and return the client secret."""
        amount_minor = int(Decimal(amount) * 100)
        if not self.enabled:
            return {
                "mock": True,
                "client_secret": "pi_mock_secret_local_dev",
                "amount": amount_minor,
                "currency": currency,
            }
        import stripe

        stripe.api_key = self.secret_key
        intent = stripe.PaymentIntent.create(
            amount=amount_minor,
            currency=currency,
            metadata=metadata or {},
            automatic_payment_methods={"enabled": True},
        )
        return {"mock": False, "client_secret": intent.client_secret, "id": intent.id}

    def verify_webhook(self, payload: bytes, sig_header: str) -> dict:
        """Verify and parse a Stripe webhook event."""
        if not self.enabled or not settings.STRIPE_WEBHOOK_SECRET:
            return {"verified": False, "type": "mock", "data": {}}
        import stripe

        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
        return {"verified": True, "type": event["type"], "data": event["data"]["object"]}
