"""POD URLs (mounted under /api/v1/)."""
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    PODOrderViewSet,
    PODPriceQuoteView,
    PODSpecificationListView,
    PODUploadSignatureView,
)

router = DefaultRouter()
router.register("pod/orders", PODOrderViewSet, basename="pod-order")

urlpatterns = [
    path(
        "pod/specifications/",
        PODSpecificationListView.as_view(),
        name="pod-specifications",
    ),
    path("pod/quote/", PODPriceQuoteView.as_view(), name="pod-quote"),
    path(
        "pod/upload/",
        PODUploadSignatureView.as_view(),
        name="pod-upload",
    ),
    path("", include(router.urls)),
]
