from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase

User = get_user_model()


class AuthFlowTests(APITestCase):
    def test_register_returns_tokens(self):
        url = reverse("v1:register")
        payload = {
            "email": "reader@bookshelf.pk",
            "username": "reader",
            "full_name": "Test Reader",
            "password": "Str0ngPass!23",
            "password2": "Str0ngPass!23",
        }
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertIn("access", response.data["data"])
        self.assertTrue(User.objects.filter(email="reader@bookshelf.pk").exists())

    def test_login_returns_user(self):
        User.objects.create_user(
            email="reader@bookshelf.pk", username="reader", password="Str0ngPass!23"
        )
        url = reverse("v1:login")
        response = self.client.post(
            url,
            {"email": "reader@bookshelf.pk", "password": "Str0ngPass!23"},
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("access", response.data)
