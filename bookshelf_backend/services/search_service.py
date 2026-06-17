"""Search helpers spanning catalogue models."""
from __future__ import annotations

from django.db.models import Q

from apps.catalogue.models import Author, Book, Category


class SearchService:
    """Performs a grouped search across books, authors and categories."""

    @staticmethod
    def global_search(query: str, limit: int = 8) -> dict:
        query = (query or "").strip()
        if not query:
            return {"books": Book.objects.none(), "authors": Author.objects.none(), "categories": Category.objects.none()}

        books = (
            Book.objects.filter(is_active=True)
            .filter(
                Q(title__icontains=query)
                | Q(authors__name__icontains=query)
                | Q(isbn__icontains=query)
                | Q(tags__name__icontains=query)
            )
            .distinct()[:limit]
        )
        authors = Author.objects.filter(name__icontains=query)[:limit]
        categories = Category.objects.filter(is_active=True, name__icontains=query)[:limit]
        return {"books": books, "authors": authors, "categories": categories}
