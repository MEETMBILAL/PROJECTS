"""Development overrides.

Optimised for local productivity: DEBUG on, permissive CORS, console email,
and Celery running eagerly so no broker is required.
"""
from .base import *  # noqa: F401,F403

DEBUG = True
ALLOWED_HOSTS = ["*"]

CORS_ALLOW_ALL_ORIGINS = True

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

CELERY_TASK_ALWAYS_EAGER = True
CELERY_TASK_EAGER_PROPAGATES = True

# Static manifest storage requires collectstatic; use the simple backend in dev.
STATICFILES_STORAGE = "django.contrib.staticfiles.storage.StaticFilesStorage"
