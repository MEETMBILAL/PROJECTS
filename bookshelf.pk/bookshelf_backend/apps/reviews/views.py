"""Views for the reviews app."""
from __future__ import annotations

from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions

from apps.catalogue.models import Book
from apps.orders.models import OrderItem
from core.permissions import IsOwnerOrReadOnly

from .models import Review
from .serializers import ReviewSerializer


class BookReviewListCreateView(generics.ListCreateAPIView):
    """List approved reviews for a book or create a new one."""

    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_book(self) -> Book:
        return get_object_or_404(Book, slug=self.kwargs["slug"], is_active=True)

    def get_queryset(self):
        return (
            Review.objects.filter(book__slug=self.kwargs["slug"], is_approved=True)
            .select_related("user", "book")
        )

    def perform_create(self, serializer):
        book = self.get_book()
        verified = OrderItem.objects.filter(
            order__user=self.request.user, book=book
        ).exists()
        review = serializer.save(
            user=self.request.user, book=book, is_verified_purchase=verified
        )
        book.recalculate_rating()
        return review


class ReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Update or delete a review owned by the requesting user."""

    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    queryset = Review.objects.select_related("user", "book")

    def perform_update(self, serializer):
        review = serializer.save()
        review.book.recalculate_rating()

    def perform_destroy(self, instance):
        book = instance.book
        instance.delete()
        book.recalculate_rating()
