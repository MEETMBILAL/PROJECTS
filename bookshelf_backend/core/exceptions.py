from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    """Wrap DRF exceptions in the unified API response envelope."""
    response = exception_handler(exc, context)

    if response is not None:
        detail = response.data
        message = "Request failed"
        if isinstance(detail, dict) and "detail" in detail:
            message = str(detail["detail"])
        response.data = {
            "success": False,
            "message": message,
            "errors": detail,
            "data": None,
        }
    return response
