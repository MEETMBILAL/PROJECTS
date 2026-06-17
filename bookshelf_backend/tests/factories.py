from decimal import Decimal

import factory
from django.contrib.auth import get_user_model

from apps.catalogue.models import Author, Book, Category, Publisher
from apps.pod.models import PODSpecification
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
        self.set_password(extracted or "Str0ngPass!23")
        if create:
            self.save()


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

    name = factory.Sequence(lambda n: f"Publisher {n}")


class BookFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Book

    title = factory.Sequence(lambda n: f"Book Title {n}")
    description = factory.Faker("paragraph")
    category = factory.SubFactory(CategoryFactory)
    publisher = factory.SubFactory(PublisherFactory)
    original_price = Decimal("1000.00")
    sale_price = Decimal("799.00")
    sku = factory.Sequence(lambda n: f"SKU-{n:05d}")
    stock = 25
    is_active = True

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

    code = factory.Sequence(lambda n: f"SAVE{n}")
    discount_type = "percentage"
    discount_value = Decimal("10.00")
    is_active = True


class PODSpecificationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = PODSpecification

    name = factory.Sequence(lambda n: f"Spec {n}")
    paper_size = "A4"
    binding = "Perfect"
    cover_type = "Softcover"
    color_mode = "BW"
    price_per_page = Decimal("5.00")
    setup_fee = Decimal("150.00")
