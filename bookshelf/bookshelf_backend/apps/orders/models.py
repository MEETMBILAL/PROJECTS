"""Cart and Order models."""
from __future__ import annotations

from decimal import Decimal

from django.conf import settings
from django.db import models

from apps.catalogue.models import Book
from core.models import TimeStampedModel
from core.utils import generate_reference


class Cart(TimeStampedModel):
    """A shopping cart owned by a user or an anonymous session."""

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="cart",
    )
    session_id = models.CharField(
        max_length=100, null=True, blank=True, db_index=True
    )

    def __str__(self) -> str:
        owner = self.user.email if self.user else self.session_id
        return f"Cart({owner})"

    @property
    def subtotal(self) -> Decimal:
        return sum(
            (item.total_price for item in self.items.all()), Decimal("0")
        )

    @property
    def total_items(self) -> int:
        return sum(item.quantity for item in self.items.all())


class CartItem(TimeStampedModel):
    cart = models.ForeignKey(
        Cart, on_delete=models.CASCADE, related_name="items"
    )
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ("cart", "book")
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return f"{self.quantity} x {self.book.title}"

    @property
    def unit_price(self) -> Decimal:
        return self.book.effective_price

    @property
    def total_price(self) -> Decimal:
        return self.unit_price * self.quantity


class Order(TimeStampedModel):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        CONFIRMED = "confirmed", "Confirmed"
        PROCESSING = "processing", "Processing"
        SHIPPED = "shipped", "Shipped"
        DELIVERED = "delivered", "Delivered"
        CANCELLED = "cancelled", "Cancelled"
        REFUNDED = "refunded", "Refunded"

    class PaymentMethod(models.TextChoices):
        COD = "cod", "Cash on Delivery"
        STRIPE = "stripe", "Stripe"
        JAZZCASH = "jazzcash", "JazzCash"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="orders",
    )
    order_number = models.CharField(max_length=20, unique=True, blank=True)
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.PENDING
    )
    payment_method = models.CharField(
        max_length=20,
        choices=PaymentMethod.choices,
        default=PaymentMethod.COD,
    )
    is_paid = models.BooleanField(default=False)

    shipping_address = models.JSONField()
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=20, blank=True)

    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_fee = models.DecimalField(
        max_digits=10, decimal_places=2, default=Decimal("0")
    )
    discount = models.DecimalField(
        max_digits=10, decimal_places=2, default=Decimal("0")
    )
    total = models.DecimalField(max_digits=10, decimal_places=2)
    coupon_code = models.CharField(max_length=50, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return self.order_number

    def save(self, *args, **kwargs):
        if not self.order_number:
            self.order_number = generate_reference(prefix="ORD", length=8)
        super().save(*args, **kwargs)


class OrderItem(TimeStampedModel):
    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, related_name="items"
    )
    book = models.ForeignKey(Book, on_delete=models.SET_NULL, null=True)
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    title_snapshot = models.CharField(max_length=400)
    cover_snapshot = models.URLField(blank=True)

    def __str__(self) -> str:
        return f"{self.quantity} x {self.title_snapshot}"
