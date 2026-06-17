"""Shared helper functions."""
from __future__ import annotations

import secrets
import string

from django.utils.text import slugify as django_slugify


def unique_slugify(instance, value: str, slug_field_name: str = "slug") -> str:
    """Return a slug for ``value`` that is unique within the model table.

    Appends a numeric suffix (``-2``, ``-3`` ...) when a collision is found.
    """
    base_slug = django_slugify(value)[:380] or "item"
    slug = base_slug
    model = instance.__class__
    counter = 2
    queryset = model._default_manager.all()
    if instance.pk:
        queryset = queryset.exclude(pk=instance.pk)
    while queryset.filter(**{slug_field_name: slug}).exists():
        slug = f"{base_slug}-{counter}"
        counter += 1
    return slug


def generate_reference(prefix: str = "BK", length: int = 8) -> str:
    """Generate a human-friendly uppercase reference such as ``BK-7F3K9QA2``."""
    alphabet = string.ascii_uppercase + string.digits
    suffix = "".join(secrets.choice(alphabet) for _ in range(length))
    return f"{prefix}-{suffix}"


def success_response(data=None, message: str = "Operation successful.") -> dict:
    """Build the standard success envelope (handy in non-DRF contexts)."""
    return {
        "success": True,
        "data": data,
        "message": message,
        "errors": None,
    }
