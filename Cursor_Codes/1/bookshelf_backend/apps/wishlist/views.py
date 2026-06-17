"""Wishlist views."""
from __future__ import annotations

from rest_framework import permissions, status
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.catalogue.models import Book

from .models import WishlistItem
from .serializers import WishlistItemSerializer


class WishlistView(ListAPIView):
    serializer_class = WishlistItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return WishlistItem.objects.filter(
            user=self.request.user
        ).select_related("book")


class WishlistAddView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        book_id = request.data.get("book_id")
        book = Book.objects.filter(pk=book_id, is_active=True).first()
        if not book:
            return Response(
                {"detail": "Book not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        item, created = WishlistItem.objects.get_or_create(
            user=request.user, book=book
        )
        return Response(
            WishlistItemSerializer(item).data,
            status=(
                status.HTTP_201_CREATED if created else status.HTTP_200_OK
            ),
        )


class WishlistRemoveView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, book_id=None):
        WishlistItem.objects.filter(
            user=request.user, book_id=book_id
        ).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
