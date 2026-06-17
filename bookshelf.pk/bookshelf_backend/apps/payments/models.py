"""Payment and transaction models."""
from __future__ import annotations

from django.db import models

from apps.orders.models import Order
from core.models import TimeStampedModel


class Payment(TimeStampedModel):
    class Provider(models.TextChoices):
        STRIPE = "stripe", "Stripe"
        JAZZCASH = "jazzcash", "JazzCash"
        COD = "cod", "Cash on Delivery"

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        PROCESSING = "processing", "Processing"
        SUCCEEDED = "succeeded", "Succeeded"
        FAILED = "failed", "Failed"
        REFUNDED = "refunded", "Refunded"

    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, related_name="payments"
    )
    provider = models.CharField(max_length=20, choices=Provider.choices)
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.PENDING
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default="PKR")
    reference = models.CharField(max_length=200, blank=True)
    raw_response = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.get_provider_display()} payment for {self.order.order_number}"


class Transaction(TimeStampedModel):
    payment = models.ForeignKey(
        Payment, on_delete=models.CASCADE, related_name="transactions"
    )
    transaction_id = models.CharField(max_length=200)
    status = models.CharField(max_length=50)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payload = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.transaction_id
