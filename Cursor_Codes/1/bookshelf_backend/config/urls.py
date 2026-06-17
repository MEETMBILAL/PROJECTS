"""Root URL configuration for the Bookshelf backend."""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path


def health_check(_request):
    """Lightweight liveness probe used by Docker / load balancers."""
    return JsonResponse({"status": "ok", "service": "bookshelf-api"})


api_v1_patterns = [
    path("", include("apps.accounts.urls")),
    path("", include("apps.catalogue.urls")),
    path("", include("apps.inventory.urls")),
    path("", include("apps.orders.urls")),
    path("", include("apps.reviews.urls")),
    path("", include("apps.wishlist.urls")),
    path("", include("apps.pod.urls")),
    path("", include("apps.payments.urls")),
    path("", include("apps.promotions.urls")),
]

urlpatterns = [
    path("admin/", admin.site.urls),
    path("health/", health_check, name="health-check"),
    path("api/v1/", include((api_v1_patterns, "api"), namespace="v1")),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL, document_root=settings.MEDIA_ROOT
    )
