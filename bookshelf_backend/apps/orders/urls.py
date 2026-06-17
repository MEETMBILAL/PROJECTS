from django.urls import path

from .views import (
    CartAddView,
    CartClearView,
    CartRemoveView,
    CartUpdateView,
    CartView,
    OrderCreateView,
    OrderDetailView,
    OrderListView,
    cancel_order,
)

urlpatterns = [
    path("cart/", CartView.as_view(), name="cart"),
    path("cart/add/", CartAddView.as_view(), name="cart-add"),
    path("cart/update/<int:item_id>/", CartUpdateView.as_view(), name="cart-update"),
    path("cart/remove/<int:item_id>/", CartRemoveView.as_view(), name="cart-remove"),
    path("cart/clear/", CartClearView.as_view(), name="cart-clear"),
    path("orders/", OrderListView.as_view(), name="order-list"),
    path("orders/create/", OrderCreateView.as_view(), name="order-create"),
    path("orders/<str:order_number>/", OrderDetailView.as_view(), name="order-detail"),
    path("orders/<str:order_number>/cancel/", cancel_order, name="order-cancel"),
]
