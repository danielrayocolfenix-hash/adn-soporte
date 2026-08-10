from rest_framework.routers import DefaultRouter

from apps.errores.presentation.views.error_view import ErrorViewSet

router = DefaultRouter()
router.register(r"", ErrorViewSet, basename="errores")

urlpatterns = router.urls
