"""Shared helper functions."""
import random
import string
from datetime import datetime

from django.utils.text import slugify as django_slugify


def unique_slugify(instance, value, slug_field_name="slug", max_length=255):
    """Generate a slug that is unique for the model of ``instance``."""
    base_slug = django_slugify(value)[:max_length].strip("-") or "item"
    slug = base_slug
    model = instance.__class__
    counter = 1
    queryset = model._default_manager.all()
    if instance.pk:
        queryset = queryset.exclude(pk=instance.pk)
    while queryset.filter(**{slug_field_name: slug}).exists():
        suffix = f"-{counter}"
        slug = f"{base_slug[: max_length - len(suffix)]}{suffix}"
        counter += 1
    return slug


def generate_order_number(prefix="BS"):
    """Generate a human-friendly, reasonably unique order number."""
    timestamp = datetime.utcnow().strftime("%y%m%d")
    random_part = "".join(random.choices(string.ascii_uppercase + string.digits, k=5))
    return f"{prefix}{timestamp}{random_part}"


def generate_reference(prefix="REF", length=12):
    """Generate a random alphanumeric reference string."""
    chars = string.ascii_uppercase + string.digits
    return f"{prefix}-" + "".join(random.choices(chars, k=length))
