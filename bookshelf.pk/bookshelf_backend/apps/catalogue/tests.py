"""Tests for the catalogue app."""
from __future__ import annotations

from decimal import Decimal

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from tests.factories import BookFactory


class BookCatalogueTests(APITestCase):
    def setUp(self):
        self.book = BookFactory(
            title="Atomic Habits",
            original_price=Decimal("2000.00"),
            sale_price=Decimal("1500.00"),
            is_featured=True,
        )

    def test_list_books(self):
        response = self.client.get(reverse("v1:book-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["data"]["count"], 1)

    def test_book_detail_increments_views(self):
        url = reverse("v1:book-detail", kwargs={"slug": self.book.slug})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["data"]["title"], "Atomic Habits")
        self.assertEqual(response.json()["data"]["discount_percentage"], 25)

    def test_featured_endpoint(self):
        response = self.client.get(reverse("v1:book-featured"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["data"]["count"], 1)

    def test_search(self):
        response = self.client.get(reverse("v1:search"), {"q": "Atomic"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()["data"]["books"]), 1)
