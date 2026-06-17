"""Tests for cart and order flows."""
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.catalogue.models import Book, Category

User = get_user_model()


class CartOrderTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="buyer@example.com", username="buyer", password="StrongPass123!"
        )
        category = Category.objects.create(name="Business")
        self.book = Book.objects.create(
            title="Atomic Habits",
            description="Habits book.",
            cover_image="https://example.com/a.jpg",
            original_price=Decimal("1500.00"),
            sku="SKU-AH",
            category=category,
            stock=10,
        )

    def authenticate(self):
        login = self.client.post(
            reverse("v1:auth:login"),
            {"email": "buyer@example.com", "password": "StrongPass123!"},
            format="json",
        )
        token = login.json()["data"]["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    def test_add_to_cart_and_checkout(self):
        self.authenticate()
        add = self.client.post(
            reverse("v1:cart:add"),
            {"book_id": self.book.id, "quantity": 2},
            format="json",
        )
        self.assertEqual(add.status_code, status.HTTP_201_CREATED)
        self.assertEqual(add.json()["data"]["total_items"], 2)

        order = self.client.post(
            reverse("v1:orders:order-create"),
            {
                "shipping_address": {
                    "street": "123 Mall Road",
                    "city": "Lahore",
                    "province": "Punjab",
                    "phone": "03001234567",
                },
                "payment_method": "cod",
            },
            format="json",
        )
        self.assertEqual(order.status_code, status.HTTP_201_CREATED)
        self.assertEqual(order.json()["data"]["total"], "3000.00")
        self.book.refresh_from_db()
        self.assertEqual(self.book.stock, 8)
