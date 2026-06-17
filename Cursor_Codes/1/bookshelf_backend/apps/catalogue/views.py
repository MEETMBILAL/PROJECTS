"""ViewSets and views for the catalogue."""
from __future__ import annotations

from django.db.models import F, Q
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from core.pagination import StandardResultsSetPagination

from .filters import BookFilter
from .models import Author, Book, Category, Publisher
from .serializers import (
    AuthorSerializer,
    BookDetailSerializer,
    BookListSerializer,
    CategorySerializer,
    PublisherSerializer,
)

ORDERING_MAP = {
    "price_asc": "original_price",
    "price_desc": "-original_price",
    "newest": "-created_at",
    "oldest": "created_at",
    "bestseller": "-sale_count",
    "rating": "-rating_average",
    "title": "title",
}


class BookViewSet(
    mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet
):
    """Read-only book endpoints with filtering, search and curated actions."""

    permission_classes = [AllowAny]
    lookup_field = "slug"
    filterset_class = BookFilter
    search_fields = [
        "title",
        "authors__name",
        "isbn",
        "tags__name",
        "short_description",
    ]
    ordering_fields = [
        "original_price",
        "created_at",
        "sale_count",
        "rating_average",
        "title",
    ]

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
        # Atomic view counter increment without a race condition.
        Book.objects.filter(pk=instance.pk).update(
            view_count=F("view_count") + 1
        )
        instance.refresh_from_db(fields=["view_count"])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def _curated(self, request, **flags):
        queryset = self.get_queryset().filter(**flags)[:12]
        serializer = BookListSerializer(
            queryset, many=True, context={"request": request}
        )
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def featured(self, request):
        return self._curated(request, is_featured=True)

    @action(detail=False, methods=["get"])
    def bestsellers(self, request):
        return self._curated(request, is_bestseller=True)

    @action(detail=False, methods=["get"], url_path="new-arrivals")
    def new_arrivals(self, request):
        return self._curated(request, is_new_arrival=True)

    @action(detail=True, methods=["get"])
    def related(self, request, slug=None):
        book = self.get_object()
        queryset = (
            self.get_queryset()
            .filter(category=book.category)
            .exclude(pk=book.pk)[:8]
        )
        serializer = BookListSerializer(
            queryset, many=True, context={"request": request}
        )
        return Response(serializer.data)


class CategoryViewSet(
    mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet
):
    permission_classes = [AllowAny]
    lookup_field = "slug"
    serializer_class = CategorySerializer
    pagination_class = None

    def get_queryset(self):
        return Category.objects.filter(is_active=True).order_by("order")

    @action(
        detail=True,
        methods=["get"],
        pagination_class=StandardResultsSetPagination,
    )
    def books(self, request, slug=None):
        category = self.get_object()
        queryset = (
            Book.objects.filter(is_active=True, category=category)
            .select_related("publisher", "category")
            .prefetch_related("authors")
        )
        paginator = StandardResultsSetPagination()
        page = paginator.paginate_queryset(queryset, request, view=self)
        serializer = BookListSerializer(
            page, many=True, context={"request": request}
        )
        return paginator.get_paginated_response(serializer.data)


class AuthorViewSet(
    mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet
):
    permission_classes = [AllowAny]
    lookup_field = "slug"
    serializer_class = AuthorSerializer
    search_fields = ["name"]

    def get_queryset(self):
        return Author.objects.all().prefetch_related("books")

    @action(detail=True, methods=["get"])
    def books(self, request, slug=None):
        author = self.get_object()
        queryset = (
            Book.objects.filter(is_active=True, authors=author)
            .select_related("publisher", "category")
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


class PublisherViewSet(
    mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet
):
    permission_classes = [AllowAny]
    lookup_field = "slug"
    serializer_class = PublisherSerializer
    queryset = Publisher.objects.all()
    pagination_class = None


class SearchView(APIView):
    """Unified search across books, authors and categories."""

    permission_classes = [AllowAny]

    def get(self, request):
        query = request.query_params.get("q", "").strip()
        if not query:
            return Response(
                {"books": [], "authors": [], "categories": []}
            )

        books = (
            Book.objects.filter(is_active=True)
            .filter(
                Q(title__icontains=query)
                | Q(authors__name__icontains=query)
                | Q(isbn__icontains=query)
                | Q(tags__name__icontains=query)
            )
            .select_related("category")
            .prefetch_related("authors")
            .distinct()[:20]
        )
        authors = Author.objects.filter(name__icontains=query)[:10]
        categories = Category.objects.filter(
            name__icontains=query, is_active=True
        )[:10]

        return Response(
            {
                "books": BookListSerializer(
                    books, many=True, context={"request": request}
                ).data,
                "authors": AuthorSerializer(
                    authors, many=True, context={"request": request}
                ).data,
                "categories": CategorySerializer(
                    categories, many=True, context={"request": request}
                ).data,
            }
        )
