"""Admin registration for payments."""
from django.contrib import admin

from .models import Payment, Transaction


class TransactionInline(admin.TabularInline):
    model = Transaction
    extra = 0
    readonly_fields = ["event_type", "raw_payload", "created_at"]
    can_delete = False


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ["reference", "order", "gateway", "amount", "status", "created_at"]
    list_filter = ["gateway", "status"]
    search_fields = ["reference", "order__order_number"]
    readonly_fields = ["reference", "gateway_response", "created_at", "updated_at"]
    inlines = [TransactionInline]


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ["payment", "event_type", "created_at"]
    search_fields = ["payment__reference", "event_type"]
