"""Production settings overrides."""
from .base import *  # noqa: F401,F403

DEBUG = False

# Security hardening
SECURE_SSL_REDIRECT = config("SECURE_SSL_REDIRECT", default=True, cast=bool)  # noqa: F405
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SECURE_CONTENT_TYPE_NOSNIFF = True

# Disable the browsable API in production.
REST_FRAMEWORK["DEFAULT_RENDERER_CLASSES"] = (  # noqa: F405
    "core.renderers.BookshelfJSONRenderer",
    "rest_framework.renderers.JSONRenderer",
)
