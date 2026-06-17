"""Admin registrations for promotions."""
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
        "usage_limit",
        "is_active",
        "valid_to",
    )
    list_filter = ("discount_type", "is_active")
    search_fields = ("code",)


@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ("title", "placement", "order", "is_active")
    list_filter = ("placement", "is_active")
    list_editable = ("order", "is_active")


@admin.register(FlashSale)
class FlashSaleAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "discount_percentage",
        "starts_at",
        "ends_at",
        "is_active",
        "is_live",
    )
    list_filter = ("is_active",)
    filter_horizontal = ("books",)
