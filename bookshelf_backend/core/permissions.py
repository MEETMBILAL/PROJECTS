"""Custom DRF permissions."""
from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """Object-level permission: only owners may edit, everyone may read."""

    owner_field = "user"

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        owner = getattr(obj, getattr(view, "owner_field", self.owner_field), None)
        return owner == request.user


class IsOwner(permissions.BasePermission):
    """Object-level permission limiting access strictly to the owner."""

    owner_field = "user"

    def has_object_permission(self, request, view, obj):
        owner = getattr(obj, getattr(view, "owner_field", self.owner_field), None)
        return bool(request.user and request.user.is_authenticated and owner == request.user)


class IsAdminOrReadOnly(permissions.BasePermission):
    """Read-only for anonymous/regular users, write access for staff."""

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)
