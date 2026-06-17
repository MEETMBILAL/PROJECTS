"""Review views."""
from __future__ import annotations

from django.shortcuts import get_object_or_404
from rest_framework import permissions, viewsets
from rest_framework.exceptions import ValidationError

from apps.catalogue.models import Book
from apps.orders.models import OrderItem
from core.permissions import IsOwnerOrReadOnly

from .models import Review
from .serializers import ReviewSerializer


class ReviewViewSet(viewsets.ModelViewSet):
    """Reviews scoped to a book via the URL (/books/{slug}/reviews/).

    The detail routes (/reviews/{id}/) operate without the book slug.
    """

    serializer_class = ReviewSerializer
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly,
        IsOwnerOrReadOnly,
    ]

    def get_queryset(self):
        queryset = Review.objects.filter(is_approved=True).select_related(
            "user", "book"
        )
        slug = self.kwargs.get("book_slug")
        if slug:
            queryset = queryset.filter(book__slug=slug)
        return queryset

    def perform_create(self, serializer):
        slug = self.kwargs.get("book_slug")
        book = get_object_or_404(Book, slug=slug)
        if Review.objects.filter(book=book, user=self.request.user).exists():
            raise ValidationError("You have already reviewed this book.")
        verified = OrderItem.objects.filter(
            order__user=self.request.user, book=book
        ).exists()
        serializer.save(
            book=book,
            user=self.request.user,
            is_verified_purchase=verified,
        )
