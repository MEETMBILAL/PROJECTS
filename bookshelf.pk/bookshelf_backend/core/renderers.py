"""Custom JSON renderer enforcing a consistent API envelope."""
from __future__ import annotations

from typing import Any

from rest_framework.renderers import JSONRenderer


class BookshelfJSONRenderer(JSONRenderer):
    """Wrap every response in a consistent ``{success, data, message, errors}`` envelope.

    Responses that already match the envelope shape are passed through untouched so
    that views/exception handlers can fully control the payload when required.
    """

    def render(self, data: Any, accepted_media_type=None, renderer_context=None) -> bytes:
        renderer_context = renderer_context or {}
        response = renderer_context.get("response")
        status_code = getattr(response, "status_code", 200)
        is_success = 200 <= status_code < 300

        if isinstance(data, dict) and "success" in data and (
            "data" in data or "errors" in data
        ):
            envelope = data
        elif is_success:
            envelope = {
                "success": True,
                "data": data,
                "message": "Operation successful",
                "errors": None,
            }
        else:
            message = "An error occurred"
            errors: Any = data
            if isinstance(data, dict):
                message = str(
                    data.get("detail")
                    or data.get("message")
                    or "Request failed"
                )
            envelope = {
                "success": False,
                "data": None,
                "message": message,
                "errors": errors,
            }

        return super().render(envelope, accepted_media_type, renderer_context)
