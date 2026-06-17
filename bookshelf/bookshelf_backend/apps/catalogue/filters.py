"""django-filter filter sets for the catalogue."""
from __future__ import annotations

import django_filters as filters

from .models import Book


class BookFilter(filters.FilterSet):
    """Rich filtering for the book listing / search endpoints."""

    category = filters.CharFilter(
        field_name="category__slug", lookup_expr="iexact"
    )
    author = filters.CharFilter(
        field_name="authors__slug", lookup_expr="iexact"
    )
    publisher = filters.CharFilter(
        field_name="publisher__slug", lookup_expr="iexact"
    )
    tag = filters.CharFilter(field_name="tags__slug", lookup_expr="iexact")
    min_price = filters.NumberFilter(
        field_name="original_price", lookup_expr="gte"
    )
    max_price = filters.NumberFilter(
        field_name="original_price", lookup_expr="lte"
    )
    language = filters.CharFilter(
        field_name="language", lookup_expr="iexact"
    )
    format = filters.CharFilter(field_name="format", lookup_expr="iexact")
    min_rating = filters.NumberFilter(
        field_name="rating_average", lookup_expr="gte"
    )
    in_stock = filters.BooleanFilter(method="filter_in_stock")
    featured = filters.BooleanFilter(field_name="is_featured")
    bestseller = filters.BooleanFilter(field_name="is_bestseller")
    new_arrival = filters.BooleanFilter(field_name="is_new_arrival")

    class Meta:
        model = Book
        fields = [
            "category",
            "author",
            "publisher",
            "tag",
            "min_price",
            "max_price",
            "language",
            "format",
            "min_rating",
            "in_stock",
            "featured",
            "bestseller",
            "new_arrival",
        ]

    def filter_in_stock(self, queryset, name, value):
        if value is True:
            return queryset.filter(stock__gt=0)
        if value is False:
            return queryset.filter(stock=0)
        return queryset
