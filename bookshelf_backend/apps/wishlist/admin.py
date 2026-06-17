"""Admin registration for the wishlist."""
from django.contrib import admin

from .models import WishlistItem


@admin.register(WishlistItem)
class WishlistItemAdmin(admin.ModelAdmin):
    list_display = ["user", "book", "created_at"]
    search_fields = ["user__email", "book__title"]
    raw_id_fields = ["user", "book"]
