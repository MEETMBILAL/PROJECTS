"""Account management URLs (mounted under /api/v1/account/)."""
from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import AddressViewSet, ProfileView

app_name = "account"

router = DefaultRouter()
router.register("addresses", AddressViewSet, basename="address")

urlpatterns = [
    path("profile/", ProfileView.as_view(), name="profile"),
]

urlpatterns += router.urls
