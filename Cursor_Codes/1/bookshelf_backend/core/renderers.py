"""Custom JSON renderer enforcing a consistent API response shape."""
from __future__ import annotations

from rest_framework.renderers import JSONRenderer


class BookshelfJSONRenderer(JSONRenderer):
    """Render every successful response as ``{success, data, message, errors}``.

    Error responses are already formatted by ``custom_exception_handler`` and
    are passed through untouched. Responses that already conform to the
    envelope (i.e. expose a ``success`` key) are also left as-is.
    """

    def render(self, data, accepted_media_type=None, renderer_context=None):
        renderer_context = renderer_context or {}
        response = renderer_context.get("response")
        status_code = getattr(response, "status_code", 200)

        if isinstance(data, dict) and "success" in data:
            payload = data
        elif status_code >= 400:
            payload = {
                "success": False,
                "data": None,
                "message": "Request failed.",
                "errors": data,
            }
        else:
            payload = {
                "success": True,
                "data": data,
                "message": "Operation successful.",
                "errors": None,
            }

        return super().render(payload, accepted_media_type, renderer_context)
