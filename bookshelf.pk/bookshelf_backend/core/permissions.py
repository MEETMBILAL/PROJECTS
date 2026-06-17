"""Custom DRF permission classes."""
from __future__ import annotations

from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """Object-level permission to only allow owners of an object to edit it."""

    owner_field = "user"

    def has_object_permission(self, request, view, obj) -> bool:
        if request.method in permissions.SAFE_METHODS:
            return True
        owner = getattr(obj, getattr(view, "owner_field", self.owner_field), None)
        return owner == request.user


class IsOwner(permissions.BasePermission):
    """Object-level permission restricting all access to the owner."""

    owner_field = "user"

    def has_object_permission(self, request, view, obj) -> bool:
        owner = getattr(obj, getattr(view, "owner_field", self.owner_field), None)
        return bool(request.user and request.user.is_authenticated and owner == request.user)


class IsAdminOrReadOnly(permissions.BasePermission):
    """Allow read-only access to everyone, write access to staff only."""

    def has_permission(self, request, view) -> bool:
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)
