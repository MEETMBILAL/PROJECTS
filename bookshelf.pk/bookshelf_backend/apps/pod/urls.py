"""URL routes for the Print-on-Demand app (mounted under /api/v1/pod/)."""
from __future__ import annotations

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import PODOrderViewSet, PODSpecificationViewSet, PODUploadView

router = DefaultRouter()
router.register("specifications", PODSpecificationViewSet, basename="pod-spec")
router.register("orders", PODOrderViewSet, basename="pod-order")

urlpatterns = [
    path("upload/", PODUploadView.as_view(), name="pod-upload"),
    path("", include(router.urls)),
]
