"""Review and rating models."""
from __future__ import annotations

from decimal import Decimal

from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.db.models import Avg, Count

from apps.catalogue.models import Book
from core.models import TimeStampedModel


class Review(TimeStampedModel):
    book = models.ForeignKey(
        Book, on_delete=models.CASCADE, related_name="reviews"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="reviews",
    )
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    title = models.CharField(max_length=200, blank=True)
    comment = models.TextField(blank=True)
    is_verified_purchase = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=True)

    class Meta:
        unique_together = ("book", "user")
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return f"{self.rating}* {self.book.title} by {self.user.username}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.refresh_book_rating()

    def delete(self, *args, **kwargs):
        book = self.book
        super().delete(*args, **kwargs)
        self._recompute(book)

    def refresh_book_rating(self) -> None:
        self._recompute(self.book)

    @staticmethod
    def _recompute(book: Book) -> None:
        agg = Review.objects.filter(book=book, is_approved=True).aggregate(
            avg=Avg("rating"), count=Count("id")
        )
        book.rating_average = Decimal(
            str(round(agg["avg"] or 0, 2))
        )
        book.rating_count = agg["count"] or 0
        book.save(update_fields=["rating_average", "rating_count"])
