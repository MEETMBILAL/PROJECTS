"""POD views: specifications, price quotes, orders, uploads."""
from __future__ import annotations

import time

from django.conf import settings
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import PODOrder, PODSpecification
from .serializers import (
    PODOrderSerializer,
    PODPriceQuoteSerializer,
    PODSpecificationSerializer,
)


class PODSpecificationListView(ListAPIView):
    queryset = PODSpecification.objects.filter(is_active=True)
    serializer_class = PODSpecificationSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None


class PODPriceQuoteView(APIView):
    """Live price calculation for the POD configurator."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PODPriceQuoteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        spec = serializer.validated_data["specification"]
        pages = serializer.validated_data["page_count"]
        copies = serializer.validated_data["copies"]
        price = spec.calculate_price(pages, copies)
        return Response(
            {
                "specification": spec.id,
                "page_count": pages,
                "copies": copies,
                "unit_price": str(spec.calculate_price(pages, 1)),
                "total_price": str(price),
                "currency": settings.DEFAULT_CURRENCY,
            }
        )


class PODOrderViewSet(viewsets.ModelViewSet):
    serializer_class = PODOrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["get", "post", "patch", "delete"]

    def get_queryset(self):
        return PODOrder.objects.filter(
            user=self.request.user
        ).select_related("specification")

    def perform_create(self, serializer):
        spec = serializer.validated_data["specification"]
        pages = serializer.validated_data["page_count"]
        copies = serializer.validated_data.get("copies", 1)
        total = spec.calculate_price(pages, copies)
        order = serializer.save(
            user=self.request.user,
            total_price=total,
            status=PODOrder.Status.SUBMITTED,
        )
        try:
            from .tasks import process_pod_order

            process_pod_order.delay(order.pk)
        except Exception:
            pass

    @action(detail=True, methods=["post"])
    def submit(self, request, pk=None):
        order = self.get_object()
        order.status = PODOrder.Status.SUBMITTED
        order.save(update_fields=["status", "updated_at"])
        return Response(PODOrderSerializer(order).data)


class PODUploadSignatureView(APIView):
    """Return a (stubbed) signed upload payload for direct Cloudinary uploads.

    When Cloudinary credentials are configured a real signature is generated;
    otherwise a development stub is returned so the frontend flow works.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        timestamp = int(time.time())
        folder = "bookshelf/pod"
        cloud_name = settings.CLOUDINARY_CLOUD_NAME
        if cloud_name and settings.CLOUDINARY_API_SECRET:
            import hashlib

            params = f"folder={folder}&timestamp={timestamp}"
            to_sign = f"{params}{settings.CLOUDINARY_API_SECRET}"
            signature = hashlib.sha1(to_sign.encode()).hexdigest()
            return Response(
                {
                    "cloud_name": cloud_name,
                    "api_key": settings.CLOUDINARY_API_KEY,
                    "timestamp": timestamp,
                    "folder": folder,
                    "signature": signature,
                    "upload_url": (
                        f"https://api.cloudinary.com/v1_1/"
                        f"{cloud_name}/auto/upload"
                    ),
                }
            )
        return Response(
            {
                "stub": True,
                "timestamp": timestamp,
                "folder": folder,
                "message": (
                    "Cloudinary is not configured. Configure "
                    "CLOUDINARY_* env vars to enable real uploads."
                ),
            },
            status=status.HTTP_200_OK,
        )
