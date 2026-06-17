from django.contrib import admin

from .models import StockItem, StockMovement


class StockMovementInline(admin.TabularInline):
    model = StockMovement
    extra = 0
    readonly_fields = ["created_at"]


@admin.register(StockItem)
class StockItemAdmin(admin.ModelAdmin):
    list_display = ["book", "quantity", "reorder_level", "needs_reorder", "location"]
    search_fields = ["book__title"]
    inlines = [StockMovementInline]


@admin.register(StockMovement)
class StockMovementAdmin(admin.ModelAdmin):
    list_display = ["stock_item", "movement_type", "quantity", "created_at"]
    list_filter = ["movement_type"]
