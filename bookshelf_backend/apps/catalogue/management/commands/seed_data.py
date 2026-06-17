"""Seed the database with realistic demo data for Bookshelf.pk."""
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.catalogue.models import Author, Book, Category, Publisher, Tag
from apps.pod.models import PODSpecification
from apps.promotions.models import Banner, Coupon

User = get_user_model()

CATEGORIES = [
    {"name": "Non-Fiction", "icon": "BookOpen"},
    {"name": "Business", "icon": "Briefcase"},
    {"name": "Self-Help", "icon": "Sparkles"},
    {"name": "Fiction", "icon": "Feather"},
    {"name": "Academic Course Books", "icon": "GraduationCap"},
    {"name": "Children", "icon": "Baby"},
]

BOOKS = [
    {
        "title": "Atomic Habits",
        "author": "James Clear",
        "category": "Self-Help",
        "price": "2499.00",
        "sale": "1899.00",
        "desc": "An easy & proven way to build good habits and break bad ones.",
        "featured": True,
        "bestseller": True,
    },
    {
        "title": "Rich Dad Poor Dad",
        "author": "Robert T. Kiyosaki",
        "category": "Business",
        "price": "1999.00",
        "sale": "1499.00",
        "desc": "What the rich teach their kids about money that the poor do not.",
        "bestseller": True,
    },
    {
        "title": "The Psychology of Money",
        "author": "Morgan Housel",
        "category": "Business",
        "price": "2299.00",
        "sale": "1799.00",
        "desc": "Timeless lessons on wealth, greed, and happiness.",
        "featured": True,
        "new": True,
    },
    {
        "title": "Sapiens: A Brief History of Humankind",
        "author": "Yuval Noah Harari",
        "category": "Non-Fiction",
        "price": "2899.00",
        "sale": None,
        "desc": "A brief history of humankind exploring how we conquered the world.",
        "featured": True,
    },
    {
        "title": "The Alchemist",
        "author": "Paulo Coelho",
        "category": "Fiction",
        "price": "1599.00",
        "sale": "1199.00",
        "desc": "A magical fable about following your dream.",
        "bestseller": True,
        "new": True,
    },
    {
        "title": "Deep Work",
        "author": "Cal Newport",
        "category": "Self-Help",
        "price": "2199.00",
        "sale": None,
        "desc": "Rules for focused success in a distracted world.",
        "new": True,
    },
    {
        "title": "Thinking, Fast and Slow",
        "author": "Daniel Kahneman",
        "category": "Non-Fiction",
        "price": "2799.00",
        "sale": "2099.00",
        "desc": "A tour of the mind explaining the two systems that drive thought.",
        "featured": True,
    },
    {
        "title": "Introduction to Algorithms",
        "author": "Thomas H. Cormen",
        "category": "Academic Course Books",
        "price": "5999.00",
        "sale": "4999.00",
        "desc": "The comprehensive textbook on algorithms (CLRS).",
    },
    {
        "title": "The 7 Habits of Highly Effective People",
        "author": "Stephen R. Covey",
        "category": "Self-Help",
        "price": "1899.00",
        "sale": None,
        "desc": "Powerful lessons in personal change.",
        "bestseller": True,
    },
    {
        "title": "Zero to One",
        "author": "Peter Thiel",
        "category": "Business",
        "price": "1999.00",
        "sale": "1599.00",
        "desc": "Notes on startups, or how to build the future.",
        "new": True,
    },
    {
        "title": "1984",
        "author": "George Orwell",
        "category": "Fiction",
        "price": "1399.00",
        "sale": "999.00",
        "desc": "A dystopian social science fiction novel and cautionary tale.",
        "featured": True,
    },
    {
        "title": "The Lean Startup",
        "author": "Eric Ries",
        "category": "Business",
        "price": "2099.00",
        "sale": None,
        "desc": "How constant innovation creates radically successful businesses.",
    },
]

COVER = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80"


class Command(BaseCommand):
    help = "Seed the database with demo books, categories, coupons and POD specs."

    def handle(self, *args, **options):
        self.stdout.write("Seeding categories...")
        category_map = {}
        for idx, data in enumerate(CATEGORIES):
            cat, _ = Category.objects.get_or_create(
                name=data["name"],
                defaults={"icon": data["icon"], "order": idx},
            )
            category_map[data["name"]] = cat

        publisher, _ = Publisher.objects.get_or_create(name="Bookshelf Press")
        tag, _ = Tag.objects.get_or_create(name="popular")

        self.stdout.write("Seeding books...")
        for idx, data in enumerate(BOOKS):
            author, _ = Author.objects.get_or_create(name=data["author"])
            book, created = Book.objects.get_or_create(
                sku=f"BS-{idx:04d}",
                defaults={
                    "title": data["title"],
                    "description": data["desc"],
                    "short_description": data["desc"][:120],
                    "cover_image": COVER,
                    "category": category_map[data["category"]],
                    "publisher": publisher,
                    "original_price": Decimal(data["price"]),
                    "sale_price": Decimal(data["sale"]) if data.get("sale") else None,
                    "stock": 50,
                    "pages": 320,
                    "is_featured": data.get("featured", False),
                    "is_bestseller": data.get("bestseller", False),
                    "is_new_arrival": data.get("new", False),
                },
            )
            if created:
                book.authors.add(author)
                book.tags.add(tag)

        self.stdout.write("Seeding POD specifications...")
        pod_specs = [
            ("A4 Black & White - Perfect Bound", "A4", "Perfect", "Softcover", "BW", "4.50", "250.00"),
            ("A4 Colour - Perfect Bound", "A4", "Perfect", "Softcover", "Color", "18.00", "350.00"),
            ("A5 Black & White - Spiral", "A5", "Spiral", "Softcover", "BW", "3.50", "150.00"),
            ("A4 Colour - Hardcover", "A4", "Perfect", "Hardcover", "Color", "22.00", "800.00"),
        ]
        for name, size, binding, cover, color, ppp, setup in pod_specs:
            PODSpecification.objects.get_or_create(
                name=name,
                defaults={
                    "paper_size": size,
                    "binding": binding,
                    "cover_type": cover,
                    "color_mode": color,
                    "price_per_page": Decimal(ppp),
                    "setup_fee": Decimal(setup),
                },
            )

        self.stdout.write("Seeding coupons...")
        Coupon.objects.get_or_create(
            code="WELCOME10",
            defaults={
                "description": "10% off your first order",
                "discount_type": Coupon.DiscountType.PERCENTAGE,
                "discount_value": Decimal("10.00"),
                "min_order_amount": Decimal("1000.00"),
                "max_discount": Decimal("1000.00"),
            },
        )
        Coupon.objects.get_or_create(
            code="FLAT500",
            defaults={
                "description": "PKR 500 off orders above PKR 3000",
                "discount_type": Coupon.DiscountType.FIXED,
                "discount_value": Decimal("500.00"),
                "min_order_amount": Decimal("3000.00"),
            },
        )

        self.stdout.write("Seeding banners...")
        Banner.objects.get_or_create(
            title="Pakistan's Most Trusted Bookstore",
            defaults={
                "subtitle": "Discover thousands of titles with fast nationwide delivery.",
                "image": COVER,
                "link": "/books",
                "placement": Banner.Placement.HERO,
            },
        )

        if not User.objects.filter(email="admin@bookshelf.pk").exists():
            self.stdout.write("Creating superuser admin@bookshelf.pk / admin12345 ...")
            User.objects.create_superuser(
                email="admin@bookshelf.pk", username="admin", password="admin12345"
            )

        self.stdout.write(self.style.SUCCESS("Seed complete!"))
