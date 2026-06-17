"""Celery tasks for the orders app (emails, notifications)."""
from __future__ import annotations

from celery import shared_task
from django.contrib.auth import get_user_model

from services.email_service import send_html_email

User = get_user_model()


@shared_task(name="orders.send_order_confirmation_email")
def send_order_confirmation_email(order_id: int) -> None:
    """Send the order-confirmation email for a freshly created order."""
    from .models import Order

    order = (
        Order.objects.filter(pk=order_id)
        .select_related("user")
        .prefetch_related("items")
        .first()
    )
    if not order:
        return
    recipient = order.contact_email or (
        order.user.email if order.user else ""
    )
    send_html_email(
        subject=f"Your Bookshelf order {order.order_number} is confirmed",
        template="emails/order_confirmation.html",
        context={"order": order, "items": order.items.all()},
        to=[recipient],
    )


@shared_task(name="orders.send_order_shipped_email")
def send_order_shipped_email(order_id: int, tracking_number: str = "") -> None:
    from .models import Order

    order = Order.objects.filter(pk=order_id).select_related("user").first()
    if not order:
        return
    recipient = order.contact_email or (
        order.user.email if order.user else ""
    )
    send_html_email(
        subject=f"Your Bookshelf order {order.order_number} has shipped",
        template="emails/order_shipped.html",
        context={"order": order, "tracking_number": tracking_number},
        to=[recipient],
    )


@shared_task(name="orders.send_welcome_email")
def send_welcome_email_task(user_id: int) -> None:
    user = User.objects.filter(pk=user_id).first()
    if not user:
        return
    send_html_email(
        subject="Welcome to Bookshelf.pk",
        template="emails/welcome.html",
        context={"user": user},
        to=[user.email],
    )
