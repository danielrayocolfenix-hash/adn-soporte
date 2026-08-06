from rest_framework.routers import DefaultRouter

from apps.qa.presentation.views.qa_view import QaViewSet

router = DefaultRouter()
router.register("", QaViewSet, basename="qa")
