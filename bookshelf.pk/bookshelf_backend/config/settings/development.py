"""Development settings overrides."""
from .base import *  # noqa: F401,F403

DEBUG = True

ALLOWED_HOSTS = ["*"]

# Run Celery tasks synchronously during development unless a broker is wired up.
CELERY_TASK_ALWAYS_EAGER = config(  # noqa: F405
    "CELERY_TASK_ALWAYS_EAGER", default=True, cast=bool
)

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# Allow every origin during local development for convenience.
CORS_ALLOW_ALL_ORIGINS = True
