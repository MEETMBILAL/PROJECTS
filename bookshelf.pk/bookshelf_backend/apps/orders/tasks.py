"""Celery tasks for order and account notifications."""
from __future__ import annotations

from celery import shared_task
from django.contrib.auth import get_user_model

from services.email_service import send_html_email


@shared_task(name="orders.send_welcome_email")
def send_welcome_email(user_id: int) -> None:
    """Send a welcome email to a newly registered user."""
    User = get_user_model()
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return
    send_html_email(
        subject="Welcome to Bookshelf!",
        to=[user.email],
        template="welcome",
        context={"user": user, "name": user.get_full_name()},
    )


@shared_task(name="orders.send_order_confirmation")
def send_order_confirmation(order_id: int) -> None:
    """Send an order confirmation email after checkout."""
    from .models import Order

    try:
        order = Order.objects.prefetch_related("items").select_related("user").get(
            pk=order_id
        )
    except Order.DoesNotExist:
        return
    if not order.user or not order.user.email:
        return
    send_html_email(
        subject=f"Order Confirmed — {order.order_number}",
        to=[order.user.email],
        template="order_confirmation",
        context={"order": order, "items": order.items.all()},
    )


@shared_task(name="orders.send_order_shipped")
def send_order_shipped(order_id: int) -> None:
    """Notify the customer that their order has shipped."""
    from .models import Order

    try:
        order = Order.objects.select_related("user").get(pk=order_id)
    except Order.DoesNotExist:
        return
    if not order.user or not order.user.email:
        return
    send_html_email(
        subject=f"Your order {order.order_number} has shipped!",
        to=[order.user.email],
        template="order_shipped",
        context={"order": order},
    )
