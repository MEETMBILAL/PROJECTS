"""ViewSets and views for the catalogue app."""
from django.db.models import F
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.generics import ListAPIView
from rest_framework.response import Response

from core.permissions import IsAdminOrReadOnly

from .filters import BookFilter
from .models import Author, Book, Category, Publisher
from .serializers import (
    AuthorSerializer,
    BookDetailSerializer,
    BookListSerializer,
    BookWriteSerializer,
    CategorySerializer,
    PublisherSerializer,
)


class BookViewSet(viewsets.ModelViewSet):
    queryset = (
        Book.objects.filter(is_active=True)
        .select_related("category", "publisher")
        .prefetch_related("authors", "tags", "reviews")
    )
    lookup_field = "slug"
    permission_classes = [IsAdminOrReadOnly]
    filterset_class = BookFilter
    search_fields = ["title", "authors__name", "isbn", "tags__name", "description"]
    ordering_fields = ["original_price", "sale_price", "created_at", "sale_count", "view_count"]
    ordering = ["-created_at"]

    ORDERING_MAP = {
        "price_asc": "original_price",
        "price_desc": "-original_price",
        "newest": "-created_at",
        "oldest": "created_at",
        "bestseller": "-sale_count",
        "popular": "-view_count",
        "title": "title",
    }

    def get_serializer_class(self):
        if self.action == "retrieve":
            return BookDetailSerializer
        if self.action in ("create", "update", "partial_update"):
            return BookWriteSerializer
        return BookListSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        sort = self.request.query_params.get("sort")
        if sort in self.ORDERING_MAP:
            queryset = queryset.order_by(self.ORDERING_MAP[sort])
        return queryset

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        Book.objects.filter(pk=instance.pk).update(view_count=F("view_count") + 1)
        instance.refresh_from_db(fields=["view_count"])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def featured(self, request):
        qs = self.get_queryset().filter(is_featured=True)[:12]
        return Response(self.get_serializer(qs, many=True).data)

    @action(detail=False, methods=["get"])
    def bestsellers(self, request):
        qs = self.get_queryset().filter(is_bestseller=True).order_by("-sale_count")[:12]
        return Response(self.get_serializer(qs, many=True).data)

    @action(detail=False, methods=["get"], url_path="new-arrivals")
    def new_arrivals(self, request):
        qs = self.get_queryset().filter(is_new_arrival=True).order_by("-created_at")[:12]
        return Response(self.get_serializer(qs, many=True).data)

    @action(detail=True, methods=["get"], url_path="related")
    def related(self, request, slug=None):
        book = self.get_object()
        qs = (
            self.get_queryset()
            .filter(category=book.category)
            .exclude(pk=book.pk)[:8]
        )
        return Response(self.get_serializer(qs, many=True).data)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.filter(is_active=True, parent__isnull=True)
    serializer_class = CategorySerializer
    lookup_field = "slug"
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = None

    @action(detail=True, methods=["get"])
    def books(self, request, slug=None):
        from core.pagination import StandardResultsSetPagination

        category = self.get_object()
        books = (
            Book.objects.filter(is_active=True)
            .filter(category__slug=slug)
            .select_related("category")
            .prefetch_related("authors")
        )
        paginator = StandardResultsSetPagination()
        page = paginator.paginate_queryset(books, request, view=self)
        serializer = BookListSerializer(
            page if page is not None else books,
            many=True,
            context={"request": request},
        )
        if page is not None:
            return paginator.get_paginated_response(serializer.data)
        return Response(serializer.data)


class AuthorViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    lookup_field = "slug"
    permission_classes = [IsAdminOrReadOnly]
    search_fields = ["name"]

    @action(detail=True, methods=["get"])
    def books(self, request, slug=None):
        author = self.get_object()
        books = author.books.filter(is_active=True).prefetch_related("authors")
        serializer = BookListSerializer(books, many=True, context={"request": request})
        return Response(serializer.data)


class PublisherViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Publisher.objects.all()
    serializer_class = PublisherSerializer
    lookup_field = "slug"
    permission_classes = [IsAdminOrReadOnly]


class SearchView(ListAPIView):
    """Unified search endpoint returning books, authors and categories."""

    permission_classes = [IsAdminOrReadOnly]

    def list(self, request, *args, **kwargs):
        query = request.query_params.get("q", "").strip()
        from services.search_service import search_catalogue

        results = search_catalogue(query, request.query_params)
        books_data = BookListSerializer(
            results["books"], many=True, context={"request": request}
        ).data
        authors_data = AuthorSerializer(
            results["authors"], many=True, context={"request": request}
        ).data
        categories_data = CategorySerializer(
            results["categories"], many=True, context={"request": request}
        ).data
        return Response(
            {
                "query": query,
                "books": books_data,
                "authors": authors_data,
                "categories": categories_data,
                "total": len(books_data),
            }
        )
