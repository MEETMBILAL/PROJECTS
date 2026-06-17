"""Admin registration for the catalogue."""
from django.contrib import admin

from .models import Author, Book, Category, Publisher, Tag


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "parent", "order", "is_active"]
    list_filter = ["is_active", "parent"]
    search_fields = ["name"]
    prepopulated_fields = {"slug": ("name",)}
    list_editable = ["order", "is_active"]


@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ["name", "slug"]
    search_fields = ["name"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Publisher)
class PublisherAdmin(admin.ModelAdmin):
    list_display = ["name", "website"]
    search_fields = ["name"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ["name", "slug"]
    search_fields = ["name"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = [
        "title",
        "category",
        "original_price",
        "sale_price",
        "stock",
        "is_active",
        "is_featured",
        "is_bestseller",
    ]
    list_filter = [
        "is_active",
        "is_featured",
        "is_bestseller",
        "is_new_arrival",
        "format",
        "language",
        "category",
    ]
    search_fields = ["title", "isbn", "sku", "authors__name"]
    prepopulated_fields = {"slug": ("title",)}
    filter_horizontal = ["authors", "tags"]
    list_editable = ["original_price", "sale_price", "stock", "is_active", "is_featured"]
    readonly_fields = ["view_count", "sale_count", "created_at", "updated_at"]
    autocomplete_fields = ["publisher", "category"]
    fieldsets = (
        ("Identity", {"fields": ("title", "slug", "isbn", "sku")}),
        ("Relations", {"fields": ("authors", "publisher", "category", "tags")}),
        ("Content", {"fields": ("description", "short_description", "cover_image", "additional_images")}),
        ("Details", {"fields": ("language", "pages", "edition", "publication_date", "format")}),
        ("Pricing", {"fields": ("original_price", "sale_price", "currency")}),
        ("Inventory", {"fields": ("stock",)}),
        ("Flags", {"fields": ("is_active", "is_featured", "is_bestseller", "is_new_arrival")}),
        ("Analytics", {"fields": ("view_count", "sale_count")}),
        ("SEO", {"fields": ("meta_title", "meta_description")}),
    )
