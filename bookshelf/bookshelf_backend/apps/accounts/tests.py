"""Tests for the accounts app."""
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class AuthFlowTests(APITestCase):
    def test_register_returns_tokens(self):
        url = reverse("v1:register")
        payload = {
            "email": "reader@example.com",
            "username": "reader",
            "full_name": "Test Reader",
            "password": "SuperSecret123",
            "password2": "SuperSecret123",
        }
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("access", response.json()["data"])
        self.assertTrue(
            User.objects.filter(email="reader@example.com").exists()
        )

    def test_login_and_profile(self):
        User.objects.create_user(
            email="reader@example.com",
            username="reader",
            password="SuperSecret123",
        )
        login = self.client.post(
            reverse("v1:login"),
            {"email": "reader@example.com", "password": "SuperSecret123"},
            format="json",
        )
        self.assertEqual(login.status_code, status.HTTP_200_OK)
        token = login.json()["data"]["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        profile = self.client.get(reverse("v1:profile"))
        self.assertEqual(profile.status_code, status.HTTP_200_OK)
        self.assertEqual(
            profile.json()["data"]["email"], "reader@example.com"
        )
