"""factory_boy factories for tests and seeding."""
from decimal import Decimal

import factory
from django.contrib.auth import get_user_model

from apps.catalogue.models import Author, Book, Category, Publisher, Tag
from apps.pod.models import PODSpecification
from apps.promotions.models import Coupon

User = get_user_model()


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User
        django_get_or_create = ("email",)

    email = factory.Sequence(lambda n: f"user{n}@example.com")
    username = factory.Sequence(lambda n: f"user{n}")
    full_name = factory.Faker("name")

    @factory.post_generation
    def password(self, create, extracted, **kwargs):
        self.set_password(extracted or "StrongPass123!")
        if create:
            self.save()


class CategoryFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Category
        django_get_or_create = ("name",)

    name = factory.Sequence(lambda n: f"Category {n}")
    description = factory.Faker("sentence")


class AuthorFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Author
        django_get_or_create = ("name",)

    name = factory.Faker("name")
    bio = factory.Faker("paragraph")


class PublisherFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Publisher
        django_get_or_create = ("name",)

    name = factory.Faker("company")


class TagFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Tag
        django_get_or_create = ("name",)

    name = factory.Sequence(lambda n: f"tag-{n}")


class BookFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Book
        django_get_or_create = ("sku",)

    title = factory.Faker("sentence", nb_words=4)
    description = factory.Faker("paragraph")
    short_description = factory.Faker("sentence")
    cover_image = factory.Faker("image_url")
    original_price = factory.LazyFunction(lambda: Decimal("1200.00"))
    sku = factory.Sequence(lambda n: f"SKU-{n:05d}")
    stock = 25
    category = factory.SubFactory(CategoryFactory)

    @factory.post_generation
    def authors(self, create, extracted, **kwargs):
        if not create:
            return
        if extracted:
            self.authors.add(*extracted)
        else:
            self.authors.add(AuthorFactory())


class PODSpecificationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = PODSpecification
        django_get_or_create = ("name",)

    name = factory.Sequence(lambda n: f"Spec {n}")
    paper_size = "A4"
    binding = "Perfect"
    cover_type = "Softcover"
    color_mode = "BW"
    price_per_page = Decimal("5.00")
    setup_fee = Decimal("200.00")


class CouponFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Coupon
        django_get_or_create = ("code",)

    code = factory.Sequence(lambda n: f"SAVE{n}")
    discount_type = Coupon.DiscountType.PERCENTAGE
    discount_value = Decimal("10.00")
