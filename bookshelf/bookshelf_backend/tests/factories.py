"""factory_boy factories for tests and seeding."""
from __future__ import annotations

from decimal import Decimal

import factory
from django.contrib.auth import get_user_model

from apps.catalogue.models import Author, Book, Category, Publisher
from apps.pod.models import PODSpecification

User = get_user_model()


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    email = factory.Sequence(lambda n: f"user{n}@example.com")
    username = factory.Sequence(lambda n: f"user{n}")
    full_name = factory.Faker("name")

    @factory.post_generation
    def password(obj, create, extracted, **kwargs):
        obj.set_password(extracted or "password123")
        if create:
            obj.save()


class CategoryFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Category

    name = factory.Sequence(lambda n: f"Category {n}")


class AuthorFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Author

    name = factory.Faker("name")


class PublisherFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Publisher

    name = factory.Faker("company")


class BookFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Book

    title = factory.Sequence(lambda n: f"Book Title {n}")
    description = factory.Faker("paragraph")
    cover_image = "https://placehold.co/400x600"
    original_price = Decimal("1500.00")
    sku = factory.Sequence(lambda n: f"SKU-{n:05d}")
    stock = 25
    category = factory.SubFactory(CategoryFactory)

    @factory.post_generation
    def authors(obj, create, extracted, **kwargs):
        if not create:
            return
        if extracted:
            for author in extracted:
                obj.authors.add(author)
        else:
            obj.authors.add(AuthorFactory())


class PODSpecificationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = PODSpecification

    name = factory.Sequence(lambda n: f"Spec {n}")
    price_per_page = Decimal("8.00")
    setup_fee = Decimal("200.00")
