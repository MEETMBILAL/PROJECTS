"""Signal handlers for the accounts app."""
from __future__ import annotations

from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.orders.tasks import send_welcome_email


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def send_welcome_on_register(sender, instance, created, **kwargs) -> None:
    """Send a welcome email asynchronously when a new user is created."""
    if created and instance.email:
        send_welcome_email.delay(instance.pk)
