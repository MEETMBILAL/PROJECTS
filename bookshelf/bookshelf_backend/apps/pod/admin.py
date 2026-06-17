"""Admin registrations for POD."""
from django.contrib import admin

from .models import PODFile, PODOrder, PODSpecification


@admin.register(PODSpecification)
class PODSpecificationAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "paper_size",
        "color_mode",
        "binding",
        "price_per_page",
        "setup_fee",
        "is_active",
    )
    list_filter = ("paper_size", "color_mode", "binding", "is_active")
    search_fields = ("name",)


class PODFileInline(admin.TabularInline):
    model = PODFile
    extra = 0


@admin.register(PODOrder)
class PODOrderAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "user",
        "status",
        "page_count",
        "copies",
        "total_price",
        "created_at",
    )
    list_filter = ("status",)
    search_fields = ("title", "user__email")
    list_editable = ("status",)
    inlines = [PODFileInline]
