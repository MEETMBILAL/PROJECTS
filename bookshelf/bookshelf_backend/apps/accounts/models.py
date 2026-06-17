"""User and address models."""
from __future__ import annotations

from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models

from core.models import TimeStampedModel


class CustomUserManager(BaseUserManager):
    """Manager for the email-based :class:`CustomUser`."""

    use_in_migrations = True

    def _create_user(self, email: str, password: str | None, **extra):
        if not email:
            raise ValueError("Users must have an email address.")
        email = self.normalize_email(email)
        if not extra.get("username"):
            extra["username"] = email.split("@")[0]
        user = self.model(email=email, **extra)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email: str, password: str | None = None, **extra):
        extra.setdefault("is_staff", False)
        extra.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra)

    def create_superuser(self, email: str, password: str, **extra):
        extra.setdefault("is_staff", True)
        extra.setdefault("is_superuser", True)
        if extra.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")
        return self._create_user(email, password, **extra)


class CustomUser(AbstractBaseUser, PermissionsMixin, TimeStampedModel):
    """Email-first custom user model."""

    email = models.EmailField(unique=True)
    username = models.CharField(max_length=50, unique=True)
    full_name = models.CharField(max_length=150, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    avatar = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
        ordering = ("-date_joined",)

    def __str__(self) -> str:
        return self.email

    def get_full_name(self) -> str:
        return self.full_name or self.username

    def get_short_name(self) -> str:
        return self.username


class Address(TimeStampedModel):
    """A shipping / billing address belonging to a user."""

    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="addresses"
    )
    label = models.CharField(max_length=50, default="Home")
    recipient_name = models.CharField(max_length=150, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    street = models.TextField()
    city = models.CharField(max_length=100)
    province = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=100, default="Pakistan")
    is_default = models.BooleanField(default=False)

    class Meta:
        verbose_name_plural = "Addresses"
        ordering = ("-is_default", "-created_at")

    def __str__(self) -> str:
        return f"{self.label} - {self.city}"

    def save(self, *args, **kwargs):
        # Ensure only one default address per user.
        if self.is_default:
            Address.objects.filter(user=self.user, is_default=True).exclude(
                pk=self.pk
            ).update(is_default=False)
        super().save(*args, **kwargs)
