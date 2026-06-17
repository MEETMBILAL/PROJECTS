"""Tests for the catalogue app."""
from decimal import Decimal

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Author, Book, Category


class BookCatalogueTests(APITestCase):
    def setUp(self):
        self.category = Category.objects.create(name="Fiction")
        self.author = Author.objects.create(name="Jane Doe")
        self.book = Book.objects.create(
            title="The Great Read",
            description="A wonderful book.",
            cover_image="https://example.com/cover.jpg",
            original_price=Decimal("1000"),
            sale_price=Decimal("750"),
            sku="SKU-001",
            stock=10,
            category=self.category,
            is_featured=True,
        )
        self.book.authors.add(self.author)

    def test_book_list(self):
        response = self.client.get(reverse("v1:book-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        body = response.json()
        self.assertTrue(body["success"])
        self.assertEqual(body["data"]["count"], 1)

    def test_book_detail_increments_views(self):
        url = reverse("v1:book-detail", args=[self.book.slug])
        body = self.client.get(url).json()
        self.assertEqual(body["data"]["view_count"], 1)
        self.assertEqual(body["data"]["discount_percentage"], 25)

    def test_featured_action(self):
        body = self.client.get(reverse("v1:book-featured")).json()
        self.assertEqual(len(body["data"]), 1)

    def test_search(self):
        body = self.client.get(
            reverse("v1:search"), {"q": "Great"}
        ).json()
        self.assertEqual(len(body["data"]["books"]), 1)
