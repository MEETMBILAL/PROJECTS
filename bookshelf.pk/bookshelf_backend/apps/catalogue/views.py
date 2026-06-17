"""ViewSets and views for the catalogue app."""
from __future__ import annotations

from django.db.models import F
from rest_framework import mixins, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from services.search_service import (
    search_authors,
    search_books,
    search_categories,
)

from .filters import BookFilter
from .models import Author, Book, Category
from .serializers import (
    AuthorSerializer,
    BookDetailSerializer,
    BookListSerializer,
    CategorySerializer,
)

ORDERING_MAP = {
    "price_asc": "original_price",
    "price_desc": "-original_price",
    "newest": "-created_at",
    "oldest": "created_at",
    "bestseller": "-sale_count",
    "rating": "-average_rating",
    "title": "title",
}


class BookViewSet(viewsets.ReadOnlyModelViewSet):
    """Public read-only catalogue of books with filtering, search and sorting."""

    lookup_field = "slug"
    permission_classes = [permissions.AllowAny]
    filterset_class = BookFilter
    search_fields = ["title", "authors__name", "isbn", "tags__name"]
    ordering_fields = ["original_price", "created_at", "sale_count", "average_rating"]

    def get_queryset(self):
        queryset = (
            Book.objects.filter(is_active=True)
            .select_related("publisher", "category")
            .prefetch_related("authors", "tags")
        )
        sort = self.request.query_params.get("sort")
        if sort in ORDERING_MAP:
            queryset = queryset.order_by(ORDERING_MAP[sort])
        return queryset

    def get_serializer_class(self):
        if self.action == "retrieve":
            return BookDetailSerializer
        return BookListSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        Book.objects.filter(pk=instance.pk).update(view_count=F("view_count") + 1)
        instance.refresh_from_db(fields=["view_count"])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def _flagged(self, request, **flags):
        queryset = self.filter_queryset(self.get_queryset()).filter(**flags)
        page = self.paginate_queryset(queryset)
        serializer = BookListSerializer(
            page if page is not None else queryset,
            many=True,
            context={"request": request},
        )
        if page is not None:
            return self.get_paginated_response(serializer.data)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def featured(self, request):
        return self._flagged(request, is_featured=True)

    @action(detail=False, methods=["get"])
    def bestsellers(self, request):
        return self._flagged(request, is_bestseller=True)

    @action(detail=False, methods=["get"], url_path="new-arrivals")
    def new_arrivals(self, request):
        return self._flagged(request, is_new_arrival=True)

    @action(detail=True, methods=["get"], url_path="related")
    def related(self, request, slug=None):
        book = self.get_object()
        queryset = (
            Book.objects.filter(is_active=True, category=book.category)
            .exclude(pk=book.pk)
            .select_related("category")
            .prefetch_related("authors")[:8]
        )
        serializer = BookListSerializer(
            queryset, many=True, context={"request": request}
        )
        return Response(serializer.data)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """Public read-only category tree."""

    lookup_field = "slug"
    permission_classes = [permissions.AllowAny]
    serializer_class = CategorySerializer
    pagination_class = None

    def get_queryset(self):
        queryset = Category.objects.filter(is_active=True)
        if self.action == "list":
            queryset = queryset.filter(parent__isnull=True)
        return queryset

    @action(detail=True, methods=["get"])
    def books(self, request, slug=None):
        category = self.get_object()
        queryset = (
            Book.objects.filter(is_active=True)
            .filter(category__slug=slug)
            .select_related("category")
            .prefetch_related("authors")
        )
        page = self.paginate_queryset(queryset)
        serializer = BookListSerializer(
            page if page is not None else queryset,
            many=True,
            context={"request": request},
        )
        if page is not None:
            return self.get_paginated_response(serializer.data)
        return Response(serializer.data)


class AuthorViewSet(viewsets.ReadOnlyModelViewSet):
    """Public read-only authors directory."""

    lookup_field = "slug"
    permission_classes = [permissions.AllowAny]
    serializer_class = AuthorSerializer
    queryset = Author.objects.all()
    search_fields = ["name"]

    @action(detail=True, methods=["get"])
    def books(self, request, slug=None):
        author = self.get_object()
        queryset = (
            author.books.filter(is_active=True)
            .select_related("category")
            .prefetch_related("authors")
        )
        page = self.paginate_queryset(queryset)
        serializer = BookListSerializer(
            page if page is not None else queryset,
            many=True,
            context={"request": request},
        )
        if page is not None:
            return self.get_paginated_response(serializer.data)
        return Response(serializer.data)


class GlobalSearchView(APIView):
    """Unified search endpoint grouping books, authors and categories."""

    permission_classes = [permissions.AllowAny]

    def get(self, request):
        query = request.query_params.get("q", "").strip()
        books = search_books(query).select_related("category").prefetch_related(
            "authors"
        )[:24]
        authors = search_authors(query)[:8]
        categories = search_categories(query)[:8]
        return Response(
            {
                "query": query,
                "books": BookListSerializer(
                    books, many=True, context={"request": request}
                ).data,
                "authors": AuthorSerializer(authors, many=True).data,
                "categories": CategorySerializer(
                    categories, many=True, context={"request": request}
                ).data,
            }
        )
