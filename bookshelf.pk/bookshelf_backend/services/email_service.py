"""Email composition and sending helpers."""
from __future__ import annotations

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string


def send_html_email(
    *, subject: str, to: list[str], template: str, context: dict
) -> None:
    """Render an HTML email template and send it with a plain-text fallback."""
    html_body = render_to_string(f"emails/{template}.html", context)
    text_body = render_to_string(f"emails/{template}.txt", context)
    message = EmailMultiAlternatives(
        subject=subject,
        body=text_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=to,
    )
    message.attach_alternative(html_body, "text/html")
    message.send(fail_silently=True)
