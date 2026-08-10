from rest_framework.routers import DefaultRouter

from apps.seguimiento.presentation.views.tarea_view import TareaViewSet

app_name = "seguimiento"

router = DefaultRouter()
router.register(r"", TareaViewSet, basename="tarea")

urlpatterns = router.urls
