"""Serializers for the POD module."""
from __future__ import annotations

from rest_framework import serializers

from .models import PODFile, PODOrder, PODSpecification


class PODSpecificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PODSpecification
        fields = [
            "id",
            "name",
            "paper_size",
            "binding",
            "cover_type",
            "color_mode",
            "price_per_page",
            "min_pages",
            "max_pages",
            "setup_fee",
        ]


class PODFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PODFile
        fields = ["id", "file_url", "file_name", "file_type"]


class PODOrderSerializer(serializers.ModelSerializer):
    specification_detail = PODSpecificationSerializer(
        source="specification", read_only=True
    )
    files = PODFileSerializer(many=True, read_only=True)

    class Meta:
        model = PODOrder
        fields = [
            "id",
            "specification",
            "specification_detail",
            "file_url",
            "file_name",
            "page_count",
            "copies",
            "title",
            "status",
            "total_price",
            "notes",
            "shipping_address",
            "files",
            "created_at",
        ]
        read_only_fields = ["id", "status", "total_price", "created_at"]


class PODPriceQuoteSerializer(serializers.Serializer):
    specification = serializers.PrimaryKeyRelatedField(
        queryset=PODSpecification.objects.filter(is_active=True)
    )
    page_count = serializers.IntegerField(min_value=1)
    copies = serializers.IntegerField(min_value=1, default=1)
