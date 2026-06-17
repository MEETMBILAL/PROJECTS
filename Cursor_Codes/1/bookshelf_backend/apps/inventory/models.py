"""Stock management models."""
from __future__ import annotations

from django.db import models

from apps.catalogue.models import Book
from core.models import TimeStampedModel


class StockItem(TimeStampedModel):
    """Authoritative stock record for a book, with a low-stock threshold."""

    book = models.OneToOneField(
        Book, on_delete=models.CASCADE, related_name="stock_item"
    )
    quantity = models.PositiveIntegerField(default=0)
    low_stock_threshold = models.PositiveIntegerField(default=5)
    warehouse = models.CharField(max_length=100, default="Main")

    def __str__(self) -> str:
        return f"{self.book.title} - {self.quantity} in stock"

    @property
    def is_low(self) -> bool:
        return self.quantity <= self.low_stock_threshold


class StockMovement(TimeStampedModel):
    """An audit trail entry for every change in stock level."""

    class MovementType(models.TextChoices):
        INBOUND = "inbound", "Inbound"
        OUTBOUND = "outbound", "Outbound"
        ADJUSTMENT = "adjustment", "Adjustment"
        RETURN = "return", "Return"

    book = models.ForeignKey(
        Book, on_delete=models.CASCADE, related_name="stock_movements"
    )
    movement_type = models.CharField(
        max_length=20, choices=MovementType.choices
    )
    quantity = models.IntegerField(help_text="Signed quantity delta.")
    reference = models.CharField(max_length=100, blank=True)
    note = models.TextField(blank=True)

    def __str__(self) -> str:
        return f"{self.get_movement_type_display()} {self.quantity} ({self.book})"
