"""Serializers for the POD app."""
from rest_framework import serializers

from .models import PODOrder, PODSpecification


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


class PODOrderSerializer(serializers.ModelSerializer):
    specification_detail = PODSpecificationSerializer(
        source="specification", read_only=True
    )
    status_display = serializers.CharField(source="get_status_display", read_only=True)

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
            "status_display",
            "total_price",
            "notes",
            "shipping_address",
            "created_at",
        ]
        read_only_fields = ["id", "status", "status_display", "total_price", "created_at"]

    def validate(self, attrs):
        spec = attrs.get("specification")
        pages = attrs.get("page_count")
        if spec and pages is not None:
            if pages < spec.min_pages or pages > spec.max_pages:
                raise serializers.ValidationError(
                    f"Page count must be between {spec.min_pages} and {spec.max_pages} "
                    f"for {spec.name}."
                )
        return attrs

    def create(self, validated_data):
        spec = validated_data["specification"]
        validated_data["total_price"] = spec.calculate_price(
            validated_data["page_count"], validated_data.get("copies", 1)
        )
        validated_data["user"] = self.context["request"].user
        validated_data["status"] = PODOrder.Status.SUBMITTED
        return super().create(validated_data)


class PODPriceQuoteSerializer(serializers.Serializer):
    specification_id = serializers.IntegerField()
    page_count = serializers.IntegerField(min_value=1)
    copies = serializers.IntegerField(min_value=1, default=1)
