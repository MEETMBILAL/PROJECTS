"""Tests for cart and order flows."""
from __future__ import annotations

from decimal import Decimal

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.orders.models import Order
from services import cart_service, order_service
from tests.factories import BookFactory, UserFactory


class CartServiceTests(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.book = BookFactory(original_price=Decimal("500.00"), stock=10)

    def test_add_and_total(self):
        cart = cart_service.get_or_create_cart(user=self.user)
        cart_service.add_to_cart(cart=cart, book_id=self.book.id, quantity=3)
        self.assertEqual(cart.total_items, 3)
        self.assertEqual(cart.subtotal, Decimal("1500.00"))

    def test_cannot_exceed_stock(self):
        cart = cart_service.get_or_create_cart(user=self.user)
        with self.assertRaises(Exception):
            cart_service.add_to_cart(cart=cart, book_id=self.book.id, quantity=99)


class OrderFlowTests(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.book = BookFactory(original_price=Decimal("1000.00"), stock=5)
        self.client.force_authenticate(self.user)

    def test_create_order_decrements_stock(self):
        cart = cart_service.get_or_create_cart(user=self.user)
        cart_service.add_to_cart(cart=cart, book_id=self.book.id, quantity=2)
        order = order_service.create_order_from_cart(
            user=self.user,
            cart=cart,
            shipping_address={"city": "Lahore", "province": "Punjab"},
        )
        self.book.refresh_from_db()
        self.assertEqual(self.book.stock, 3)
        self.assertEqual(order.total_items, 2)
        self.assertEqual(order.status, Order.Status.PENDING)

    def test_cancel_order_restocks(self):
        cart = cart_service.get_or_create_cart(user=self.user)
        cart_service.add_to_cart(cart=cart, book_id=self.book.id, quantity=2)
        order = order_service.create_order_from_cart(
            user=self.user,
            cart=cart,
            shipping_address={"city": "Karachi"},
        )
        order_service.cancel_order(order=order)
        self.book.refresh_from_db()
        self.assertEqual(self.book.stock, 5)
        self.assertEqual(order.status, Order.Status.CANCELLED)

    def test_order_list_endpoint(self):
        response = self.client.get(reverse("v1:order-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_order_empty_cart_returns_clean_error(self):
        response = self.client.post(
            reverse("v1:order-create-order"),
            {"shipping_address": {"city": "Lahore"}, "payment_method": "cod"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        body = response.json()
        self.assertFalse(body["success"])
        self.assertEqual(body["message"], "Your cart is empty.")
