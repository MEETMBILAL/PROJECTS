"""Catalogue URLs (mounted under /api/v1/)."""
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.reviews.views import BookReviewListCreateView

from .views import (
    AuthorViewSet,
    BookViewSet,
    CategoryViewSet,
    PublisherViewSet,
    SearchView,
)

app_name = "catalogue"

router = DefaultRouter()
router.register("books", BookViewSet, basename="book")
router.register("categories", CategoryViewSet, basename="category")
router.register("authors", AuthorViewSet, basename="author")
router.register("publishers", PublisherViewSet, basename="publisher")

urlpatterns = [
    path("search/", SearchView.as_view(), name="search"),
    path(
        "books/<slug:slug>/reviews/",
        BookReviewListCreateView.as_view(),
        name="book-reviews",
    ),
    path("", include(router.urls)),
]
