"""Populate the database with realistic demo data for Bookshelf.pk."""
from __future__ import annotations

import random
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from apps.catalogue.models import Author, Book, Category, Publisher, Tag
from apps.pod.models import PODSpecification
from apps.promotions.models import Coupon

User = get_user_model()

CATEGORIES = [
    ("Non-Fiction", "book-open"),
    ("Business", "briefcase"),
    ("Self-Help", "sparkles"),
    ("Fiction", "feather"),
    ("Academic", "graduation-cap"),
    ("Children", "baby"),
]

AUTHORS = [
    "James Clear",
    "Morgan Housel",
    "Yuval Noah Harari",
    "Robin Sharma",
    "Stephen Covey",
    "Mohsin Hamid",
    "Kamila Shamsie",
    "Napoleon Hill",
]

BOOK_TITLES = [
    "Atomic Habits",
    "The Psychology of Money",
    "Sapiens: A Brief History of Humankind",
    "The 5 AM Club",
    "The 7 Habits of Highly Effective People",
    "Exit West",
    "Home Fire",
    "Think and Grow Rich",
    "Deep Work",
    "The Lean Startup",
    "Rich Dad Poor Dad",
    "Ikigai",
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
            Publisher.objects.all().delete()
            self.stdout.write(self.style.WARNING("Existing data flushed."))

        categories = [
            Category.objects.get_or_create(
                name=name, defaults={"icon": icon, "order": i}
            )[0]
            for i, (name, icon) in enumerate(CATEGORIES)
        ]
        authors = [
            Author.objects.get_or_create(name=name)[0] for name in AUTHORS
        ]
        publisher, _ = Publisher.objects.get_or_create(
            name="Bookshelf Press"
        )
        tags = [
            Tag.objects.get_or_create(name=name)[0]
            for name in ["Trending", "Award Winning", "Staff Pick"]
        ]

        created = 0
        for i, title in enumerate(BOOK_TITLES):
            original = Decimal(random.choice([1200, 1500, 1800, 2200, 2500]))
            on_sale = random.random() > 0.5
            sale = (
                (original - Decimal(random.choice([200, 300, 500])))
                if on_sale
                else None
            )
            book, was_created = Book.objects.get_or_create(
                title=title,
                defaults={
                    "description": (
                        f"{title} is one of the most loved titles at "
                        "Bookshelf.pk. A must-read packed with insight."
                    ),
                    "short_description": f"A bestselling pick: {title}.",
                    "cover_image": f"https://placehold.co/400x600?text={i+1}",
                    "original_price": original,
                    "sale_price": sale,
                    "sku": f"BK-{i+1:05d}",
                    "stock": random.randint(5, 60),
                    "category": random.choice(categories),
                    "publisher": publisher,
                    "is_featured": i % 3 == 0,
                    "is_bestseller": i % 4 == 0,
                    "is_new_arrival": i % 2 == 0,
                    "pages": random.randint(180, 480),
                },
            )
            if was_created:
                book.authors.add(random.choice(authors))
                book.tags.add(random.choice(tags))
                created += 1

        PODSpecification.objects.get_or_create(
            name="A4 Black & White Perfect Bound",
            defaults={
                "paper_size": "A4",
                "color_mode": "BW",
                "binding": "Perfect",
                "price_per_page": Decimal("6.00"),
                "setup_fee": Decimal("250.00"),
            },
        )
        PODSpecification.objects.get_or_create(
            name="A5 Color Spiral",
            defaults={
                "paper_size": "A5",
                "color_mode": "Color",
                "binding": "Spiral",
                "price_per_page": Decimal("18.00"),
                "setup_fee": Decimal("350.00"),
            },
        )

        Coupon.objects.get_or_create(
            code="WELCOME10",
            defaults={
                "description": "10% off your first order",
                "discount_type": Coupon.DiscountType.PERCENTAGE,
                "value": Decimal("10"),
                "min_order_amount": Decimal("1000"),
            },
        )

        if not User.objects.filter(email="admin@bookshelf.pk").exists():
            User.objects.create_superuser(
                email="admin@bookshelf.pk",
                username="admin",
                password="admin12345",
                full_name="Site Admin",
            )
            self.stdout.write(
                self.style.SUCCESS(
                    "Created superuser admin@bookshelf.pk / admin12345"
                )
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"Seeding complete. {created} new books created."
            )
        )
