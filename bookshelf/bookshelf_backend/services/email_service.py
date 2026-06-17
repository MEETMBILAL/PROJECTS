"""Email composition and delivery helpers."""
from __future__ import annotations

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags


def send_html_email(
    *, subject: str, template: str, context: dict, to: list[str]
) -> None:
    """Render an HTML template and send it with a plain-text fallback.

    Falls back silently if no recipient is provided so background tasks never
    crash on incomplete user records.
    """
    recipients = [addr for addr in to if addr]
    if not recipients:
        return

    html_body = render_to_string(template, context)
    text_body = strip_tags(html_body)
    message = EmailMultiAlternatives(
        subject=subject,
        body=text_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=recipients,
    )
    message.attach_alternative(html_body, "text/html")
    message.send(fail_silently=True)
