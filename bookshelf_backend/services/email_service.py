"""Email service layer. All transactional emails are dispatched from here."""
from __future__ import annotations

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags


def _send(subject: str, template: str, context: dict, recipient: str) -> None:
    """Render an HTML template and send it to a single recipient."""
    html_body = render_to_string(template, context)
    text_body = strip_tags(html_body)
    message = EmailMultiAlternatives(
        subject=subject,
        body=text_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[recipient],
    )
    message.attach_alternative(html_body, "text/html")
    message.send(fail_silently=False)


def send_welcome_email(user) -> None:
    """Send a welcome email to a newly registered user."""
    _send(
        subject="Welcome to Bookshelf.pk!",
        template="emails/welcome.html",
        context={"user": user, "frontend_url": settings.FRONTEND_URL},
        recipient=user.email,
    )


def send_password_reset_email(user) -> None:
    """Send a password reset link to the user."""
    from django.contrib.auth.tokens import default_token_generator
    from django.utils.encoding import force_bytes
    from django.utils.http import urlsafe_base64_encode

    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    reset_url = f"{settings.FRONTEND_URL}/reset-password?uid={uid}&token={token}"
    _send(
        subject="Reset your Bookshelf.pk password",
        template="emails/password_reset.html",
        context={"user": user, "reset_url": reset_url},
        recipient=user.email,
    )


def send_order_confirmation_email(order) -> None:
    """Send an order confirmation email."""
    if not order.user or not order.user.email:
        return
    _send(
        subject=f"Order Confirmed - {order.order_number}",
        template="emails/order_confirmation.html",
        context={"order": order, "items": order.items.all(), "frontend_url": settings.FRONTEND_URL},
        recipient=order.user.email,
    )


def send_order_shipped_email(order, tracking_number: str = "") -> None:
    """Send a shipping notification email."""
    if not order.user or not order.user.email:
        return
    _send(
        subject=f"Your order {order.order_number} has shipped!",
        template="emails/order_shipped.html",
        context={"order": order, "tracking_number": tracking_number},
        recipient=order.user.email,
    )


def send_pod_order_received_email(pod_order) -> None:
    """Send a confirmation email for a received POD order."""
    if not pod_order.user or not pod_order.user.email:
        return
    _send(
        subject=f"We received your print order - {pod_order.title}",
        template="emails/pod_order_received.html",
        context={"pod_order": pod_order},
        recipient=pod_order.user.email,
    )
