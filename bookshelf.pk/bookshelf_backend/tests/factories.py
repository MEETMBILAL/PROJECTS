"""factory_boy factories for tests and seed data."""
from __future__ import annotations

from decimal import Decimal

import factory
from django.contrib.auth import get_user_model

from apps.catalogue.models import Author, Book, Category, Publisher, Tag
from apps.promotions.models import Coupon

User = get_user_model()


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User
        django_get_or_create = ("email",)

    email = factory.Sequence(lambda n: f"user{n}@bookshelf.pk")
    username = factory.Sequence(lambda n: f"user{n}")
    full_name = factory.Faker("name")

    @factory.post_generation
    def password(self, create, extracted, **kwargs):
        self.set_password(extracted or "Testpass123!")
        if create:
            self.save()


class CategoryFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Category
        django_get_or_create = ("name",)

    name = factory.Sequence(lambda n: f"Category {n}")


class AuthorFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Author
        django_get_or_create = ("name",)

    name = factory.Faker("name")


class PublisherFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Publisher
        django_get_or_create = ("name",)

    name = factory.Sequence(lambda n: f"Publisher {n}")


class TagFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Tag
        django_get_or_create = ("name",)

    name = factory.Sequence(lambda n: f"tag-{n}")


class BookFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Book

    title = factory.Sequence(lambda n: f"Test Book {n}")
    description = factory.Faker("paragraph")
    cover_image = "https://example.com/cover.jpg"
    category = factory.SubFactory(CategoryFactory)
    publisher = factory.SubFactory(PublisherFactory)
    original_price = Decimal("1000.00")
    sku = factory.Sequence(lambda n: f"SKU-{n:05d}")
    stock = 25

    @factory.post_generation
    def authors(self, create, extracted, **kwargs):
        if not create:
            return
        if extracted:
            for author in extracted:
                self.authors.add(author)
        else:
            self.authors.add(AuthorFactory())


class CouponFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Coupon
        django_get_or_create = ("code",)

    code = factory.Sequence(lambda n: f"SAVE{n}")
    discount_type = Coupon.DiscountType.PERCENTAGE
    value = Decimal("10.00")
