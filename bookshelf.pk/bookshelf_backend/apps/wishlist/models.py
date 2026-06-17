"""Wishlist models."""
from __future__ import annotations

from django.conf import settings
from django.db import models

from apps.catalogue.models import Book
from core.models import TimeStampedModel


class Wishlist(TimeStampedModel):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="wishlist"
    )

    def __str__(self) -> str:
        return f"Wishlist of {self.user}"


class WishlistItem(TimeStampedModel):
    wishlist = models.ForeignKey(
        Wishlist, on_delete=models.CASCADE, related_name="items"
    )
    book = models.ForeignKey(
        Book, on_delete=models.CASCADE, related_name="wishlisted_by"
    )

    class Meta:
        ordering = ["-created_at"]
        unique_together = ("wishlist", "book")

    def __str__(self) -> str:
        return f"{self.book.title} in {self.wishlist}"
