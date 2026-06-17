"""Django project configuration package.

Exposes the Celery application so that shared tasks autodiscover correctly
when Django starts.
"""
try:
    from .celery import app as celery_app  # noqa: F401

    __all__ = ("celery_app",)
except Exception:  # pragma: no cover - Celery is optional in some envs
    __all__ = ()
