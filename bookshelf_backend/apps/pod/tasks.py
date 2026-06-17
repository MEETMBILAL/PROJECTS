"""Celery tasks for the POD app."""
from celery import shared_task


@shared_task(name="pod.process_file")
def process_pod_file_task(pod_order_id: int) -> str:
    """Placeholder file-processing pipeline (validation, page count, proofing)."""
    from apps.pod.models import PODOrder

    order = PODOrder.objects.filter(id=pod_order_id).first()
    if not order:
        return f"POD order {pod_order_id} not found."
    if order.status == PODOrder.Status.SUBMITTED:
        order.status = PODOrder.Status.REVIEWING
        order.save(update_fields=["status", "updated_at"])
    return f"Processed POD order {order.id}."


@shared_task(name="pod.send_received_email")
def send_pod_received_email_task(pod_order_id: int) -> str:
    from apps.pod.models import PODOrder
    from services.email_service import send_pod_order_received_email

    order = PODOrder.objects.filter(id=pod_order_id).select_related("user").first()
    if not order:
        return f"POD order {pod_order_id} not found."
    send_pod_order_received_email(order)
    return f"POD email sent for order {order.id}."
