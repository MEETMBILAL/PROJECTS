from rest_framework import permissions, status
from rest_framework.generics import ListCreateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.catalogue.models import Book
from core.permissions import IsOwnerOrReadOnly
from core.utils import error_response, success_response

from .models import Review
from .serializers import ReviewSerializer, ReviewWriteSerializer


class BookReviewListCreateView(ListCreateAPIView):
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_book(self):
        return Book.objects.filter(slug=self.kwargs["slug"], is_active=True).first()

    def get_queryset(self):
        return Review.objects.filter(
            book__slug=self.kwargs["slug"], is_approved=True
        ).select_related("user")

    def create(self, request, *args, **kwargs):
        book = self.get_book()
        if not book:
            return Response(error_response("Book not found."), status=status.HTTP_404_NOT_FOUND)
        if Review.objects.filter(book=book, user=request.user).exists():
            return Response(
                error_response("You have already reviewed this book."),
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer = ReviewWriteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        review = serializer.save(book=book, user=request.user)
        return Response(
            success_response(ReviewSerializer(review).data, "Review submitted"),
            status=status.HTTP_201_CREATED,
        )


class ReviewDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_object(self, pk):
        review = Review.objects.filter(pk=pk).first()
        if review:
            self.check_object_permissions(self.request, review)
        return review

    def patch(self, request, pk):
        review = self.get_object(pk)
        if not review:
            return Response(error_response("Review not found."), status=status.HTTP_404_NOT_FOUND)
        serializer = ReviewWriteSerializer(review, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(success_response(ReviewSerializer(review).data, "Review updated"))

    def delete(self, request, pk):
        review = self.get_object(pk)
        if not review:
            return Response(error_response("Review not found."), status=status.HTTP_404_NOT_FOUND)
        review.delete()
        return Response(success_response(message="Review deleted"))
