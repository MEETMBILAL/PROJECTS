"""Custom DRF exception handling producing the standard response envelope."""
from __future__ import annotations

from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    """Wrap DRF error responses in the standard ``success/errors`` envelope."""
    response = exception_handler(exc, context)
    if response is None:
        return response

    detail = response.data
    message = "Request failed."
    if isinstance(detail, dict) and "detail" in detail:
        message = str(detail["detail"])

    response.data = {
        "success": False,
        "data": None,
        "message": message,
        "errors": detail,
    }
    return response
