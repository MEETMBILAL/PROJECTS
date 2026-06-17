"""Views for the POD app."""
import time
import uuid

from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import PODOrder, PODSpecification
from .serializers import (
    PODOrderSerializer,
    PODPriceQuoteSerializer,
    PODSpecificationSerializer,
)
from .tasks import process_pod_file_task, send_pod_received_email_task


class PODSpecificationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PODSpecification.objects.filter(is_active=True)
    serializer_class = PODSpecificationSerializer
    permission_classes = [AllowAny]
    pagination_class = None

    @action(detail=False, methods=["post"])
    def quote(self, request):
        serializer = PODPriceQuoteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        spec = get_object_or_404(
            PODSpecification, pk=serializer.validated_data["specification_id"]
        )
        price = spec.calculate_price(
            serializer.validated_data["page_count"],
            serializer.validated_data["copies"],
        )
        return Response(
            {
                "specification": spec.name,
                "page_count": serializer.validated_data["page_count"],
                "copies": serializer.validated_data["copies"],
                "total_price": price,
            }
        )


class PODOrderViewSet(viewsets.ModelViewSet):
    serializer_class = PODOrderSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "post", "head", "options"]

    def get_queryset(self):
        return PODOrder.objects.filter(user=self.request.user).select_related(
            "specification"
        )

    def perform_create(self, serializer):
        order = serializer.save()
        process_pod_file_task.delay(order.id)
        send_pod_received_email_task.delay(order.id)


class PODUploadSignatureView(APIView):
    """Return a signed Cloudinary upload payload for direct browser uploads."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        from django.conf import settings

        cloud_name = settings.CLOUDINARY_STORAGE.get("CLOUD_NAME")
        api_key = settings.CLOUDINARY_STORAGE.get("API_KEY")
        api_secret = settings.CLOUDINARY_STORAGE.get("API_SECRET")
        timestamp = int(time.time())
        public_id = f"pod/{request.user.id}/{uuid.uuid4().hex}"
        folder = "bookshelf/pod"

        if not (cloud_name and api_key and api_secret):
            return Response(
                {
                    "stub": True,
                    "message": "Cloudinary not configured; returning stub payload.",
                    "timestamp": timestamp,
                    "public_id": public_id,
                    "folder": folder,
                }
            )

        import cloudinary.utils

        params_to_sign = {
            "timestamp": timestamp,
            "public_id": public_id,
            "folder": folder,
        }
        signature = cloudinary.utils.api_sign_request(params_to_sign, api_secret)
        return Response(
            {
                "stub": False,
                "cloud_name": cloud_name,
                "api_key": api_key,
                "timestamp": timestamp,
                "public_id": public_id,
                "folder": folder,
                "signature": signature,
                "upload_url": f"https://api.cloudinary.com/v1_1/{cloud_name}/auto/upload",
            },
            status=status.HTTP_200_OK,
        )
