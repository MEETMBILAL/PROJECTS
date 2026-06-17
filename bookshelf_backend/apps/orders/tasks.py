from celery import shared_task

from services.email_service import EmailService


@shared_task
def send_order_confirmation_email(order_id: int) -> None:
    from .models import Order

    order = (
        Order.objects.filter(pk=order_id).select_related("user").prefetch_related("items").first()
    )
    if not order or not order.user:
        return
    EmailService.send(
        subject=f"Order Confirmation — {order.order_number}",
        template="order_confirmation.html",
        context={"order": order, "items": order.items.all()},
        to=[order.user.email],
    )


@shared_task
def send_order_shipped_email(order_id: int, tracking_number: str = "") -> None:
    from .models import Order

    order = Order.objects.filter(pk=order_id).select_related("user").first()
    if not order or not order.user:
        return
    EmailService.send(
        subject=f"Your order {order.order_number} has shipped",
        template="order_shipped.html",
        context={"order": order, "tracking_number": tracking_number},
        to=[order.user.email],
    )
