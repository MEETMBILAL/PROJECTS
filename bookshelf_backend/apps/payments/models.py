"""Payment models."""
from django.db import models

from apps.orders.models import Order
from core.models import TimeStampedModel
from core.utils import generate_reference


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
    reference = models.CharField(max_length=100, unique=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default="PKR")
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.PENDING
    )
    gateway_response = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.gateway} {self.reference} ({self.status})"

    def save(self, *args, **kwargs):
        if not self.reference:
            self.reference = generate_reference(prefix="PAY")
        super().save(*args, **kwargs)


class Transaction(TimeStampedModel):
    payment = models.ForeignKey(
        Payment, on_delete=models.CASCADE, related_name="transactions"
    )
    event_type = models.CharField(max_length=100)
    raw_payload = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.event_type} for {self.payment.reference}"
