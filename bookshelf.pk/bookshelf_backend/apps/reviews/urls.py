"""URL routes for the reviews app."""
from __future__ import annotations

from django.urls import path

from .views import BookReviewListCreateView, ReviewDetailView

urlpatterns = [
    path(
        "books/<slug:slug>/reviews/",
        BookReviewListCreateView.as_view(),
        name="book-reviews",
    ),
    path("reviews/<int:pk>/", ReviewDetailView.as_view(), name="review-detail"),
]
