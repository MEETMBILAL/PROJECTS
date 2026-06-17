"""Admin configuration for the payments app."""
from __future__ import annotations

from django.contrib import admin

from .models import Payment, Transaction


class TransactionInline(admin.TabularInline):
    model = Transaction
    extra = 0
    readonly_fields = ("transaction_id", "status", "amount", "payload")


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ("order", "provider", "status", "amount", "currency", "created_at")
    list_filter = ("provider", "status")
    search_fields = ("order__order_number", "reference")
    inlines = [TransactionInline]


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ("transaction_id", "payment", "status", "amount", "created_at")
    search_fields = ("transaction_id",)
