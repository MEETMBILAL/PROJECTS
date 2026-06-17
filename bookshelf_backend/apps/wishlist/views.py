from rest_framework import permissions, status
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.catalogue.models import Book
from core.utils import error_response, success_response

from .models import WishlistItem
from .serializers import AddToWishlistSerializer, WishlistItemSerializer


class WishlistView(ListAPIView):
    serializer_class = WishlistItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return WishlistItem.objects.filter(user=self.request.user).select_related("book")


class WishlistAddView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = AddToWishlistSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        book = Book.objects.filter(pk=serializer.validated_data["book_id"], is_active=True).first()
        if not book:
            return Response(error_response("Book not found."), status=status.HTTP_404_NOT_FOUND)
        item, created = WishlistItem.objects.get_or_create(user=request.user, book=book)
        message = "Added to wishlist" if created else "Already in wishlist"
        return Response(success_response(WishlistItemSerializer(item).data, message))


class WishlistRemoveView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, book_id):
        deleted, _ = WishlistItem.objects.filter(user=request.user, book_id=book_id).delete()
        if not deleted:
            return Response(error_response("Item not found in wishlist."), status=status.HTTP_404_NOT_FOUND)
        return Response(success_response(message="Removed from wishlist"))
