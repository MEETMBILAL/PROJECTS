from django.contrib import admin

from .models import Cart, CartItem, Order, OrderItem


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "session_id", "created_at"]
    search_fields = ["user__email", "session_id"]
    inlines = [CartItemInline]


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ["book", "quantity", "unit_price", "total_price", "title_snapshot"]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ["order_number", "user", "status", "total", "created_at"]
    list_filter = ["status", "created_at"]
    search_fields = ["order_number", "user__email"]
    readonly_fields = ["order_number", "subtotal", "shipping_fee", "discount", "total"]
    inlines = [OrderItemInline]
