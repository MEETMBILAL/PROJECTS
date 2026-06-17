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
    """Manager for the email-based :class:`CustomUser` model."""

    use_in_migrations = True

    def _create_user(self, email: str, username: str, password: str | None, **extra):
        if not email:
            raise ValueError("Users must have an email address")
        if not username:
            raise ValueError("Users must have a username")
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, username, password=None, **extra):
        extra.setdefault("is_staff", False)
        extra.setdefault("is_superuser", False)
        return self._create_user(email, username, password, **extra)

    def create_superuser(self, email, username, password=None, **extra):
        extra.setdefault("is_staff", True)
        extra.setdefault("is_superuser", True)
        if extra.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")
        return self._create_user(email, username, password, **extra)


class CustomUser(AbstractBaseUser, PermissionsMixin, TimeStampedModel):
    """Custom user authenticated by email address."""

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
        verbose_name = "user"
        verbose_name_plural = "users"
        ordering = ["-date_joined"]

    def __str__(self) -> str:
        return self.email

    def get_full_name(self) -> str:
        return self.full_name or self.username

    def get_short_name(self) -> str:
        return self.username


class Address(TimeStampedModel):
    """A shipping/billing address belonging to a user."""

    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="addresses"
    )
    label = models.CharField(max_length=50, default="Home")
    recipient_name = models.CharField(max_length=150, blank=True)
    recipient_phone = models.CharField(max_length=20, blank=True)
    street = models.TextField()
    city = models.CharField(max_length=100)
    province = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=100, default="Pakistan")
    is_default = models.BooleanField(default=False)

    class Meta:
        ordering = ["-is_default", "-created_at"]
        verbose_name_plural = "addresses"

    def __str__(self) -> str:
        return f"{self.label} — {self.city} ({self.user.email})"

    def as_snapshot(self) -> dict:
        """Return a serializable snapshot used when placing an order."""
        return {
            "label": self.label,
            "recipient_name": self.recipient_name or self.user.get_full_name(),
            "recipient_phone": self.recipient_phone or self.user.phone,
            "street": self.street,
            "city": self.city,
            "province": self.province,
            "postal_code": self.postal_code,
            "country": self.country,
        }
