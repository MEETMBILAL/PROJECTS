"""Admin configuration for the catalogue app."""
from __future__ import annotations

from django.contrib import admin

from .models import Author, Book, Category, Publisher, Tag


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "parent", "order", "is_active")
    list_filter = ("is_active",)
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Publisher)
class PublisherAdmin(admin.ModelAdmin):
    list_display = ("name", "website")
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "category",
        "original_price",
        "sale_price",
        "stock",
        "is_active",
        "is_featured",
        "is_bestseller",
    )
    list_filter = (
        "is_active",
        "is_featured",
        "is_bestseller",
        "is_new_arrival",
        "format",
        "language",
        "category",
    )
    search_fields = ("title", "isbn", "sku", "authors__name")
    prepopulated_fields = {"slug": ("title",)}
    filter_horizontal = ("authors", "tags")
    readonly_fields = ("view_count", "sale_count", "average_rating", "review_count")
    autocomplete_fields = ("publisher", "category")
