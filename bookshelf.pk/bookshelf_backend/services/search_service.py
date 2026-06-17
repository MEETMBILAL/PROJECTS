"""Search helpers for the catalogue."""
from __future__ import annotations

from django.db.models import Q, QuerySet

from apps.catalogue.models import Author, Book, Category


def search_books(query: str) -> QuerySet[Book]:
    """Return active books matching ``query`` across several fields."""
    if not query:
        return Book.objects.none()
    return (
        Book.objects.filter(is_active=True)
        .filter(
            Q(title__icontains=query)
            | Q(authors__name__icontains=query)
            | Q(isbn__icontains=query)
            | Q(tags__name__icontains=query)
            | Q(short_description__icontains=query)
        )
        .distinct()
    )


def search_authors(query: str) -> QuerySet[Author]:
    if not query:
        return Author.objects.none()
    return Author.objects.filter(name__icontains=query)


def search_categories(query: str) -> QuerySet[Category]:
    if not query:
        return Category.objects.none()
    return Category.objects.filter(is_active=True, name__icontains=query)
