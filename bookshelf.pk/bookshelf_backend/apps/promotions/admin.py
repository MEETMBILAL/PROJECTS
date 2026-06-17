"""Admin configuration for the promotions app."""
from __future__ import annotations

from django.contrib import admin

from .models import Banner, Coupon, FlashSale


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = (
        "code",
        "discount_type",
        "value",
        "min_order_amount",
        "used_count",
        "is_active",
        "valid_until",
    )
    list_filter = ("discount_type", "is_active")
    search_fields = ("code",)


@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ("title", "placement", "order", "is_active")
    list_filter = ("placement", "is_active")
    search_fields = ("title",)


@admin.register(FlashSale)
class FlashSaleAdmin(admin.ModelAdmin):
    list_display = ("name", "discount_percentage", "starts_at", "ends_at", "is_active")
    list_filter = ("is_active",)
    search_fields = ("name",)
    filter_horizontal = ("books",)
