"""Helpers to render and send transactional emails."""
from __future__ import annotations

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string


class EmailService:
    """Renders HTML email templates and dispatches them."""

    @staticmethod
    def send(*, subject: str, template: str, context: dict, to: list[str]) -> None:
        html_body = render_to_string(f"emails/{template}", context)
        message = EmailMultiAlternatives(
            subject=subject,
            body=_strip_tags(html_body),
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=to,
        )
        message.attach_alternative(html_body, "text/html")
        message.send(fail_silently=True)


def _strip_tags(html: str) -> str:
    from django.utils.html import strip_tags

    return strip_tags(html)
