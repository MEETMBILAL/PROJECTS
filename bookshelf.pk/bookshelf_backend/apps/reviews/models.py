"""Book review and rating models."""
from __future__ import annotations

from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from apps.catalogue.models import Book
from core.models import TimeStampedModel


class Review(TimeStampedModel):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="reviews")
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="reviews"
    )
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    title = models.CharField(max_length=200, blank=True)
    comment = models.TextField(blank=True)
    is_approved = models.BooleanField(default=True)
    is_verified_purchase = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]
        unique_together = ("book", "user")

    def __str__(self) -> str:
        return f"{self.rating}★ by {self.user} on {self.book}"
