from celery import shared_task

from services.email_service import EmailService


@shared_task
def process_pod_file(pod_order_id: int) -> None:
    """Validate/queue a POD print job and notify the customer.

    In a production deployment this task would download the uploaded file,
    validate the page count, generate a print-ready PDF and hand it to the
    print partner. Here we move the order to 'reviewing' and email the user.
    """
    from .models import PODOrder

    order = PODOrder.objects.filter(pk=pod_order_id).select_related("user", "specification").first()
    if not order:
        return

    order.status = "reviewing"
    order.save(update_fields=["status", "updated_at"])

    if order.user:
        EmailService.send(
            subject=f"We received your print order: {order.title}",
            template="pod_order_received.html",
            context={"order": order},
            to=[order.user.email],
        )
