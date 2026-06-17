from decimal import Decimal

from django.db import models
from django.utils import timezone

from core.models import TimeStampedModel


class Coupon(TimeStampedModel):
    DISCOUNT_TYPES = [
        ("percentage", "Percentage"),
        ("fixed", "Fixed Amount"),
    ]

    code = models.CharField(max_length=50, unique=True)
    description = models.CharField(max_length=255, blank=True)
    discount_type = models.CharField(max_length=20, choices=DISCOUNT_TYPES, default="percentage")
    discount_value = models.DecimalField(max_digits=10, decimal_places=2)
    min_order_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    max_discount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    usage_limit = models.PositiveIntegerField(null=True, blank=True)
    used_count = models.PositiveIntegerField(default=0)
    valid_from = models.DateTimeField(null=True, blank=True)
    valid_until = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.code

    def is_valid(self, order_amount: Decimal) -> bool:
        now = timezone.now()
        if not self.is_active:
            return False
        if self.valid_from and now < self.valid_from:
            return False
        if self.valid_until and now > self.valid_until:
            return False
        if self.usage_limit is not None and self.used_count >= self.usage_limit:
            return False
        if order_amount < self.min_order_amount:
            return False
        return True

    def calculate_discount(self, order_amount: Decimal) -> Decimal:
        if self.discount_type == "percentage":
            discount = order_amount * (self.discount_value / Decimal("100"))
        else:
            discount = self.discount_value
        if self.max_discount is not None:
            discount = min(discount, self.max_discount)
        return min(discount, order_amount).quantize(Decimal("0.01"))


class Banner(TimeStampedModel):
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=300, blank=True)
    image = models.URLField()
    link = models.CharField(max_length=255, blank=True)
    cta_text = models.CharField(max_length=50, blank=True, default="Shop Now")
    position = models.CharField(max_length=50, default="hero")
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "-created_at"]

    def __str__(self) -> str:
        return self.title


class FlashSale(TimeStampedModel):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    books = models.ManyToManyField("catalogue.Book", related_name="flash_sales", blank=True)
    discount_percentage = models.PositiveIntegerField(default=10)
    starts_at = models.DateTimeField()
    ends_at = models.DateTimeField()
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["-starts_at"]

    def __str__(self) -> str:
        return self.name

    @property
    def is_live(self) -> bool:
        now = timezone.now()
        return self.is_active and self.starts_at <= now <= self.ends_at
