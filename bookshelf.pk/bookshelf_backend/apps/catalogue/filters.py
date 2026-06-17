"""django-filter filter sets for the catalogue."""
from __future__ import annotations

import django_filters
from django.db.models import Q

from .models import Book


class BookFilter(django_filters.FilterSet):
    """Filter books by category, price range, language, format, rating and stock."""

    category = django_filters.CharFilter(method="filter_category")
    author = django_filters.CharFilter(
        field_name="authors__slug", lookup_expr="iexact"
    )
    tag = django_filters.CharFilter(field_name="tags__slug", lookup_expr="iexact")
    min_price = django_filters.NumberFilter(method="filter_min_price")
    max_price = django_filters.NumberFilter(method="filter_max_price")
    language = django_filters.CharFilter(field_name="language", lookup_expr="iexact")
    format = django_filters.CharFilter(field_name="format", lookup_expr="iexact")
    min_rating = django_filters.NumberFilter(
        field_name="average_rating", lookup_expr="gte"
    )
    in_stock = django_filters.BooleanFilter(method="filter_in_stock")
    on_sale = django_filters.BooleanFilter(method="filter_on_sale")

    class Meta:
        model = Book
        fields = ["category", "author", "tag", "language", "format"]

    def filter_category(self, queryset, name, value):
        """Match a category by slug, including its direct children."""
        return queryset.filter(
            Q(category__slug__iexact=value)
            | Q(category__parent__slug__iexact=value)
        )

    def filter_min_price(self, queryset, name, value):
        return queryset.filter(
            Q(sale_price__gte=value)
            | (Q(sale_price__isnull=True) & Q(original_price__gte=value))
        )

    def filter_max_price(self, queryset, name, value):
        return queryset.filter(
            Q(sale_price__lte=value)
            | (Q(sale_price__isnull=True) & Q(original_price__lte=value))
        )

    def filter_in_stock(self, queryset, name, value):
        if value:
            return queryset.filter(stock__gt=0)
        return queryset

    def filter_on_sale(self, queryset, name, value):
        if value:
            return queryset.filter(sale_price__isnull=False)
        return queryset
