"""Custom DRF exception handling."""
from __future__ import annotations

from django.core.exceptions import PermissionDenied
from django.http import Http404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler


def bookshelf_exception_handler(exc, context) -> Response | None:
    """Return errors in the standard envelope shape.

    Falls back to DRF's default handler and re-shapes the payload so the
    front-end always receives ``{success, data, message, errors}``.
    """
    if isinstance(exc, Http404):
        exc = exc  # handled by DRF default below
    if isinstance(exc, PermissionDenied):
        exc = exc

    response = exception_handler(exc, context)

    if response is None:
        return None

    detail = response.data
    message = "Request failed"
    if isinstance(detail, dict):
        message = str(detail.get("detail") or "Validation failed")
    elif isinstance(detail, list) and detail:
        message = str(detail[0])

    response.data = {
        "success": False,
        "data": None,
        "message": message,
        "errors": detail,
    }
    return response


class ServiceError(Exception):
    """Raised by the service layer to signal a recoverable business error."""

    def __init__(self, message: str, status_code: int = status.HTTP_400_BAD_REQUEST):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
