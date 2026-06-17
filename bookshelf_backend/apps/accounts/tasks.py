from celery import shared_task

from services.email_service import EmailService


@shared_task
def send_welcome_email_task(user_id: int) -> None:
    from .models import CustomUser

    try:
        user = CustomUser.objects.get(pk=user_id)
    except CustomUser.DoesNotExist:
        return
    EmailService.send(
        subject="Welcome to Bookshelf.pk",
        template="welcome.html",
        context={"user": user},
        to=[user.email],
    )


@shared_task
def send_password_reset_email_task(user_id: int, reset_url: str) -> None:
    from .models import CustomUser

    try:
        user = CustomUser.objects.get(pk=user_id)
    except CustomUser.DoesNotExist:
        return
    EmailService.send(
        subject="Reset your Bookshelf.pk password",
        template="password_reset.html",
        context={"user": user, "reset_url": reset_url},
        to=[user.email],
    )
