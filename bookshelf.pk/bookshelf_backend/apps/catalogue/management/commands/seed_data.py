"""Seed the database with realistic demo data for development."""
from __future__ import annotations

import random
from datetime import timedelta
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
    ("Academic", "graduation-cap"),
    ("Children", "baby"),
]

BOOKS = [
    ("Atomic Habits", "James Clear", "Self-Help", 2499, 1799),
    ("The Psychology of Money", "Morgan Housel", "Business", 1999, 1499),
    ("Rich Dad Poor Dad", "Robert Kiyosaki", "Business", 1799, None),
    ("Deep Work", "Cal Newport", "Self-Help", 2199, 1699),
    ("Sapiens", "Yuval Noah Harari", "Non-Fiction", 2999, 2299),
    ("The Alchemist", "Paulo Coelho", "Fiction", 1499, 999),
    ("Thinking, Fast and Slow", "Daniel Kahneman", "Non-Fiction", 2799, None),
    ("Zero to One", "Peter Thiel", "Business", 1899, 1399),
    ("Ikigai", "Hector Garcia", "Self-Help", 1599, 1199),
    ("Educated", "Tara Westover", "Non-Fiction", 2299, None),
    ("The Lean Startup", "Eric Ries", "Business", 2099, 1599),
    ("Man's Search for Meaning", "Viktor Frankl", "Self-Help", 1399, 1099),
    ("1984", "George Orwell", "Fiction", 1299, None),
    ("Calculus: Early Transcendentals", "James Stewart", "Academic", 4999, 3999),
    ("The Subtle Art of Not Giving a F*ck", "Mark Manson", "Self-Help", 1799, 1299),
    ("Harry Potter and the Sorcerer's Stone", "J.K. Rowling", "Children", 1999, 1599),
]


class Command(BaseCommand):
    help = "Seed the database with demo categories, authors and books."

    def add_arguments(self, parser):
        parser.add_argument(
            "--flush",
            action="store_true",
            help="Delete existing catalogue data before seeding.",
        )

    def handle(self, *args, **options):
        if options["flush"]:
            Book.objects.all().delete()
            Category.objects.all().delete()
            Author.objects.all().delete()
            self.stdout.write(self.style.WARNING("Flushed existing catalogue data."))

        categories: dict[str, Category] = {}
        for name, icon in CATEGORIES:
            cat, _ = Category.objects.get_or_create(
                name=name, defaults={"icon": icon, "is_active": True}
            )
            categories[name] = cat

        publisher, _ = Publisher.objects.get_or_create(name="Bookshelf Press")
        tags = [
            Tag.objects.get_or_create(name=t)[0]
            for t in ["bestseller", "editor-pick", "trending", "classic"]
        ]

        cover = "https://picsum.photos/seed/{seed}/400/600"
        created = 0
        for idx, (title, author_name, cat_name, price, sale) in enumerate(BOOKS):
            author, _ = Author.objects.get_or_create(name=author_name)
            book, was_created = Book.objects.get_or_create(
                sku=f"BS-{idx:04d}",
                defaults={
                    "title": title,
                    "description": (
                        f"{title} by {author_name} is a celebrated title available "
                        "now at Bookshelf.pk. Fast nationwide delivery across Pakistan."
                    ),
                    "short_description": f"{title} — a must-read by {author_name}.",
                    "cover_image": cover.format(seed=idx + 1),
                    "category": categories[cat_name],
                    "publisher": publisher,
                    "original_price": Decimal(str(price)),
                    "sale_price": Decimal(str(sale)) if sale else None,
                    "stock": random.randint(8, 60),
                    "pages": random.randint(180, 540),
                    "language": "English",
                    "is_active": True,
                    "is_featured": idx % 3 == 0,
                    "is_bestseller": idx % 4 == 0,
                    "is_new_arrival": idx % 5 == 0,
                    "average_rating": Decimal(str(round(random.uniform(3.8, 5.0), 2))),
                    "review_count": random.randint(5, 250),
                },
            )
            if was_created:
                book.authors.add(author)
                book.tags.add(random.choice(tags))
                created += 1

        PODSpecification.objects.get_or_create(
            name="A4 B/W Perfect Bound",
            defaults={
                "paper_size": "A4",
                "binding": "Perfect",
                "cover_type": "Softcover",
                "color_mode": "BW",
                "price_per_page": Decimal("4.00"),
                "setup_fee": Decimal("250.00"),
                "max_pages": 800,
            },
        )
        PODSpecification.objects.get_or_create(
            name="A5 Color Spiral",
            defaults={
                "paper_size": "A5",
                "binding": "Spiral",
                "cover_type": "Softcover",
                "color_mode": "Color",
                "price_per_page": Decimal("12.00"),
                "setup_fee": Decimal("150.00"),
                "max_pages": 400,
            },
        )

        Coupon.objects.get_or_create(
            code="WELCOME10",
            defaults={
                "description": "10% off your first order",
                "discount_type": Coupon.DiscountType.PERCENTAGE,
                "value": Decimal("10.00"),
                "min_order_amount": Decimal("1000.00"),
                "valid_until": timezone.now() + timedelta(days=90),
            },
        )

        Banner.objects.get_or_create(
            title="Pakistan's Most Trusted Bookstore",
            defaults={
                "subtitle": "Free delivery on orders over PKR 3,000",
                "image": "https://picsum.photos/seed/hero/1200/600",
                "placement": Banner.Placement.HERO,
            },
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"Seed complete: {created} new books, "
                f"{len(categories)} categories."
            )
        )
