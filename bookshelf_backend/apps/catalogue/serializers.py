"""Serializers for the catalogue app."""
from rest_framework import serializers

from .models import Author, Book, Category, Publisher, Tag


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "name", "slug"]


class PublisherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publisher
        fields = ["id", "name", "slug", "website"]


class AuthorSerializer(serializers.ModelSerializer):
    book_count = serializers.SerializerMethodField()

    class Meta:
        model = Author
        fields = ["id", "name", "slug", "bio", "photo", "book_count"]

    def get_book_count(self, obj):
        return obj.books.filter(is_active=True).count()


class CategorySerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()
    book_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "slug",
            "parent",
            "description",
            "image",
            "icon",
            "order",
            "is_active",
            "children",
            "book_count",
        ]

    def get_children(self, obj):
        children = obj.children.filter(is_active=True)
        return CategorySerializer(children, many=True, context=self.context).data

    def get_book_count(self, obj):
        return obj.books.filter(is_active=True).count()


class BookListSerializer(serializers.ModelSerializer):
    authors = AuthorSerializer(many=True, read_only=True)
    category = serializers.SlugRelatedField(slug_field="name", read_only=True)
    category_slug = serializers.SlugRelatedField(
        source="category", slug_field="slug", read_only=True
    )
    effective_price = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )
    discount_percentage = serializers.IntegerField(read_only=True)
    is_on_sale = serializers.BooleanField(read_only=True)
    in_stock = serializers.BooleanField(read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    review_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Book
        fields = [
            "id",
            "title",
            "slug",
            "cover_image",
            "authors",
            "category",
            "category_slug",
            "original_price",
            "sale_price",
            "effective_price",
            "currency",
            "discount_percentage",
            "is_on_sale",
            "in_stock",
            "stock",
            "format",
            "language",
            "is_featured",
            "is_bestseller",
            "is_new_arrival",
            "average_rating",
            "review_count",
            "short_description",
        ]


class BookDetailSerializer(serializers.ModelSerializer):
    authors = AuthorSerializer(many=True, read_only=True)
    publisher = PublisherSerializer(read_only=True)
    category = serializers.SlugRelatedField(slug_field="name", read_only=True)
    category_slug = serializers.SlugRelatedField(
        source="category", slug_field="slug", read_only=True
    )
    category_detail = CategorySerializer(source="category", read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    effective_price = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )
    discount_percentage = serializers.IntegerField(read_only=True)
    is_on_sale = serializers.BooleanField(read_only=True)
    in_stock = serializers.BooleanField(read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    review_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Book
        fields = [
            "id",
            "title",
            "slug",
            "isbn",
            "authors",
            "publisher",
            "category",
            "category_slug",
            "category_detail",
            "tags",
            "description",
            "short_description",
            "cover_image",
            "additional_images",
            "language",
            "pages",
            "edition",
            "publication_date",
            "format",
            "original_price",
            "sale_price",
            "effective_price",
            "currency",
            "discount_percentage",
            "is_on_sale",
            "in_stock",
            "stock",
            "sku",
            "is_featured",
            "is_bestseller",
            "is_new_arrival",
            "view_count",
            "sale_count",
            "average_rating",
            "review_count",
            "meta_title",
            "meta_description",
            "created_at",
        ]


class BookWriteSerializer(serializers.ModelSerializer):
    authors = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Author.objects.all()
    )
    tags = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Tag.objects.all(), required=False
    )

    class Meta:
        model = Book
        fields = [
            "id",
            "title",
            "slug",
            "isbn",
            "authors",
            "publisher",
            "category",
            "tags",
            "description",
            "short_description",
            "cover_image",
            "additional_images",
            "language",
            "pages",
            "edition",
            "publication_date",
            "format",
            "original_price",
            "sale_price",
            "currency",
            "stock",
            "sku",
            "is_active",
            "is_featured",
            "is_bestseller",
            "is_new_arrival",
            "meta_title",
            "meta_description",
        ]
