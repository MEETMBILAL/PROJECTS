"""Admin registrations for inventory."""
from django.contrib import admin

from .models import StockItem, StockMovement


@admin.register(StockItem)
class StockItemAdmin(admin.ModelAdmin):
    list_display = ("book", "quantity", "low_stock_threshold", "warehouse", "is_low")
    search_fields = ("book__title",)
    list_filter = ("warehouse",)


@admin.register(StockMovement)
class StockMovementAdmin(admin.ModelAdmin):
    list_display = ("book", "movement_type", "quantity", "reference", "created_at")
    list_filter = ("movement_type",)
    search_fields = ("book__title", "reference")
