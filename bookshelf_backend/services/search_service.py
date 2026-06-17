"""Search service layer combining catalogue lookups."""
from __future__ import annotations

from django.db.models import Q

from apps.catalogue.models import Author, Book, Category


def search_catalogue(query: str, params=None) -> dict:
    """Return matching books, authors and categories for a search query.

    ``params`` may contain optional ``category``, ``min_price``, ``max_price``,
    ``language`` and ``format`` query parameters to refine the book results.
    """
    params = params or {}
    books = Book.objects.filter(is_active=True).select_related("category").prefetch_related(
        "authors"
    )
    authors = Author.objects.none()
    categories = Category.objects.none()

    if query:
        books = books.filter(
            Q(title__icontains=query)
            | Q(authors__name__icontains=query)
            | Q(isbn__icontains=query)
            | Q(tags__name__icontains=query)
            | Q(short_description__icontains=query)
        ).distinct()
        authors = Author.objects.filter(name__icontains=query)[:10]
        categories = Category.objects.filter(
            name__icontains=query, is_active=True
        )[:10]

    category = params.get("category")
    if category:
        books = books.filter(category__slug__iexact=category)

    language = params.get("language")
    if language:
        books = books.filter(language__iexact=language)

    book_format = params.get("format")
    if book_format:
        books = books.filter(format__iexact=book_format)

    min_price = params.get("min_price")
    if min_price:
        books = books.filter(
            Q(sale_price__gte=min_price)
            | (Q(sale_price__isnull=True) & Q(original_price__gte=min_price))
        )

    max_price = params.get("max_price")
    if max_price:
        books = books.filter(
            Q(sale_price__lte=max_price, sale_price__isnull=False)
            | (Q(sale_price__isnull=True) & Q(original_price__lte=max_price))
        )

    return {
        "books": books[:50],
        "authors": authors,
        "categories": categories,
    }
