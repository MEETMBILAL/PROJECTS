"""Production overrides.

Hardened defaults: DEBUG off, strict hosts, secure cookies, HSTS, and a real
SMTP email backend. All secrets must be provided via environment variables.
"""
from .base import *  # noqa: F401,F403

DEBUG = False

# Security hardening
SECURE_SSL_REDIRECT = config(  # noqa: F405
    "SECURE_SSL_REDIRECT", default=True, cast=bool
)
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 60 * 60 * 24 * 30  # 30 days
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
X_FRAME_OPTIONS = "DENY"

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"

CELERY_TASK_ALWAYS_EAGER = False

# Production should always use a real database via DATABASE_URL.
if "sqlite3" in DATABASES["default"]["ENGINE"]:  # noqa: F405
    import warnings

    warnings.warn(
        "Running production settings with SQLite. Set DATABASE_URL to a "
        "PostgreSQL connection string.",
        RuntimeWarning,
    )
