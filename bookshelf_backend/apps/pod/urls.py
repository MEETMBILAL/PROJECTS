from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import PODOrderViewSet, PODSpecificationListView, PODUploadSignatureView

router = DefaultRouter()
router.register("orders", PODOrderViewSet, basename="pod-order")

urlpatterns = [
    path("specifications/", PODSpecificationListView.as_view(), name="pod-specifications"),
    path("upload/", PODUploadSignatureView.as_view(), name="pod-upload"),
    path("", include(router.urls)),
]
