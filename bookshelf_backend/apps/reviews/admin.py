from django.contrib import admin

from .models import Review


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ["book", "user", "rating", "is_approved", "is_verified_purchase", "created_at"]
    list_filter = ["rating", "is_approved", "is_verified_purchase"]
    search_fields = ["book__title", "user__email", "comment"]
    list_editable = ["is_approved"]
