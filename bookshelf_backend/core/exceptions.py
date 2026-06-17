"""Custom DRF exception handler producing the standard API envelope."""
from django.core.exceptions import PermissionDenied as DjangoPermissionDenied
from django.http import Http404
from rest_framework import exceptions
from rest_framework.response import Response
from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    """Return a consistent error envelope for all DRF exceptions."""
    if isinstance(exc, Http404):
        exc = exceptions.NotFound()
    elif isinstance(exc, DjangoPermissionDenied):
        exc = exceptions.PermissionDenied()

    response = exception_handler(exc, context)

    if response is None:
        # Unhandled exception -> 500
        return Response(
            {
                "success": False,
                "data": None,
                "message": "Internal server error.",
                "errors": {"detail": str(exc)},
            },
            status=500,
        )

    detail = response.data
    message = _build_message(detail)

    response.data = {
        "success": False,
        "data": None,
        "message": message,
        "errors": detail,
    }
    return response


def _build_message(detail):
    if isinstance(detail, dict):
        if "detail" in detail:
            return str(detail["detail"])
        for value in detail.values():
            if isinstance(value, (list, tuple)) and value:
                return str(value[0])
            if isinstance(value, str):
                return value
    if isinstance(detail, list) and detail:
        return str(detail[0])
    return "Request failed."
