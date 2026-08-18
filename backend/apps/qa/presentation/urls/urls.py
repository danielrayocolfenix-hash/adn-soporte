from rest_framework.routers import DefaultRouter

from apps.qa.presentation.views.caso_prueba_view import CasoPruebaViewSet
from apps.qa.presentation.views.qa_view import QaViewSet
from apps.qa.presentation.views.suite_prueba_view import SuitePruebaViewSet

router = DefaultRouter()
# "suites" y "casos" deben registrarse ANTES que QaViewSet: como QaViewSet
# se registra con prefijo vacío, su ruta de detalle (`<pk>/`) haría match
# con cualquier segmento de un solo nivel (p.ej. "suites/") si se registrara
# primero, tratándolo como un pk de QA inválido.
router.register(r"suites", SuitePruebaViewSet, basename="suite-prueba")
router.register(r"casos", CasoPruebaViewSet, basename="caso-prueba")
router.register(r"", QaViewSet, basename="qa")

urlpatterns = router.urls