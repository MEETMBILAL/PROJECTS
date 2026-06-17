"""Custom pagination classes returning a consistent envelope."""
from __future__ import annotations

from collections import OrderedDict

from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class StandardResultsSetPagination(PageNumberPagination):
    """Page-number pagination with a client-configurable ``page_size``."""

    page_size = 12
    page_size_query_param = "page_size"
    max_page_size = 100

    def get_paginated_response(self, data) -> Response:
        return Response(
            OrderedDict(
                [
                    ("count", self.page.paginator.count),
                    ("total_pages", self.page.paginator.num_pages),
                    ("current_page", self.page.number),
                    ("page_size", self.get_page_size(self.request)),
                    ("next", self.get_next_link()),
                    ("previous", self.get_previous_link()),
                    ("results", data),
                ]
            )
        )


class LargeResultsSetPagination(StandardResultsSetPagination):
    """Pagination for endpoints that benefit from larger pages."""

    page_size = 48
    max_page_size = 200
