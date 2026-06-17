"""Admin configuration for the accounts app."""
from __future__ import annotations

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import Address, CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(BaseUserAdmin):
    ordering = ("-date_joined",)
    list_display = ("email", "username", "full_name", "is_staff", "is_active")
    list_filter = ("is_staff", "is_active", "is_superuser")
    search_fields = ("email", "username", "full_name", "phone")
    readonly_fields = ("date_joined", "last_login", "created_at", "updated_at")
    fieldsets = (
        (None, {"fields": ("email", "username", "password")}),
        ("Profile", {"fields": ("full_name", "phone", "avatar")}),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        ("Dates", {"fields": ("date_joined", "last_login")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "username", "password1", "password2"),
            },
        ),
    )


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ("user", "label", "city", "province", "is_default")
    list_filter = ("province", "is_default", "country")
    search_fields = ("user__email", "city", "street")
