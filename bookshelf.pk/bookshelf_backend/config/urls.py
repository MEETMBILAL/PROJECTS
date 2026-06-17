"""Root URL configuration for the bookshelf project."""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path


def health_check(_request):
    """Lightweight health-check endpoint for load balancers / Docker."""
    return JsonResponse({"status": "ok", "service": "bookshelf-api"})


api_v1_patterns = [
    path("", include("apps.accounts.urls")),
    path("", include("apps.catalogue.urls")),
    path("", include("apps.inventory.urls")),
    path("", include("apps.orders.urls")),
    path("", include("apps.reviews.urls")),
    path("", include("apps.wishlist.urls")),
    path("", include("apps.promotions.urls")),
    path("pod/", include("apps.pod.urls")),
    path("payments/", include("apps.payments.urls")),
]

urlpatterns = [
    path("admin/", admin.site.urls),
    path("health/", health_check, name="health"),
    path("api/v1/", include((api_v1_patterns, "api"), namespace="v1")),
    path("api-auth/", include("rest_framework.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
