from decimal import Decimal

from django.urls import reverse
from rest_framework.test import APITestCase

from .models import Book, Category


class CatalogueAPITests(APITestCase):
    def setUp(self):
        self.category = Category.objects.create(name="Fiction")
        self.book = Book.objects.create(
            title="The Forty Rules of Love",
            description="A novel.",
            category=self.category,
            original_price=Decimal("1200.00"),
            sale_price=Decimal("999.00"),
            sku="BK-001",
            stock=10,
            is_active=True,
            is_featured=True,
        )

    def test_book_list(self):
        response = self.client.get(reverse("v1:book-list"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["data"]["count"], 1)

    def test_book_detail_increments_view_count(self):
        url = reverse("v1:book-detail", kwargs={"slug": self.book.slug})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.book.refresh_from_db()
        self.assertEqual(self.book.view_count, 1)

    def test_featured_action(self):
        response = self.client.get(reverse("v1:book-featured"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
