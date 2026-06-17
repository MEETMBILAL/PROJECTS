"""Root URL configuration for the Bookshelf.pk backend."""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path


def health_check(_request):
    return JsonResponse({"success": True, "message": "Bookshelf.pk API is healthy", "data": {"status": "ok"}})


api_v1 = [
    path("", include("apps.accounts.urls")),
    path("", include("apps.catalogue.urls")),
    path("", include("apps.inventory.urls")),
    path("", include("apps.orders.urls")),
    path("", include("apps.reviews.urls")),
    path("wishlist/", include("apps.wishlist.urls")),
    path("pod/", include("apps.pod.urls")),
    path("payments/", include("apps.payments.urls")),
    path("", include("apps.promotions.urls")),
]

urlpatterns = [
    path("admin/", admin.site.urls),
    path("health/", health_check, name="health-check"),
    path("api/v1/", include((api_v1, "v1"), namespace="v1")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
