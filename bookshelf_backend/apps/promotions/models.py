"""Promotion models: Coupon, Banner, FlashSale."""
from decimal import Decimal

from django.db import models
from django.utils import timezone

from apps.catalogue.models import Book
from core.models import TimeStampedModel


class Coupon(TimeStampedModel):
    class DiscountType(models.TextChoices):
        PERCENTAGE = "percentage", "Percentage"
        FIXED = "fixed", "Fixed Amount"

    code = models.CharField(max_length=50, unique=True)
    description = models.CharField(max_length=255, blank=True)
    discount_type = models.CharField(
        max_length=20, choices=DiscountType.choices, default=DiscountType.PERCENTAGE
    )
    discount_value = models.DecimalField(max_digits=10, decimal_places=2)
    min_order_amount = models.DecimalField(
        max_digits=10, decimal_places=2, default=0
    )
    max_discount = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    usage_limit = models.PositiveIntegerField(null=True, blank=True)
    used_count = models.PositiveIntegerField(default=0)
    valid_from = models.DateTimeField(default=timezone.now)
    valid_until = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.code

    def is_valid(self, subtotal: Decimal) -> bool:
        now = timezone.now()
        if not self.is_active:
            return False
        if self.valid_from and now < self.valid_from:
            return False
        if self.valid_until and now > self.valid_until:
            return False
        if self.usage_limit is not None and self.used_count >= self.usage_limit:
            return False
        if subtotal < self.min_order_amount:
            return False
        return True

    def calculate_discount(self, subtotal: Decimal) -> Decimal:
        if self.discount_type == self.DiscountType.PERCENTAGE:
            discount = subtotal * (self.discount_value / Decimal("100"))
        else:
            discount = self.discount_value
        if self.max_discount:
            discount = min(discount, self.max_discount)
        return min(discount, subtotal).quantize(Decimal("0.01"))

    def register_use(self) -> None:
        self.used_count = models.F("used_count") + 1
        self.save(update_fields=["used_count"])
        self.refresh_from_db(fields=["used_count"])


class Banner(TimeStampedModel):
    class Placement(models.TextChoices):
        HERO = "hero", "Hero"
        PROMO = "promo", "Promo Strip"
        SIDEBAR = "sidebar", "Sidebar"

    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=300, blank=True)
    image = models.URLField()
    link = models.CharField(max_length=300, blank=True)
    cta_text = models.CharField(max_length=50, blank=True, default="Shop Now")
    placement = models.CharField(
        max_length=20, choices=Placement.choices, default=Placement.HERO
    )
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "-created_at"]

    def __str__(self):
        return self.title


class FlashSale(TimeStampedModel):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    books = models.ManyToManyField(Book, related_name="flash_sales", blank=True)
    discount_percentage = models.PositiveIntegerField(default=10)
    starts_at = models.DateTimeField()
    ends_at = models.DateTimeField()
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["-starts_at"]

    def __str__(self):
        return self.title

    @property
    def is_live(self) -> bool:
        now = timezone.now()
        return self.is_active and self.starts_at <= now <= self.ends_at
