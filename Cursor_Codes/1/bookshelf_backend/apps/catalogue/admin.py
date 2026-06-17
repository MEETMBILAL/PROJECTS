"""Admin registrations for the catalogue."""
from django.contrib import admin

from .models import Author, Book, Category, Publisher, Tag


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "parent", "order", "is_active")
    list_filter = ("is_active",)
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}
    list_editable = ("order", "is_active")


@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Publisher)
class PublisherAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "website")
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "sku",
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
    search_fields = ("title", "isbn", "sku")
    prepopulated_fields = {"slug": ("title",)}
    autocomplete_fields = ("authors", "publisher", "category", "tags")
    list_editable = ("stock", "is_active", "is_featured")
    readonly_fields = ("view_count", "sale_count", "rating_average", "rating_count")
    fieldsets = (
        (
            "Identification",
            {"fields": ("title", "slug", "isbn", "sku")},
        ),
        (
            "Relations",
            {"fields": ("authors", "publisher", "category", "tags")},
        ),
        (
            "Content",
            {
                "fields": (
                    "description",
                    "short_description",
                    "cover_image",
                    "additional_images",
                )
            },
        ),
        (
            "Details",
            {
                "fields": (
                    "language",
                    "pages",
                    "edition",
                    "publication_date",
                    "format",
                )
            },
        ),
        (
            "Pricing & Inventory",
            {
                "fields": (
                    "original_price",
                    "sale_price",
                    "currency",
                    "stock",
                )
            },
        ),
        (
            "Status",
            {
                "fields": (
                    "is_active",
                    "is_featured",
                    "is_bestseller",
                    "is_new_arrival",
                )
            },
        ),
        (
            "Analytics & SEO",
            {
                "fields": (
                    "view_count",
                    "sale_count",
                    "rating_average",
                    "rating_count",
                    "meta_title",
                    "meta_description",
                )
            },
        ),
    )
