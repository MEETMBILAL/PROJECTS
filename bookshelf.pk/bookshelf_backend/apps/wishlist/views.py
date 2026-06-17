"""Views for the wishlist app."""
from __future__ import annotations

from django.shortcuts import get_object_or_404
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.catalogue.models import Book

from .models import Wishlist, WishlistItem
from .serializers import AddToWishlistSerializer, WishlistItemSerializer


def _get_wishlist(user) -> Wishlist:
    wishlist, _ = Wishlist.objects.get_or_create(user=user)
    return wishlist


class WishlistView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        wishlist = _get_wishlist(request.user)
        items = wishlist.items.select_related("book").prefetch_related(
            "book__authors"
        )
        return Response(WishlistItemSerializer(items, many=True).data)


class WishlistAddView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = AddToWishlistSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        book = get_object_or_404(
            Book, pk=serializer.validated_data["book_id"], is_active=True
        )
        wishlist = _get_wishlist(request.user)
        item, created = WishlistItem.objects.get_or_create(
            wishlist=wishlist, book=book
        )
        return Response(
            WishlistItemSerializer(item).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class WishlistRemoveView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, book_id: int):
        wishlist = _get_wishlist(request.user)
        deleted, _ = wishlist.items.filter(book_id=book_id).delete()
        if not deleted:
            return Response(
                {"detail": "Item not in wishlist."},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response({"detail": "Removed from wishlist."})
