"""Tests for the catalogue app."""
from decimal import Decimal

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Author, Book, Category


class BookCatalogueTests(APITestCase):
    def setUp(self):
        self.category = Category.objects.create(name="Fiction")
        self.author = Author.objects.create(name="Test Author")
        self.book = Book.objects.create(
            title="The Great Test",
            description="A book about testing.",
            cover_image="https://example.com/cover.jpg",
            original_price=Decimal("1000.00"),
            sale_price=Decimal("750.00"),
            sku="SKU-001",
            category=self.category,
            stock=5,
            is_featured=True,
        )
        self.book.authors.add(self.author)

    def test_book_list(self):
        response = self.client.get(reverse("v1:catalogue:book-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["data"]["count"], 1)

    def test_book_detail_increments_views(self):
        url = reverse("v1:catalogue:book-detail", args=[self.book.slug])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()["data"]
        self.assertEqual(data["view_count"], 1)
        self.assertEqual(data["discount_percentage"], 25)

    def test_featured_endpoint(self):
        url = reverse("v1:catalogue:book-featured")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()["data"]), 1)

    def test_search(self):
        url = reverse("v1:catalogue:search")
        response = self.client.get(url, {"q": "Great"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["data"]["total"], 1)
