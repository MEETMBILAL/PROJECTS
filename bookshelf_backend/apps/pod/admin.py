from django.contrib import admin

from .models import PODOrder, PODSpecification


@admin.register(PODSpecification)
class PODSpecificationAdmin(admin.ModelAdmin):
    list_display = ["name", "paper_size", "binding", "color_mode", "price_per_page", "is_active"]
    list_filter = ["paper_size", "color_mode", "binding", "is_active"]


@admin.register(PODOrder)
class PODOrderAdmin(admin.ModelAdmin):
    list_display = ["title", "user", "status", "page_count", "copies", "total_price", "created_at"]
    list_filter = ["status"]
    search_fields = ["title", "user__email"]
    readonly_fields = ["total_price"]
