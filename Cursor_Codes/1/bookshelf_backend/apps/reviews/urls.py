"""Review URLs (mounted under /api/v1/)."""
from django.urls import path

from .views import ReviewViewSet

book_reviews = ReviewViewSet.as_view({"get": "list", "post": "create"})
review_detail = ReviewViewSet.as_view(
    {"get": "retrieve", "patch": "partial_update", "delete": "destroy"}
)

urlpatterns = [
    path(
        "books/<slug:book_slug>/reviews/",
        book_reviews,
        name="book-reviews",
    ),
    path("reviews/<int:pk>/", review_detail, name="review-detail"),
]
