"""Signals for the accounts app."""
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

from services.email_service import send_welcome_email

from .models import CustomUser


@receiver(post_save, sender=CustomUser)
def handle_user_created(sender, instance, created, **kwargs):
    """Send a welcome email when a new (non-superuser) user registers."""
    if created and not instance.is_superuser:
        try:
            send_welcome_email(instance)
        except Exception:  # pragma: no cover - email failures shouldn't block signup
            pass
