"""Admin registration for inventory."""
from django.contrib import admin

from .models import StockItem, StockMovement


@admin.register(StockItem)
class StockItemAdmin(admin.ModelAdmin):
    list_display = ["book", "quantity", "low_stock_threshold", "is_low_stock", "warehouse_location"]
    search_fields = ["book__title"]
    raw_id_fields = ["book"]


@admin.register(StockMovement)
class StockMovementAdmin(admin.ModelAdmin):
    list_display = ["book", "movement_type", "quantity", "reference", "created_at"]
    list_filter = ["movement_type"]
    search_fields = ["book__title", "reference"]
    raw_id_fields = ["book", "created_by"]
