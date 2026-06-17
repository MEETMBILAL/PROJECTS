"""Stripe payment gateway integration (stub-ready).

Wraps the Stripe SDK so views never touch ``stripe`` directly. When no API key
is configured the gateway returns mock data so the flow remains testable.
"""
from __future__ import annotations

from decimal import Decimal

from django.conf import settings


class StripeGateway:
    """Thin wrapper around the Stripe PaymentIntents API."""

    def __init__(self) -> None:
        self.api_key = settings.STRIPE_SECRET_KEY
        self.enabled = bool(self.api_key)

    def create_payment_intent(
        self, *, amount: Decimal, currency: str = "pkr", metadata: dict | None = None
    ) -> dict:
        """Create a Stripe PaymentIntent and return the client secret.

        Stripe amounts are expressed in the smallest currency unit.
        """
        amount_minor = int((amount * 100).to_integral_value())
        if not self.enabled:
            return {
                "client_secret": f"mock_secret_{amount_minor}",
                "payment_intent_id": f"pi_mock_{amount_minor}",
                "amount": amount_minor,
                "currency": currency,
                "mock": True,
            }

        import stripe

        stripe.api_key = self.api_key
        intent = stripe.PaymentIntent.create(
            amount=amount_minor,
            currency=currency,
            metadata=metadata or {},
            automatic_payment_methods={"enabled": True},
        )
        return {
            "client_secret": intent.client_secret,
            "payment_intent_id": intent.id,
            "amount": amount_minor,
            "currency": currency,
            "mock": False,
        }

    def verify_webhook(self, *, payload: bytes, signature: str) -> dict:
        """Verify and parse a Stripe webhook event."""
        if not self.enabled or not settings.STRIPE_WEBHOOK_SECRET:
            return {"type": "mock.event", "verified": False}

        import stripe

        event = stripe.Webhook.construct_event(
            payload=payload,
            sig_header=signature,
            secret=settings.STRIPE_WEBHOOK_SECRET,
        )
        return event
