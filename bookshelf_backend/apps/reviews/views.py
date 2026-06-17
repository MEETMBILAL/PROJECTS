"""Views for book reviews."""
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response

from apps.catalogue.models import Book
from apps.orders.models import OrderItem
from core.permissions import IsOwnerOrReadOnly

from .models import Review
from .serializers import ReviewSerializer, ReviewWriteSerializer


class BookReviewListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return ReviewWriteSerializer
        return ReviewSerializer

    def get_book(self):
        return get_object_or_404(Book, slug=self.kwargs["slug"], is_active=True)

    def get_queryset(self):
        return (
            Review.objects.filter(book=self.get_book(), is_approved=True)
            .select_related("user")
        )

    def create(self, request, *args, **kwargs):
        book = self.get_book()
        if Review.objects.filter(book=book, user=request.user).exists():
            return Response(
                {"detail": "You have already reviewed this book."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer = ReviewWriteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        verified = OrderItem.objects.filter(
            order__user=request.user, book=book
        ).exists()
        review = serializer.save(
            book=book, user=request.user, is_verified_purchase=verified
        )
        return Response(
            ReviewSerializer(review).data, status=status.HTTP_201_CREATED
        )


class ReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Review.objects.all()
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def get_serializer_class(self):
        if self.request.method in ("PUT", "PATCH"):
            return ReviewWriteSerializer
        return ReviewSerializer
