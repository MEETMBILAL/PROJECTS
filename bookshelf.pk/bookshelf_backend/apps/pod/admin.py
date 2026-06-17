"""Admin configuration for the POD app."""
from __future__ import annotations

from django.contrib import admin

from .models import PODOrder, PODSpecification


@admin.register(PODSpecification)
class PODSpecificationAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "paper_size",
        "binding",
        "color_mode",
        "price_per_page",
        "is_active",
    )
    list_filter = ("paper_size", "color_mode", "binding", "is_active")
    search_fields = ("name",)


@admin.register(PODOrder)
class PODOrderAdmin(admin.ModelAdmin):
    list_display = (
        "pod_number",
        "user",
        "title",
        "page_count",
        "copies",
        "status",
        "total_price",
    )
    list_filter = ("status",)
    search_fields = ("pod_number", "title", "user__email")
    readonly_fields = ("pod_number",)
