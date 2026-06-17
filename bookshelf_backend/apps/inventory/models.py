from django.db import models

from apps.catalogue.models import Book
from core.models import TimeStampedModel


class StockItem(TimeStampedModel):
    book = models.OneToOneField(Book, on_delete=models.CASCADE, related_name="stock_item")
    quantity = models.IntegerField(default=0)
    reorder_level = models.PositiveIntegerField(default=5)
    location = models.CharField(max_length=120, blank=True)

    class Meta:
        ordering = ["-updated_at"]

    def __str__(self) -> str:
        return f"{self.book.title} — {self.quantity} in stock"

    @property
    def needs_reorder(self) -> bool:
        return self.quantity <= self.reorder_level


class StockMovement(TimeStampedModel):
    MOVEMENT_CHOICES = [
        ("in", "Stock In"),
        ("out", "Stock Out"),
        ("adjustment", "Adjustment"),
        ("return", "Return"),
    ]

    stock_item = models.ForeignKey(
        StockItem, on_delete=models.CASCADE, related_name="movements"
    )
    movement_type = models.CharField(max_length=20, choices=MOVEMENT_CHOICES)
    quantity = models.IntegerField()
    reason = models.CharField(max_length=255, blank=True)
    reference = models.CharField(max_length=100, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.movement_type} {self.quantity} ({self.stock_item.book.title})"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Keep the related stock item quantity in sync.
        delta = self.quantity if self.movement_type in {"in", "return"} else -abs(self.quantity)
        if self.movement_type == "adjustment":
            delta = self.quantity
        StockItem.objects.filter(pk=self.stock_item_id).update(
            quantity=models.F("quantity") + delta
        )
