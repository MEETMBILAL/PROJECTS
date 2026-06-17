"""Shared helper utilities."""
from __future__ import annotations

import secrets
import string

from django.utils.text import slugify as django_slugify


def unique_slugify(instance, value: str, slug_field_name: str = "slug") -> str:
    """Generate a unique slug for ``instance`` based on ``value``.

    Appends an incrementing suffix when collisions are found within the model.
    """
    base_slug = django_slugify(value)[:380] or "item"
    model = instance.__class__
    slug = base_slug
    counter = 1
    queryset = model._default_manager.all()
    if instance.pk:
        queryset = queryset.exclude(pk=instance.pk)
    while queryset.filter(**{slug_field_name: slug}).exists():
        slug = f"{base_slug}-{counter}"
        counter += 1
    return slug


def generate_reference(prefix: str = "", length: int = 8) -> str:
    """Generate a short, human-friendly uppercase reference code."""
    alphabet = string.ascii_uppercase + string.digits
    body = "".join(secrets.choice(alphabet) for _ in range(length))
    return f"{prefix}{body}" if prefix else body


def generate_order_number() -> str:
    """Generate a unique order number, e.g. ``BS-7F3K9QA2``."""
    return generate_reference(prefix="BS-", length=8)


def generate_pod_number() -> str:
    """Generate a unique POD order number, e.g. ``POD-7F3K9QA2``."""
    return generate_reference(prefix="POD-", length=8)
