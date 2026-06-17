"""Admin configuration for the orders app."""
from __future__ import annotations

from django.contrib import admin

from .models import Cart, CartItem, Order, OrderItem


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    autocomplete_fields = ("book",)


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "session_id", "total_items", "subtotal")
    search_fields = ("user__email", "session_id")
    inlines = [CartItemInline]


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ("unit_price", "total_price", "title_snapshot")


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "order_number",
        "user",
        "status",
        "payment_method",
        "is_paid",
        "total",
        "created_at",
    )
    list_filter = ("status", "payment_method", "is_paid")
    search_fields = ("order_number", "user__email")
    readonly_fields = ("order_number", "subtotal", "total")
    inlines = [OrderItemInline]
