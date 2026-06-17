from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import CustomUser


@receiver(post_save, sender=CustomUser)
def send_welcome_email(sender, instance, created, **kwargs):
    """Queue a welcome email when a new user registers."""
    if not created:
        return
    # Imported lazily to avoid circular imports during app loading.
    from apps.accounts.tasks import send_welcome_email_task

    send_welcome_email_task.delay(instance.id)
