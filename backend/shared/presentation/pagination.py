from rest_framework.pagination import PageNumberPagination

from shared.presentation.response import success_response


class StandardPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100

    def get_paginated_response(self, data):
        return success_response(
            data=data,
            meta={
                "count": self.page.paginator.count,
                "page": self.page.number,
                "pages": self.page.paginator.num_pages,
                "page_size": self.get_page_size(self.request),
            },
        )
