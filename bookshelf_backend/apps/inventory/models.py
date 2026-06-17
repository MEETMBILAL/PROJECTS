"""Inventory models: stock items and movement audit trail."""
from django.conf import settings
from django.db import models

from apps.catalogue.models import Book
from core.models import TimeStampedModel


class StockItem(TimeStampedModel):
    book = models.OneToOneField(
        Book, on_delete=models.CASCADE, related_name="stock_item"
    )
    quantity = models.IntegerField(default=0)
    low_stock_threshold = models.PositiveIntegerField(default=5)
    warehouse_location = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.book.title}: {self.quantity}"

    @property
    def is_low_stock(self) -> bool:
        return self.quantity <= self.low_stock_threshold


class StockMovement(TimeStampedModel):
    class MovementType(models.TextChoices):
        PURCHASE = "purchase", "Purchase / Restock"
        SALE = "sale", "Sale"
        ADJUSTMENT = "adjustment", "Manual Adjustment"
        RETURN = "return", "Return"

    book = models.ForeignKey(
        Book, on_delete=models.CASCADE, related_name="stock_movements"
    )
    movement_type = models.CharField(max_length=20, choices=MovementType.choices)
    quantity = models.IntegerField(help_text="Positive for inflow, negative for outflow")
    reference = models.CharField(max_length=100, blank=True)
    note = models.TextField(blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.get_movement_type_display()} {self.quantity} ({self.book})"
