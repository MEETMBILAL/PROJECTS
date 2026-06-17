from rest_framework import serializers

from .models import Author, Book, Category, Publisher, Tag


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "name", "slug"]


class AuthorSerializer(serializers.ModelSerializer):
    book_count = serializers.IntegerField(source="books.count", read_only=True)

    class Meta:
        model = Author
        fields = ["id", "name", "slug", "bio", "photo", "book_count"]


class PublisherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publisher
        fields = ["id", "name", "slug", "website"]


class CategorySerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()
    book_count = serializers.IntegerField(source="books.count", read_only=True)

    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "image",
            "icon",
            "parent",
            "order",
            "is_active",
            "children",
            "book_count",
        ]

    def get_children(self, obj):
        children = obj.children.filter(is_active=True)
        return CategorySerializer(children, many=True, context=self.context).data


class BookListSerializer(serializers.ModelSerializer):
    authors = AuthorSerializer(many=True, read_only=True)
    category = serializers.SlugRelatedField(slug_field="name", read_only=True)
    effective_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    discount_percentage = serializers.IntegerField(read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    review_count = serializers.IntegerField(read_only=True)
    in_stock = serializers.BooleanField(read_only=True)

    class Meta:
        model = Book
        fields = [
            "id",
            "title",
            "slug",
            "authors",
            "category",
            "cover_image",
            "short_description",
            "format",
            "language",
            "original_price",
            "sale_price",
            "effective_price",
            "discount_percentage",
            "currency",
            "stock",
            "in_stock",
            "is_featured",
            "is_bestseller",
            "is_new_arrival",
            "average_rating",
            "review_count",
        ]


class BookDetailSerializer(serializers.ModelSerializer):
    authors = AuthorSerializer(many=True, read_only=True)
    publisher = PublisherSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    effective_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    discount_percentage = serializers.IntegerField(read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    review_count = serializers.IntegerField(read_only=True)
    in_stock = serializers.BooleanField(read_only=True)

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
            "effective_price",
            "discount_percentage",
            "currency",
            "stock",
            "in_stock",
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
    class Meta:
        model = Book
        fields = [
            "title",
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
