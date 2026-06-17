"""Catalogue models: categories, authors, publishers, tags and books."""
from __future__ import annotations

from decimal import Decimal

from django.db import models

from core.models import TimeStampedModel
from core.utils import unique_slugify


class Category(TimeStampedModel):
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, max_length=220, blank=True)
    parent = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="children",
    )
    description = models.TextField(blank=True)
    image = models.URLField(blank=True)
    icon = models.CharField(max_length=50, blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "name"]
        verbose_name_plural = "categories"

    def __str__(self) -> str:
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = unique_slugify(self, self.name)
        super().save(*args, **kwargs)


class Author(TimeStampedModel):
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, max_length=220, blank=True)
    bio = models.TextField(blank=True)
    photo = models.URLField(blank=True)

    class Meta:
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = unique_slugify(self, self.name)
        super().save(*args, **kwargs)


class Publisher(TimeStampedModel):
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, max_length=220, blank=True)
    website = models.URLField(blank=True)

    class Meta:
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = unique_slugify(self, self.name)
        super().save(*args, **kwargs)


class Tag(TimeStampedModel):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, max_length=120, blank=True)

    class Meta:
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = unique_slugify(self, self.name)
        super().save(*args, **kwargs)


class BookFormat(models.TextChoices):
    PAPERBACK = "paperback", "Paperback"
    HARDCOVER = "hardcover", "Hardcover"
    EBOOK = "ebook", "E-Book"


class Book(TimeStampedModel):
    # Identification
    title = models.CharField(max_length=400)
    slug = models.SlugField(unique=True, max_length=420, blank=True)
    isbn = models.CharField(max_length=20, unique=True, null=True, blank=True)

    # Relations
    authors = models.ManyToManyField(Author, related_name="books")
    publisher = models.ForeignKey(
        Publisher, null=True, blank=True, on_delete=models.SET_NULL, related_name="books"
    )
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, related_name="books"
    )
    tags = models.ManyToManyField(Tag, blank=True, related_name="books")

    # Content
    description = models.TextField()
    short_description = models.CharField(max_length=500, blank=True)
    cover_image = models.URLField()
    additional_images = models.JSONField(default=list, blank=True)

    # Book details
    language = models.CharField(max_length=50, default="English")
    pages = models.PositiveIntegerField(null=True, blank=True)
    edition = models.CharField(max_length=50, blank=True)
    publication_date = models.DateField(null=True, blank=True)
    format = models.CharField(
        max_length=50, choices=BookFormat.choices, default=BookFormat.PAPERBACK
    )

    # Pricing
    original_price = models.DecimalField(max_digits=10, decimal_places=2)
    sale_price = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    currency = models.CharField(max_length=3, default="PKR")

    # Inventory
    stock = models.PositiveIntegerField(default=0)
    sku = models.CharField(max_length=100, unique=True)

    # Status flags
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    is_bestseller = models.BooleanField(default=False)
    is_new_arrival = models.BooleanField(default=False)

    # Analytics
    view_count = models.PositiveIntegerField(default=0)
    sale_count = models.PositiveIntegerField(default=0)

    # Aggregated review data (denormalised for fast reads)
    average_rating = models.DecimalField(
        max_digits=3, decimal_places=2, default=Decimal("0.00")
    )
    review_count = models.PositiveIntegerField(default=0)

    # SEO
    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.CharField(max_length=300, blank=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["slug"]),
            models.Index(fields=["is_active", "is_featured"]),
            models.Index(fields=["is_active", "is_bestseller"]),
            models.Index(fields=["is_active", "is_new_arrival"]),
        ]

    def __str__(self) -> str:
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = unique_slugify(self, self.title)
        super().save(*args, **kwargs)

    @property
    def effective_price(self) -> Decimal:
        return self.sale_price if self.sale_price else self.original_price

    @property
    def is_on_sale(self) -> bool:
        return bool(self.sale_price and self.sale_price < self.original_price)

    @property
    def discount_percentage(self) -> int:
        if self.is_on_sale:
            return int(
                ((self.original_price - self.sale_price) / self.original_price) * 100
            )
        return 0

    @property
    def in_stock(self) -> bool:
        return self.stock > 0

    def recalculate_rating(self) -> None:
        """Recalculate the denormalised rating aggregates from reviews."""
        from django.db.models import Avg, Count

        agg = self.reviews.filter(is_approved=True).aggregate(
            avg=Avg("rating"), total=Count("id")
        )
        self.average_rating = round(agg["avg"] or 0, 2)
        self.review_count = agg["total"] or 0
        self.save(update_fields=["average_rating", "review_count", "updated_at"])
