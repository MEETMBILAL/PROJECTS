"""Tests for cart and order flows."""
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase

from apps.catalogue.models import Book, Category
from apps.orders.models import Order
from services import cart_service
from services.order_service import OrderError, create_order_from_cart

User = get_user_model()


class OrderFlowTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="buyer@example.com", username="buyer", password="pass1234"
        )
        self.category = Category.objects.create(name="Business")
        self.book = Book.objects.create(
            title="Profit First",
            description="Money book.",
            cover_image="https://example.com/c.jpg",
            original_price=Decimal("2000"),
            sku="SKU-PF",
            stock=5,
            category=self.category,
        )

    def test_create_order_decrements_stock(self):
        cart = cart_service.get_or_create_cart(user=self.user)
        cart_service.add_item(cart, self.book, 2)
        order = create_order_from_cart(
            cart=cart,
            shipping_address={"city": "Lahore"},
            payment_method=Order.PaymentMethod.COD,
        )
        self.book.refresh_from_db()
        self.assertEqual(self.book.stock, 3)
        self.assertEqual(order.subtotal, Decimal("4000"))
        self.assertEqual(order.items.count(), 1)

    def test_empty_cart_raises(self):
        cart = cart_service.get_or_create_cart(user=self.user)
        with self.assertRaises(OrderError):
            create_order_from_cart(
                cart=cart,
                shipping_address={},
                payment_method=Order.PaymentMethod.COD,
            )

    def test_insufficient_stock_raises(self):
        cart = cart_service.get_or_create_cart(user=self.user)
        cart_service.add_item(cart, self.book, 99)
        with self.assertRaises(OrderError):
            create_order_from_cart(
                cart=cart,
                shipping_address={},
                payment_method=Order.PaymentMethod.COD,
            )
