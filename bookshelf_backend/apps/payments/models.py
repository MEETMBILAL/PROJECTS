from django.db import models

from apps.orders.models import Order
from core.models import TimeStampedModel


class Payment(TimeStampedModel):
    METHOD_CHOICES = [
        ("cod", "Cash on Delivery"),
        ("stripe", "Stripe"),
        ("jazzcash", "JazzCash"),
    ]
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("processing", "Processing"),
        ("succeeded", "Succeeded"),
        ("failed", "Failed"),
        ("refunded", "Refunded"),
    ]

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="payments")
    method = models.CharField(max_length=20, choices=METHOD_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default="PKR")
    reference = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.method} payment for {self.order.order_number} — {self.status}"


class Transaction(TimeStampedModel):
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE, related_name="transactions")
    gateway = models.CharField(max_length=50)
    gateway_transaction_id = models.CharField(max_length=255, blank=True)
    raw_response = models.JSONField(default=dict, blank=True)
    is_successful = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.gateway} txn {self.gateway_transaction_id or self.pk}"
