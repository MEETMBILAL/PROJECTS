"""Views for the Print-on-Demand app."""
from __future__ import annotations

import time

from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import PODOrder, PODSpecification
from .serializers import (
    PODOrderSerializer,
    PODPriceCalcSerializer,
    PODSpecificationSerializer,
)
from .tasks import process_pod_order


class PODSpecificationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PODSpecification.objects.filter(is_active=True)
    serializer_class = PODSpecificationSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    @action(detail=False, methods=["post"], url_path="calculate")
    def calculate(self, request):
        serializer = PODPriceCalcSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        spec = get_object_or_404(
            PODSpecification, pk=serializer.validated_data["specification_id"]
        )
        total = spec.calculate_price(
            page_count=serializer.validated_data["page_count"],
            copies=serializer.validated_data["copies"],
        )
        return Response(
            {
                "specification": spec.name,
                "page_count": serializer.validated_data["page_count"],
                "copies": serializer.validated_data["copies"],
                "total_price": total,
                "currency": settings.DEFAULT_CURRENCY,
            }
        )


class PODOrderViewSet(viewsets.ModelViewSet):
    serializer_class = PODOrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["get", "post", "head", "options"]

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return PODOrder.objects.none()
        return PODOrder.objects.filter(user=self.request.user).select_related(
            "specification"
        )

    def perform_create(self, serializer):
        spec = serializer.validated_data["specification"]
        total = spec.calculate_price(
            page_count=serializer.validated_data["page_count"],
            copies=serializer.validated_data.get("copies", 1),
        )
        order = serializer.save(
            user=self.request.user,
            total_price=total,
            status=PODOrder.Status.SUBMITTED,
        )
        process_pod_order.delay(order.pk)


class PODUploadView(APIView):
    """Return signed upload parameters for a direct Cloudinary upload.

    Falls back to mock parameters when Cloudinary credentials are absent so the
    front-end upload flow remains exercisable in development.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        timestamp = int(time.time())
        folder = "bookshelf/pod"
        cloud_name = settings.CLOUDINARY_CLOUD_NAME

        if not (cloud_name and settings.CLOUDINARY_API_SECRET):
            return Response(
                {
                    "mock": True,
                    "upload_url": "https://example.com/mock-upload",
                    "timestamp": timestamp,
                    "folder": folder,
                }
            )

        import cloudinary
        import cloudinary.utils

        cloudinary.config(
            cloud_name=cloud_name,
            api_key=settings.CLOUDINARY_API_KEY,
            api_secret=settings.CLOUDINARY_API_SECRET,
        )
        params = {"timestamp": timestamp, "folder": folder}
        signature = cloudinary.utils.api_sign_request(
            params, settings.CLOUDINARY_API_SECRET
        )
        return Response(
            {
                "mock": False,
                "upload_url": (
                    f"https://api.cloudinary.com/v1_1/{cloud_name}/auto/upload"
                ),
                "api_key": settings.CLOUDINARY_API_KEY,
                "timestamp": timestamp,
                "folder": folder,
                "signature": signature,
            },
            status=status.HTTP_200_OK,
        )
