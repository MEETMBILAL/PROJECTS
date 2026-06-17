"""Development overrides."""
from .base import *  # noqa: F401,F403

DEBUG = True

INTERNAL_IPS = ["127.0.0.1"]

# Run Celery tasks synchronously in development unless a broker is available.
CELERY_TASK_ALWAYS_EAGER = config("CELERY_TASK_ALWAYS_EAGER", default=True, cast=bool)  # noqa: F405

# Allow all origins in development for convenience.
CORS_ALLOW_ALL_ORIGINS = True
