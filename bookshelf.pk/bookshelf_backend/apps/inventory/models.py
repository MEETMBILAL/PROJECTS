"""Inventory and stock-movement models."""
from __future__ import annotations

from django.db import models

from apps.catalogue.models import Book
from core.models import TimeStampedModel


class StockItem(TimeStampedModel):
    """Tracks warehouse-level stock metadata for a book."""

    book = models.OneToOneField(
        Book, on_delete=models.CASCADE, related_name="stock_item"
    )
    location = models.CharField(max_length=120, default="Main Warehouse")
    reserved = models.PositiveIntegerField(default=0)
    reorder_level = models.PositiveIntegerField(default=5)

    class Meta:
        ordering = ["book__title"]

    def __str__(self) -> str:
        return f"Stock for {self.book.title}"

    @property
    def available(self) -> int:
        return max(self.book.stock - self.reserved, 0)

    @property
    def needs_reorder(self) -> bool:
        return self.available <= self.reorder_level


class StockMovement(TimeStampedModel):
    """Audit log of every change to a book's stock level."""

    class MovementType(models.TextChoices):
        INBOUND = "inbound", "Inbound"
        OUTBOUND = "outbound", "Outbound"
        ADJUSTMENT = "adjustment", "Adjustment"
        RESERVATION = "reservation", "Reservation"
        RELEASE = "release", "Release"

    book = models.ForeignKey(
        Book, on_delete=models.CASCADE, related_name="stock_movements"
    )
    movement_type = models.CharField(max_length=20, choices=MovementType.choices)
    quantity = models.IntegerField(help_text="Positive or negative delta")
    reason = models.CharField(max_length=255, blank=True)
    reference = models.CharField(max_length=100, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.get_movement_type_display()} {self.quantity} ({self.book.title})"
