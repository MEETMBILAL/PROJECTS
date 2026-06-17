"""Promotions: coupons, banners and flash sales."""
from __future__ import annotations

from decimal import Decimal

from django.db import models
from django.utils import timezone

from core.models import TimeStampedModel


class Coupon(TimeStampedModel):
    class DiscountType(models.TextChoices):
        PERCENTAGE = "percentage", "Percentage"
        FIXED = "fixed", "Fixed Amount"

    code = models.CharField(max_length=50, unique=True)
    description = models.CharField(max_length=200, blank=True)
    discount_type = models.CharField(
        max_length=20,
        choices=DiscountType.choices,
        default=DiscountType.PERCENTAGE,
    )
    value = models.DecimalField(max_digits=10, decimal_places=2)
    min_order_amount = models.DecimalField(
        max_digits=10, decimal_places=2, default=Decimal("0")
    )
    max_discount = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    usage_limit = models.PositiveIntegerField(null=True, blank=True)
    used_count = models.PositiveIntegerField(default=0)
    valid_from = models.DateTimeField(default=timezone.now)
    valid_to = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self) -> str:
        return self.code

    def is_valid(self, subtotal: Decimal) -> bool:
        now = timezone.now()
        if not self.is_active:
            return False
        if self.valid_from and now < self.valid_from:
            return False
        if self.valid_to and now > self.valid_to:
            return False
        if self.usage_limit and self.used_count >= self.usage_limit:
            return False
        if subtotal < self.min_order_amount:
            return False
        return True

    def discount_amount(self, subtotal: Decimal) -> Decimal:
        if self.discount_type == self.DiscountType.PERCENTAGE:
            discount = subtotal * (self.value / Decimal("100"))
        else:
            discount = self.value
        if self.max_discount:
            discount = min(discount, self.max_discount)
        return min(discount, subtotal).quantize(Decimal("0.01"))


class Banner(TimeStampedModel):
    class Placement(models.TextChoices):
        HERO = "hero", "Hero"
        PROMO = "promo", "Promo Strip"
        SIDEBAR = "sidebar", "Sidebar"

    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=300, blank=True)
    image = models.URLField()
    link = models.CharField(max_length=300, blank=True)
    placement = models.CharField(
        max_length=20, choices=Placement.choices, default=Placement.HERO
    )
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ("order",)

    def __str__(self) -> str:
        return self.title


class FlashSale(TimeStampedModel):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    books = models.ManyToManyField(
        "catalogue.Book", related_name="flash_sales", blank=True
    )
    discount_percentage = models.PositiveSmallIntegerField(default=10)
    starts_at = models.DateTimeField()
    ends_at = models.DateTimeField()
    is_active = models.BooleanField(default=True)

    def __str__(self) -> str:
        return self.name

    @property
    def is_live(self) -> bool:
        now = timezone.now()
        return self.is_active and self.starts_at <= now <= self.ends_at
