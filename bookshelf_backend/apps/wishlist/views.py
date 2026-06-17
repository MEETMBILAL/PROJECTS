"""Views for the wishlist."""
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.catalogue.models import Book

from .models import WishlistItem
from .serializers import AddWishlistSerializer, WishlistItemSerializer


class WishlistView(generics.ListAPIView):
    serializer_class = WishlistItemSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return WishlistItem.objects.filter(user=self.request.user).select_related("book")


class WishlistAddView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AddWishlistSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        book = get_object_or_404(
            Book, pk=serializer.validated_data["book_id"], is_active=True
        )
        item, created = WishlistItem.objects.get_or_create(
            user=request.user, book=book
        )
        return Response(
            WishlistItemSerializer(item, context={"request": request}).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class WishlistRemoveView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, book_id):
        WishlistItem.objects.filter(user=request.user, book_id=book_id).delete()
        return Response({"message": "Removed from wishlist."})
