"""Development settings."""
from .base import *  # noqa: F401,F403
from .base import INSTALLED_APPS, MIDDLEWARE

DEBUG = True
ALLOWED_HOSTS = ["*"]

INSTALLED_APPS += ["debug_toolbar"]
MIDDLEWARE = ["debug_toolbar.middleware.DebugToolbarMiddleware", *MIDDLEWARE]

INTERNAL_IPS = ["127.0.0.1"]

# Run Celery tasks synchronously in development unless a worker is configured.
CELERY_TASK_ALWAYS_EAGER = True

# Allow all CORS origins while developing the frontend.
CORS_ALLOW_ALL_ORIGINS = True
