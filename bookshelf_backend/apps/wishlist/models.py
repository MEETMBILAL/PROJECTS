from django.conf import settings
from django.db import models

from apps.catalogue.models import Book
from core.models import TimeStampedModel


class WishlistItem(TimeStampedModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="wishlist_items"
    )
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="wishlisted_by")

    class Meta:
        ordering = ["-created_at"]
        unique_together = ("user", "book")

    def __str__(self) -> str:
        return f"{self.user} ♥ {self.book}"
