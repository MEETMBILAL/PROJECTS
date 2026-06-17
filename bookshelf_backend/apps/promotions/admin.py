from django.contrib import admin

from .models import Banner, Coupon, FlashSale


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ["code", "discount_type", "discount_value", "is_active", "used_count", "valid_until"]
    list_filter = ["discount_type", "is_active"]
    search_fields = ["code"]


@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ["title", "position", "order", "is_active"]
    list_filter = ["position", "is_active"]


@admin.register(FlashSale)
class FlashSaleAdmin(admin.ModelAdmin):
    list_display = ["name", "discount_percentage", "starts_at", "ends_at", "is_active"]
    list_filter = ["is_active"]
    filter_horizontal = ["books"]
