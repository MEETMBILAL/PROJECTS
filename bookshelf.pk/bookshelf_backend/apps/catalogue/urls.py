"""URL routes for the catalogue app."""
from __future__ import annotations

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import AuthorViewSet, BookViewSet, CategoryViewSet, GlobalSearchView

router = DefaultRouter()
router.register("books", BookViewSet, basename="book")
router.register("categories", CategoryViewSet, basename="category")
router.register("authors", AuthorViewSet, basename="author")

urlpatterns = [
    path("search/", GlobalSearchView.as_view(), name="search"),
    path("", include(router.urls)),
]
