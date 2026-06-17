"""Admin registrations for payments."""
from django.contrib import admin

from .models import Payment, Transaction


class TransactionInline(admin.TabularInline):
    model = Transaction
    extra = 0
    readonly_fields = ("event_type", "payload", "created_at")


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = (
        "order",
        "gateway",
        "status",
        "amount",
        "currency",
        "created_at",
    )
    list_filter = ("gateway", "status")
    search_fields = ("order__order_number", "reference")
    inlines = [TransactionInline]


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ("payment", "event_type", "created_at")
    search_fields = ("event_type",)
