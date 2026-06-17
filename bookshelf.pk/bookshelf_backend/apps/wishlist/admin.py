"""Admin configuration for the wishlist app."""
from __future__ import annotations

from django.contrib import admin

from .models import Wishlist, WishlistItem


class WishlistItemInline(admin.TabularInline):
    model = WishlistItem
    extra = 0
    autocomplete_fields = ("book",)


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ("user", "created_at")
    search_fields = ("user__email",)
    inlines = [WishlistItemInline]
