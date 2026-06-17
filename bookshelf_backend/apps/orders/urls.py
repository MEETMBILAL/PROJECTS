"""Order URLs (mounted under /api/v1/orders/)."""
from django.urls import path

from .views import OrderViewSet

app_name = "orders"

order_list = OrderViewSet.as_view({"get": "list"})
order_create = OrderViewSet.as_view({"post": "create_order"})
order_detail = OrderViewSet.as_view({"get": "retrieve"})
order_cancel = OrderViewSet.as_view({"post": "cancel"})

urlpatterns = [
    path("", order_list, name="order-list"),
    path("create/", order_create, name="order-create"),
    path("<str:order_number>/", order_detail, name="order-detail"),
    path("<str:order_number>/cancel/", order_cancel, name="order-cancel"),
]
