from rest_framework.routers import DefaultRouter

from apps.qa.presentation.views.qa_view import QaViewSet

router = DefaultRouter()
router.register(r"", QaViewSet, basename="qa")

urlpatterns = router.urls