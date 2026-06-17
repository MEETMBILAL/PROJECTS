"""Reusable DRF permission classes."""
from __future__ import annotations

from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """Object-level permission allowing owners to edit their own objects.

    Read access is granted to any request; write access requires the
    requesting user to match the object's ``user`` attribute.
    """

    owner_field = "user"

    def has_object_permission(self, request, view, obj) -> bool:
        if request.method in permissions.SAFE_METHODS:
            return True
        owner = getattr(obj, self.owner_field, None)
        return owner == request.user


class IsAdminOrReadOnly(permissions.BasePermission):
    """Allow read-only access to everyone, writes to staff users only."""

    def has_permission(self, request, view) -> bool:
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)
