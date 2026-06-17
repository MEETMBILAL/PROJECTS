"""Celery application bootstrap.

Importing this module configures the Celery app from Django settings and
autodiscovers ``tasks.py`` modules in every installed app.
"""
import os

from celery import Celery

os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE", "config.settings.development"
)

app = Celery("bookshelf")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()


@app.task(bind=True, ignore_result=True)
def debug_task(self) -> None:
    """Trivial task used to verify the worker is processing messages."""
    print(f"Request: {self.request!r}")
