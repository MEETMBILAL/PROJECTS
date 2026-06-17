"""Celery tasks for POD file processing."""
from __future__ import annotations

from celery import shared_task

from services.email_service import send_html_email


@shared_task(name="pod.process_pod_order")
def process_pod_order(pod_order_id: int) -> None:
    """Move a submitted POD order into the reviewing stage and notify the user.

    In a real deployment this is where the uploaded PDF would be validated
    (page count, bleed, DPI) before being queued for printing.
    """
    from .models import PODOrder

    order = (
        PODOrder.objects.filter(pk=pod_order_id)
        .select_related("user", "specification")
        .first()
    )
    if not order:
        return

    order.status = PODOrder.Status.REVIEWING
    order.save(update_fields=["status", "updated_at"])

    send_html_email(
        subject=f"We received your POD order: {order.title}",
        template="emails/pod_order_received.html",
        context={"order": order},
        to=[order.user.email],
    )
