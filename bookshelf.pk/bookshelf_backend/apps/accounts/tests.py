"""Tests for the accounts app."""
from __future__ import annotations

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class AuthFlowTests(APITestCase):
    def test_register_returns_tokens(self):
        url = reverse("v1:register")
        payload = {
            "email": "new@bookshelf.pk",
            "username": "newuser",
            "full_name": "New User",
            "password": "Strongpass123!",
            "password_confirm": "Strongpass123!",
        }
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = response.json()["data"]
        self.assertIn("access", data)
        self.assertIn("refresh", data)
        self.assertEqual(data["user"]["email"], "new@bookshelf.pk")

    def test_register_password_mismatch(self):
        url = reverse("v1:register")
        payload = {
            "email": "x@bookshelf.pk",
            "username": "xuser",
            "password": "Strongpass123!",
            "password_confirm": "different",
        }
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_and_profile(self):
        self.client.post(
            reverse("v1:register"),
            {
                "email": "login@bookshelf.pk",
                "username": "loginuser",
                "password": "Strongpass123!",
                "password_confirm": "Strongpass123!",
            },
            format="json",
        )
        login = self.client.post(
            reverse("v1:login"),
            {"email": "login@bookshelf.pk", "password": "Strongpass123!"},
            format="json",
        )
        self.assertEqual(login.status_code, status.HTTP_200_OK)
        token = login.json()["data"]["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        profile = self.client.get(reverse("v1:profile"))
        self.assertEqual(profile.status_code, status.HTTP_200_OK)
        self.assertEqual(profile.json()["data"]["email"], "login@bookshelf.pk")
