from rest_framework.renderers import JSONRenderer


class ApiJSONRenderer(JSONRenderer):
    """Render responses in a consistent envelope.

    Responses already shaped like ``{"success": ..., "data": ...}`` (for
    example, paginated responses or error responses) are passed through
    unchanged. Everything else is wrapped automatically.
    """

    def render(self, data, accepted_media_type=None, renderer_context=None):
        renderer_context = renderer_context or {}
        response = renderer_context.get("response")
        status_code = getattr(response, "status_code", 200)

        if isinstance(data, dict) and "success" in data and (
            "data" in data or "errors" in data
        ):
            payload = data
        elif status_code >= 400:
            payload = {
                "success": False,
                "message": "Request failed",
                "errors": data,
                "data": None,
            }
        else:
            payload = {
                "success": True,
                "message": "Request successful",
                "errors": None,
                "data": data,
            }

        return super().render(payload, accepted_media_type, renderer_context)
