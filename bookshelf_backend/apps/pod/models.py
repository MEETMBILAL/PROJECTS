from django.conf import settings
from django.db import models

from core.models import TimeStampedModel


class PODSpecification(TimeStampedModel):
    name = models.CharField(max_length=200)
    paper_size = models.CharField(max_length=50)  # A4, A5, Letter
    binding = models.CharField(max_length=50)  # Perfect, Spiral, Saddle Stitch
    cover_type = models.CharField(max_length=50)  # Softcover, Hardcover
    color_mode = models.CharField(max_length=20)  # BW, Color
    price_per_page = models.DecimalField(max_digits=6, decimal_places=2)
    min_pages = models.PositiveIntegerField(default=1)
    max_pages = models.PositiveIntegerField(default=500)
    setup_fee = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["price_per_page"]

    def __str__(self) -> str:
        return f"{self.name} ({self.paper_size}, {self.color_mode})"

    def calculate_price(self, page_count: int, copies: int = 1):
        from decimal import Decimal

        pages_cost = self.price_per_page * Decimal(page_count)
        return ((pages_cost + self.setup_fee) * Decimal(copies)).quantize(Decimal("0.01"))


class PODOrder(TimeStampedModel):
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("submitted", "Submitted"),
        ("reviewing", "Reviewing"),
        ("printing", "Printing"),
        ("shipped", "Shipped"),
        ("delivered", "Delivered"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="pod_orders"
    )
    specification = models.ForeignKey(
        PODSpecification, on_delete=models.SET_NULL, null=True, related_name="orders"
    )
    file_url = models.URLField()
    file_name = models.CharField(max_length=200)
    page_count = models.PositiveIntegerField()
    copies = models.PositiveIntegerField(default=1)
    title = models.CharField(max_length=300)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    notes = models.TextField(blank=True)
    shipping_address = models.JSONField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"POD: {self.title} ({self.status})"
