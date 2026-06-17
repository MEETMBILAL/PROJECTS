from django.contrib import admin

from .models import Payment, Transaction


class TransactionInline(admin.TabularInline):
    model = Transaction
    extra = 0
    readonly_fields = ["gateway", "gateway_transaction_id", "is_successful", "created_at"]


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ["order", "method", "status", "amount", "currency", "created_at"]
    list_filter = ["method", "status"]
    search_fields = ["order__order_number", "reference"]
    inlines = [TransactionInline]


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ["payment", "gateway", "gateway_transaction_id", "is_successful", "created_at"]
    list_filter = ["gateway", "is_successful"]
