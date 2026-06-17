import django_filters
from django.db.models import Avg, Q

from .models import Book


class BookFilter(django_filters.FilterSet):
    category = django_filters.CharFilter(method="filter_category")
    author = django_filters.CharFilter(field_name="authors__slug", lookup_expr="iexact")
    tag = django_filters.CharFilter(field_name="tags__slug", lookup_expr="iexact")
    min_price = django_filters.NumberFilter(method="filter_min_price")
    max_price = django_filters.NumberFilter(method="filter_max_price")
    language = django_filters.CharFilter(field_name="language", lookup_expr="iexact")
    format = django_filters.CharFilter(field_name="format", lookup_expr="iexact")
    in_stock = django_filters.BooleanFilter(method="filter_in_stock")
    min_rating = django_filters.NumberFilter(method="filter_min_rating")
    is_featured = django_filters.BooleanFilter(field_name="is_featured")
    is_bestseller = django_filters.BooleanFilter(field_name="is_bestseller")
    is_new_arrival = django_filters.BooleanFilter(field_name="is_new_arrival")

    class Meta:
        model = Book
        fields = ["category", "author", "tag", "language", "format"]

    def filter_category(self, queryset, name, value):
        return queryset.filter(
            Q(category__slug__iexact=value) | Q(category__parent__slug__iexact=value)
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

    def filter_min_rating(self, queryset, name, value):
        return queryset.annotate(_avg_rating=Avg("reviews__rating")).filter(
            _avg_rating__gte=value
        )
