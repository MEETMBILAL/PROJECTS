"""Print-on-Demand models."""
from __future__ import annotations

from decimal import Decimal

from django.conf import settings
from django.db import models

from core.models import TimeStampedModel
from core.utils import generate_pod_number


class PODSpecification(TimeStampedModel):
    """A configurable print specification used to price POD orders."""

    name = models.CharField(max_length=200)
    paper_size = models.CharField(max_length=50, default="A4")
    binding = models.CharField(max_length=50, default="Perfect")
    cover_type = models.CharField(max_length=50, default="Softcover")
    color_mode = models.CharField(max_length=20, default="BW")
    price_per_page = models.DecimalField(max_digits=6, decimal_places=2)
    min_pages = models.PositiveIntegerField(default=1)
    max_pages = models.PositiveIntegerField(default=500)
    setup_fee = models.DecimalField(
        max_digits=8, decimal_places=2, default=Decimal("0.00")
    )
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["name"]
        verbose_name = "POD specification"

    def __str__(self) -> str:
        return f"{self.name} ({self.paper_size}/{self.color_mode})"

    def calculate_price(self, page_count: int, copies: int = 1) -> Decimal:
        """Return the total price for the given page count and copies."""
        pages = max(int(page_count), self.min_pages)
        per_copy = self.setup_fee + (self.price_per_page * pages)
        return (per_copy * max(int(copies), 1)).quantize(Decimal("0.01"))


class PODOrder(TimeStampedModel):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        SUBMITTED = "submitted", "Submitted"
        REVIEWING = "reviewing", "Reviewing"
        PRINTING = "printing", "Printing"
        SHIPPED = "shipped", "Shipped"
        DELIVERED = "delivered", "Delivered"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="pod_orders"
    )
    pod_number = models.CharField(max_length=20, unique=True, blank=True)
    specification = models.ForeignKey(
        PODSpecification, on_delete=models.SET_NULL, null=True, related_name="orders"
    )
    file_url = models.URLField()
    file_name = models.CharField(max_length=200)
    page_count = models.PositiveIntegerField()
    copies = models.PositiveIntegerField(default=1)
    title = models.CharField(max_length=300)
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.DRAFT
    )
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    notes = models.TextField(blank=True)
    shipping_address = models.JSONField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "POD order"

    def __str__(self) -> str:
        return self.pod_number or f"POD draft #{self.pk}"

    def save(self, *args, **kwargs):
        if not self.pod_number:
            number = generate_pod_number()
            while PODOrder.objects.filter(pod_number=number).exists():
                number = generate_pod_number()
            self.pod_number = number
        super().save(*args, **kwargs)
