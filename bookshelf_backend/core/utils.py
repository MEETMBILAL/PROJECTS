import random
import string
from datetime import datetime

from django.utils.text import slugify


def unique_slugify(instance, value: str, slug_field_name: str = "slug") -> str:
    """Generate a unique slug for ``instance`` based on ``value``."""
    model = instance.__class__
    base_slug = slugify(value)[:380] or "item"
    slug = base_slug
    counter = 1
    queryset = model.objects.all()
    if instance.pk:
        queryset = queryset.exclude(pk=instance.pk)
    while queryset.filter(**{slug_field_name: slug}).exists():
        slug = f"{base_slug}-{counter}"
        counter += 1
    return slug


def generate_order_number(prefix: str = "BS") -> str:
    """Generate a human-friendly, reasonably-unique order number."""
    timestamp = datetime.utcnow().strftime("%y%m%d")
    suffix = "".join(random.choices(string.ascii_uppercase + string.digits, k=5))
    return f"{prefix}-{timestamp}-{suffix}"


def success_response(data=None, message: str = "Request successful") -> dict:
    return {"success": True, "message": message, "errors": None, "data": data}


def error_response(message: str = "Request failed", errors=None) -> dict:
    return {"success": False, "message": message, "errors": errors, "data": None}
