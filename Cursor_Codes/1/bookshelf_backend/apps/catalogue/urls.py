"""Catalogue URLs (mounted under /api/v1/)."""
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AuthorViewSet,
    BookViewSet,
    CategoryViewSet,
    PublisherViewSet,
    SearchView,
)

router = DefaultRouter()
router.register("books", BookViewSet, basename="book")
router.register("categories", CategoryViewSet, basename="category")
router.register("authors", AuthorViewSet, basename="author")
router.register("publishers", PublisherViewSet, basename="publisher")

urlpatterns = [
    path("search/", SearchView.as_view(), name="search"),
    path("", include(router.urls)),
]
