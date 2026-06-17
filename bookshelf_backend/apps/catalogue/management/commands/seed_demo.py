"""Seed the database with demo catalogue, POD and promotion data."""
from decimal import Decimal

from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.catalogue.models import Author, Book, Category, Publisher, Tag
from apps.pod.models import PODSpecification
from apps.promotions.models import Banner, Coupon

CATEGORIES = [
    ("Non-Fiction", "book-open"),
    ("Business", "briefcase"),
    ("Self-Help", "sparkles"),
    ("Fiction", "feather"),
    ("Academic & Course Books", "graduation-cap"),
    ("Children", "baby"),
]

BOOKS = [
    ("Atomic Habits", "James Clear", "Self-Help", "2499.00", "1999.00", True, True, False),
    ("The Forty Rules of Love", "Elif Shafak", "Fiction", "1800.00", "1399.00", True, False, True),
    ("Rich Dad Poor Dad", "Robert Kiyosaki", "Business", "1600.00", None, False, True, False),
    ("Sapiens", "Yuval Noah Harari", "Non-Fiction", "2999.00", "2499.00", True, True, False),
    ("The Alchemist", "Paulo Coelho", "Fiction", "1500.00", "1199.00", False, True, True),
    ("Deep Work", "Cal Newport", "Self-Help", "2200.00", None, True, False, True),
    ("Thinking, Fast and Slow", "Daniel Kahneman", "Non-Fiction", "2800.00", "2299.00", False, True, False),
    ("Zero to One", "Peter Thiel", "Business", "1900.00", "1599.00", True, False, True),
]


class Command(BaseCommand):
    help = "Seed demo data for Bookshelf.pk"

    def handle(self, *args, **options):
        publisher, _ = Publisher.objects.get_or_create(name="Bookshelf Press")
        bestseller_tag, _ = Tag.objects.get_or_create(name="Bestseller")

        category_map = {}
        for name, icon in CATEGORIES:
            category, _ = Category.objects.get_or_create(name=name, defaults={"icon": icon})
            category_map[name] = category

        for idx, (title, author_name, cat, price, sale, featured, bestseller, new) in enumerate(BOOKS):
            author, _ = Author.objects.get_or_create(name=author_name)
            book, created = Book.objects.get_or_create(
                sku=f"DEMO-{idx:04d}",
                defaults={
                    "title": title,
                    "description": f"{title} by {author_name}. A must-read title available now at Bookshelf.pk.",
                    "short_description": f"{title} — by {author_name}",
                    "category": category_map[cat],
                    "publisher": publisher,
                    "original_price": Decimal(price),
                    "sale_price": Decimal(sale) if sale else None,
                    "stock": 50,
                    "cover_image": f"https://placehold.co/400x600/2C4A3E/FAFAF8?text={title.replace(' ', '+')}",
                    "is_featured": featured,
                    "is_bestseller": bestseller,
                    "is_new_arrival": new,
                    "pages": 320,
                    "language": "English",
                },
            )
            if created:
                book.authors.add(author)
                if bestseller:
                    book.tags.add(bestseller_tag)

        PODSpecification.objects.get_or_create(
            name="A4 Black & White Softcover",
            defaults={
                "paper_size": "A4",
                "binding": "Perfect",
                "cover_type": "Softcover",
                "color_mode": "BW",
                "price_per_page": Decimal("4.00"),
                "setup_fee": Decimal("150.00"),
            },
        )
        PODSpecification.objects.get_or_create(
            name="A5 Color Hardcover",
            defaults={
                "paper_size": "A5",
                "binding": "Perfect",
                "cover_type": "Hardcover",
                "color_mode": "Color",
                "price_per_page": Decimal("12.00"),
                "setup_fee": Decimal("500.00"),
            },
        )

        Coupon.objects.get_or_create(
            code="WELCOME10",
            defaults={
                "description": "10% off your first order",
                "discount_type": "percentage",
                "discount_value": Decimal("10.00"),
                "valid_until": timezone.now() + timezone.timedelta(days=90),
            },
        )

        Banner.objects.get_or_create(
            title="Pakistan's Most Trusted Bookstore",
            defaults={
                "subtitle": "Thousands of titles. Fast delivery nationwide.",
                "image": "https://placehold.co/1200x500/2C4A3E/FAFAF8?text=Bookshelf.pk",
                "cta_text": "Shop Now",
                "link": "/books",
            },
        )

        self.stdout.write(self.style.SUCCESS("Demo data seeded successfully."))
