import time

from rest_framework import mixins, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from core.utils import error_response, success_response

from .models import PODOrder, PODSpecification
from .serializers import (
    PODOrderSerializer,
    PODPriceCalcSerializer,
    PODSpecificationSerializer,
)


class PODSpecificationListView(ListAPIView):
    serializer_class = PODSpecificationSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None
    queryset = PODSpecification.objects.filter(is_active=True)


class PODOrderViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class = PODOrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PODOrder.objects.filter(user=self.request.user).select_related("specification")

    def perform_create(self, serializer):
        order = serializer.save(user=self.request.user, status="submitted")
        from .tasks import process_pod_file

        process_pod_file.delay(order.id)

    @action(detail=False, methods=["post"], url_path="calculate-price")
    def calculate_price(self, request):
        serializer = PODPriceCalcSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        spec = PODSpecification.objects.filter(
            pk=serializer.validated_data["specification_id"], is_active=True
        ).first()
        if not spec:
            return Response(error_response("Specification not found."), status=404)
        price = spec.calculate_price(
            serializer.validated_data["page_count"], serializer.validated_data["copies"]
        )
        return Response(success_response({"total_price": price}, "Price calculated"))


class PODUploadSignatureView(APIView):
    """Return a signed Cloudinary upload payload for direct browser uploads.

    Falls back to an unsigned mock payload when Cloudinary credentials are not
    configured so the frontend flow remains testable in development.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        from django.conf import settings

        cloud_name = settings.CLOUDINARY_STORAGE.get("CLOUD_NAME")
        api_key = settings.CLOUDINARY_STORAGE.get("API_KEY")
        api_secret = settings.CLOUDINARY_STORAGE.get("API_SECRET")
        timestamp = int(time.time())
        folder = "bookshelf/pod"

        if not (cloud_name and api_key and api_secret):
            return Response(
                success_response(
                    {
                        "mock": True,
                        "cloud_name": cloud_name or "demo",
                        "api_key": api_key or "mock-key",
                        "timestamp": timestamp,
                        "folder": folder,
                        "signature": "mock-signature",
                    },
                    "Mock upload signature (configure Cloudinary for production)",
                )
            )

        import hashlib

        to_sign = f"folder={folder}&timestamp={timestamp}{api_secret}"
        signature = hashlib.sha1(to_sign.encode("utf-8")).hexdigest()
        return Response(
            success_response(
                {
                    "mock": False,
                    "cloud_name": cloud_name,
                    "api_key": api_key,
                    "timestamp": timestamp,
                    "folder": folder,
                    "signature": signature,
                    "upload_url": f"https://api.cloudinary.com/v1_1/{cloud_name}/auto/upload",
                },
                "Upload signature generated",
            )
        )
