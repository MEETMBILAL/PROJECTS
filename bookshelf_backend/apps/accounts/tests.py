"""Tests for the accounts app."""
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class AuthFlowTests(APITestCase):
    def test_register_returns_tokens(self):
        url = reverse("v1:auth:register")
        payload = {
            "email": "reader@example.com",
            "username": "reader",
            "full_name": "Test Reader",
            "password": "StrongPass123!",
            "password2": "StrongPass123!",
        }
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("access", response.json()["data"])
        self.assertTrue(User.objects.filter(email="reader@example.com").exists())

    def test_login_and_profile(self):
        User.objects.create_user(
            email="reader@example.com", username="reader", password="StrongPass123!"
        )
        login_url = reverse("v1:auth:login")
        response = self.client.post(
            login_url,
            {"email": "reader@example.com", "password": "StrongPass123!"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        access = response.json()["data"]["access"]

        profile_url = reverse("v1:account:profile")
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        profile = self.client.get(profile_url)
        self.assertEqual(profile.status_code, status.HTTP_200_OK)
        self.assertEqual(profile.json()["data"]["email"], "reader@example.com")
