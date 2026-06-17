"""Custom JSON renderer enforcing a consistent API envelope."""
from rest_framework.renderers import JSONRenderer


class BookshelfJSONRenderer(JSONRenderer):
    """Wrap every response in a consistent ``{success, data, message, errors}``
    envelope.

    If a view already returns that shape (e.g. from the custom exception
    handler), it is passed through unchanged.
    """

    def render(self, data, accepted_media_type=None, renderer_context=None):
        renderer_context = renderer_context or {}
        response = renderer_context.get("response")
        status_code = getattr(response, "status_code", 200)
        is_success = 200 <= status_code < 400

        if isinstance(data, dict) and set(data.keys()) >= {"success", "data"}:
            payload = data
        elif is_success:
            payload = {
                "success": True,
                "data": data,
                "message": "OK",
                "errors": None,
            }
        else:
            payload = {
                "success": False,
                "data": None,
                "message": self._extract_message(data),
                "errors": data,
            }

        return super().render(payload, accepted_media_type, renderer_context)

    @staticmethod
    def _extract_message(data):
        if isinstance(data, dict):
            detail = data.get("detail")
            if detail:
                return str(detail)
            for value in data.values():
                if isinstance(value, (list, tuple)) and value:
                    return str(value[0])
                if isinstance(value, str):
                    return value
        if isinstance(data, list) and data:
            return str(data[0])
        return "An error occurred."
