"""Payment and transaction models."""
from __future__ import annotations

from django.db import models

from apps.orders.models import Order
from core.models import TimeStampedModel


class Payment(TimeStampedModel):
    class Gateway(models.TextChoices):
        STRIPE = "stripe", "Stripe"
        JAZZCASH = "jazzcash", "JazzCash"
        COD = "cod", "Cash on Delivery"

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        SUCCEEDED = "succeeded", "Succeeded"
        FAILED = "failed", "Failed"
        REFUNDED = "refunded", "Refunded"

    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, related_name="payments"
    )
    gateway = models.CharField(max_length=20, choices=Gateway.choices)
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.PENDING
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default="PKR")
    reference = models.CharField(max_length=200, blank=True)
    raw_response = models.JSONField(default=dict, blank=True)

    def __str__(self) -> str:
        return f"{self.gateway} {self.amount} ({self.status})"


class Transaction(TimeStampedModel):
    payment = models.ForeignKey(
        Payment, on_delete=models.CASCADE, related_name="transactions"
    )
    event_type = models.CharField(max_length=100)
    payload = models.JSONField(default=dict, blank=True)

    def __str__(self) -> str:
        return f"{self.event_type} for {self.payment_id}"
