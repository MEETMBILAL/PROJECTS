from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase

from apps.catalogue.models import Book, Category
from apps.orders.models import Cart
from services.cart_service import CartService
from services.order_service import OrderService

User = get_user_model()


class OrderServiceTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="buyer@bookshelf.pk", username="buyer", password="Str0ngPass!23"
        )
        category = Category.objects.create(name="Business")
        self.book = Book.objects.create(
            title="Atomic Habits",
            description="Habits book.",
            category=category,
            original_price=Decimal("1500.00"),
            sku="BK-AH",
            stock=5,
        )

    def test_create_order_from_cart(self):
        cart = CartService.get_or_create_cart(user=self.user)
        CartService.add_item(cart, self.book.id, 2)
        order = OrderService.create_order_from_cart(
            cart=cart,
            user=self.user,
            shipping_address={"city": "Lahore", "province": "Punjab"},
        )
        self.assertEqual(order.subtotal, Decimal("3000.00"))
        self.assertEqual(order.items.count(), 1)
        self.book.refresh_from_db()
        self.assertEqual(self.book.stock, 3)
        self.assertEqual(Cart.objects.get(pk=cart.pk).items.count(), 0)
