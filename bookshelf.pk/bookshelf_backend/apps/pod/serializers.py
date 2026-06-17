"""Serializers for the Print-on-Demand app."""
from __future__ import annotations

from rest_framework import serializers

from .models import PODOrder, PODSpecification


class PODSpecificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PODSpecification
        fields = (
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
            "is_active",
        )


class PODOrderSerializer(serializers.ModelSerializer):
    specification_detail = PODSpecificationSerializer(
        source="specification", read_only=True
    )
    status_display = serializers.CharField(
        source="get_status_display", read_only=True
    )

    class Meta:
        model = PODOrder
        fields = (
            "id",
            "pod_number",
            "specification",
            "specification_detail",
            "file_url",
            "file_name",
            "page_count",
            "copies",
            "title",
            "status",
            "status_display",
            "total_price",
            "notes",
            "shipping_address",
            "created_at",
        )
        read_only_fields = (
            "id",
            "pod_number",
            "status",
            "total_price",
            "created_at",
        )

    def validate(self, attrs):
        spec = attrs.get("specification")
        page_count = attrs.get("page_count", 0)
        if spec and page_count:
            if page_count < spec.min_pages or page_count > spec.max_pages:
                raise serializers.ValidationError(
                    {
                        "page_count": (
                            f"Page count must be between {spec.min_pages} and "
                            f"{spec.max_pages} for this specification."
                        )
                    }
                )
        return attrs


class PODPriceCalcSerializer(serializers.Serializer):
    specification_id = serializers.IntegerField()
    page_count = serializers.IntegerField(min_value=1)
    copies = serializers.IntegerField(min_value=1, default=1)
