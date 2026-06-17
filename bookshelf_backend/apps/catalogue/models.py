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


class Book(TimeStampedModel):
    FORMAT_CHOICES = [
        ("paperback", "Paperback"),
        ("hardcover", "Hardcover"),
        ("ebook", "E-Book"),
    ]

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
        Category, on_delete=models.SET_NULL, null=True, blank=True, related_name="books"
    )
    tags = models.ManyToManyField(Tag, blank=True, related_name="books")

    # Content
    description = models.TextField()
    short_description = models.CharField(max_length=500, blank=True)
    cover_image = models.URLField(blank=True)
    additional_images = models.JSONField(default=list, blank=True)

    # Book Details
    language = models.CharField(max_length=50, default="English")
    pages = models.PositiveIntegerField(null=True, blank=True)
    edition = models.CharField(max_length=50, blank=True)
    publication_date = models.DateField(null=True, blank=True)
    format = models.CharField(max_length=50, choices=FORMAT_CHOICES, default="paperback")

    # Pricing
    original_price = models.DecimalField(max_digits=10, decimal_places=2)
    sale_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    currency = models.CharField(max_length=3, default="PKR")

    # Inventory
    stock = models.PositiveIntegerField(default=0)
    sku = models.CharField(max_length=100, unique=True)

    # Status
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    is_bestseller = models.BooleanField(default=False)
    is_new_arrival = models.BooleanField(default=False)

    # Analytics
    view_count = models.PositiveIntegerField(default=0)
    sale_count = models.PositiveIntegerField(default=0)

    # SEO
    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.CharField(max_length=300, blank=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["slug"]),
            models.Index(fields=["is_active", "is_featured"]),
            models.Index(fields=["is_active", "is_bestseller"]),
        ]

    def __str__(self) -> str:
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = unique_slugify(self, self.title)
        super().save(*args, **kwargs)

    @property
    def effective_price(self):
        return self.sale_price if self.sale_price else self.original_price

    @property
    def discount_percentage(self) -> int:
        if self.sale_price and self.original_price:
            return int(((self.original_price - self.sale_price) / self.original_price) * 100)
        return 0

    @property
    def in_stock(self) -> bool:
        return self.stock > 0

    @property
    def average_rating(self) -> float:
        agg = self.reviews.filter(is_approved=True).aggregate(models.Avg("rating"))
        return round(agg["rating__avg"] or 0, 1)

    @property
    def review_count(self) -> int:
        return self.reviews.filter(is_approved=True).count()
