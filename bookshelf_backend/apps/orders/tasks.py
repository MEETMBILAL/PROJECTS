"""Celery tasks for the orders app."""
from celery import shared_task


@shared_task(name="orders.send_order_confirmation")
def send_order_confirmation_task(order_id: int) -> str:
    """Send the order confirmation email asynchronously."""
    from apps.orders.models import Order
    from services.email_service import send_order_confirmation_email

    order = Order.objects.filter(id=order_id).select_related("user").first()
    if not order:
        return f"Order {order_id} not found."
    send_order_confirmation_email(order)
    return f"Confirmation sent for {order.order_number}."


@shared_task(name="orders.send_order_shipped")
def send_order_shipped_task(order_id: int, tracking_number: str = "") -> str:
    from apps.orders.models import Order
    from services.email_service import send_order_shipped_email

    order = Order.objects.filter(id=order_id).select_related("user").first()
    if not order:
        return f"Order {order_id} not found."
    send_order_shipped_email(order, tracking_number)
    return f"Shipping notice sent for {order.order_number}."
