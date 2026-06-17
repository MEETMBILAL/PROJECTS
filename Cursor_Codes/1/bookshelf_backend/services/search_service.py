"""Search helpers shared by the catalogue search endpoints."""
from __future__ import annotations

from django.db.models import Q, QuerySet

from apps.catalogue.models import Book


def search_books(query: str) -> QuerySet[Book]:
    """Return active books matching ``query`` across key text fields."""
    query = (query or "").strip()
    queryset = (
        Book.objects.filter(is_active=True)
        .select_related("category", "publisher")
        .prefetch_related("authors", "tags")
    )
    if not query:
        return queryset.none()
    return queryset.filter(
        Q(title__icontains=query)
        | Q(authors__name__icontains=query)
        | Q(isbn__icontains=query)
        | Q(tags__name__icontains=query)
        | Q(short_description__icontains=query)
    ).distinct()
