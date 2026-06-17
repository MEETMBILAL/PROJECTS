"""Celery tasks for Print-on-Demand processing."""
from __future__ import annotations

from celery import shared_task

from services.email_service import send_html_email


@shared_task(name="pod.process_pod_order")
def process_pod_order(pod_order_id: int) -> None:
    """Stub task representing async POD file validation/processing.

    In production this would validate the uploaded PDF (page count, bleed,
    resolution) and move the order to the ``reviewing`` state.
    """
    from .models import PODOrder

    try:
        order = PODOrder.objects.select_related("user").get(pk=pod_order_id)
    except PODOrder.DoesNotExist:
        return

    if order.status == PODOrder.Status.SUBMITTED:
        order.status = PODOrder.Status.REVIEWING
        order.save(update_fields=["status", "updated_at"])

    if order.user and order.user.email:
        send_html_email(
            subject=f"POD Order Received — {order.pod_number}",
            to=[order.user.email],
            template="pod_order_received",
            context={"order": order},
        )
