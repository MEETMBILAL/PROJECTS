"""Admin configuration for the inventory app."""
from __future__ import annotations

from django.contrib import admin

from .models import StockItem, StockMovement


@admin.register(StockItem)
class StockItemAdmin(admin.ModelAdmin):
    list_display = ("book", "location", "reserved", "reorder_level", "needs_reorder")
    search_fields = ("book__title",)

    @admin.display(boolean=True, description="Needs reorder")
    def needs_reorder(self, obj: StockItem) -> bool:
        return obj.needs_reorder


@admin.register(StockMovement)
class StockMovementAdmin(admin.ModelAdmin):
    list_display = ("book", "movement_type", "quantity", "reference", "created_at")
    list_filter = ("movement_type",)
    search_fields = ("book__title", "reference")
