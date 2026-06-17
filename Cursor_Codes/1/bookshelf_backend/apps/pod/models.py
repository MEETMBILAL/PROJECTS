"""Print-on-Demand models."""
from __future__ import annotations

from decimal import Decimal

from django.conf import settings
from django.db import models

from core.models import TimeStampedModel


class PODSpecification(TimeStampedModel):
    name = models.CharField(max_length=200)
    paper_size = models.CharField(max_length=50, default="A4")
    binding = models.CharField(max_length=50, default="Perfect")
    cover_type = models.CharField(max_length=50, default="Softcover")
    color_mode = models.CharField(max_length=20, default="BW")
    price_per_page = models.DecimalField(max_digits=6, decimal_places=2)
    min_pages = models.PositiveIntegerField(default=1)
    max_pages = models.PositiveIntegerField(default=500)
    setup_fee = models.DecimalField(
        max_digits=8, decimal_places=2, default=Decimal("0")
    )
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ("name",)

    def __str__(self) -> str:
        return f"{self.name} ({self.paper_size}, {self.color_mode})"

    def calculate_price(self, page_count: int, copies: int = 1) -> Decimal:
        per_copy = self.setup_fee + (self.price_per_page * page_count)
        return (per_copy * copies).quantize(Decimal("0.01"))


class PODOrder(TimeStampedModel):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        SUBMITTED = "submitted", "Submitted"
        REVIEWING = "reviewing", "Reviewing"
        PRINTING = "printing", "Printing"
        SHIPPED = "shipped", "Shipped"
        DELIVERED = "delivered", "Delivered"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="pod_orders",
    )
    specification = models.ForeignKey(
        PODSpecification, on_delete=models.SET_NULL, null=True
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
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return f"POD: {self.title} ({self.get_status_display()})"


class PODFile(TimeStampedModel):
    """Auxiliary uploaded files associated with a POD order."""

    pod_order = models.ForeignKey(
        PODOrder, on_delete=models.CASCADE, related_name="files"
    )
    file_url = models.URLField()
    file_name = models.CharField(max_length=200)
    file_type = models.CharField(max_length=50, blank=True)

    def __str__(self) -> str:
        return self.file_name
