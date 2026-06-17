"""Admin registration for the POD app."""
from django.contrib import admin

from .models import PODOrder, PODSpecification


@admin.register(PODSpecification)
class PODSpecificationAdmin(admin.ModelAdmin):
    list_display = [
        "name",
        "paper_size",
        "binding",
        "cover_type",
        "color_mode",
        "price_per_page",
        "setup_fee",
        "is_active",
    ]
    list_filter = ["paper_size", "binding", "color_mode", "is_active"]
    search_fields = ["name"]


@admin.register(PODOrder)
class PODOrderAdmin(admin.ModelAdmin):
    list_display = ["title", "user", "specification", "page_count", "copies", "status", "total_price"]
    list_filter = ["status", "specification"]
    search_fields = ["title", "user__email"]
    list_editable = ["status"]
    readonly_fields = ["total_price", "created_at", "updated_at"]
