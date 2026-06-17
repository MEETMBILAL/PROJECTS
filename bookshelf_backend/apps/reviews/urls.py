"""Review URLs (mounted under /api/v1/reviews/ and /api/v1/books/<slug>/reviews/)."""
from django.urls import path

from .views import ReviewDetailView

app_name = "reviews"

urlpatterns = [
    path("<int:pk>/", ReviewDetailView.as_view(), name="review-detail"),
]
