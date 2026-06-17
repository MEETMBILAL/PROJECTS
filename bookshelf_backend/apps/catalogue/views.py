from django.db.models import F
from rest_framework import mixins, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from core.permissions import IsAdminOrReadOnly
from services.search_service import SearchService

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
    lookup_field = "slug"
    permission_classes = [IsAdminOrReadOnly]
    filterset_class = BookFilter
    search_fields = ["title", "authors__name", "isbn", "tags__name", "short_description"]
    ordering_fields = ["original_price", "sale_price", "created_at", "sale_count", "view_count"]
    ordering = ["-created_at"]

    def get_queryset(self):
        return (
            Book.objects.filter(is_active=True)
            .select_related("publisher", "category")
            .prefetch_related("authors", "tags", "reviews")
        )

    def get_serializer_class(self):
        if self.action == "retrieve":
            return BookDetailSerializer
        if self.action in {"create", "update", "partial_update"}:
            return BookWriteSerializer
        return BookListSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        Book.objects.filter(pk=instance.pk).update(view_count=F("view_count") + 1)
        serializer = BookDetailSerializer(instance, context=self.get_serializer_context())
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def featured(self, request):
        qs = self.get_queryset().filter(is_featured=True)[:12]
        return Response(BookListSerializer(qs, many=True, context=self.get_serializer_context()).data)

    @action(detail=False, methods=["get"])
    def bestsellers(self, request):
        qs = self.get_queryset().filter(is_bestseller=True).order_by("-sale_count")[:12]
        return Response(BookListSerializer(qs, many=True, context=self.get_serializer_context()).data)

    @action(detail=False, methods=["get"], url_path="new-arrivals")
    def new_arrivals(self, request):
        qs = self.get_queryset().filter(is_new_arrival=True)[:12]
        return Response(BookListSerializer(qs, many=True, context=self.get_serializer_context()).data)

    @action(detail=True, methods=["get"])
    def related(self, request, slug=None):
        book = self.get_object()
        qs = (
            self.get_queryset()
            .filter(category=book.category)
            .exclude(pk=book.pk)[:8]
        )
        return Response(BookListSerializer(qs, many=True, context=self.get_serializer_context()).data)


class CategoryViewSet(viewsets.ModelViewSet):
    lookup_field = "slug"
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = None

    def get_queryset(self):
        qs = Category.objects.filter(is_active=True)
        if self.action == "list":
            qs = qs.filter(parent__isnull=True)
        return qs

    @action(detail=True, methods=["get"])
    def books(self, request, slug=None):
        category = self.get_object()
        qs = (
            Book.objects.filter(is_active=True)
            .filter(category__slug=slug)
            .select_related("category")
            .prefetch_related("authors", "reviews")
        )
        page = self.paginate_queryset(qs) if hasattr(self, "paginator") else None
        from core.pagination import StandardResultsSetPagination

        paginator = StandardResultsSetPagination()
        page = paginator.paginate_queryset(qs, request, view=self)
        serializer = BookListSerializer(page, many=True, context=self.get_serializer_context())
        return paginator.get_paginated_response(serializer.data)


class AuthorViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    lookup_field = "slug"
    serializer_class = AuthorSerializer
    permission_classes = [IsAdminOrReadOnly]
    queryset = Author.objects.all().prefetch_related("books")
    search_fields = ["name"]


class PublisherViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    lookup_field = "slug"
    serializer_class = PublisherSerializer
    permission_classes = [IsAdminOrReadOnly]
    queryset = Publisher.objects.all()


class GlobalSearchView(APIView):
    """Grouped search across books, authors and categories."""

    permission_classes = [permissions.AllowAny]

    def get(self, request):
        query = request.query_params.get("q", "")
        results = SearchService.global_search(query)
        return Response(
            {
                "books": BookListSerializer(
                    results["books"], many=True, context={"request": request}
                ).data,
                "authors": AuthorSerializer(
                    results["authors"], many=True, context={"request": request}
                ).data,
                "categories": CategorySerializer(
                    results["categories"], many=True, context={"request": request}
                ).data,
            }
        )
