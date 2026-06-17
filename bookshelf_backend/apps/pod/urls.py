"""POD URLs (mounted under /api/v1/pod/)."""
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import PODOrderViewSet, PODSpecificationViewSet, PODUploadSignatureView

app_name = "pod"

router = DefaultRouter()
router.register("specifications", PODSpecificationViewSet, basename="specification")
router.register("orders", PODOrderViewSet, basename="pod-order")

urlpatterns = [
    path("upload/", PODUploadSignatureView.as_view(), name="upload"),
    path("", include(router.urls)),
]
