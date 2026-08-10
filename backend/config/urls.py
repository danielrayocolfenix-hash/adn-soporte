from django.conf import settings
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

api_v1_patterns = [
    path("auth/", include("apps.auth.presentation.urls.urls")),
    path("usuarios/", include("apps.usuarios.presentation.urls.urls")),
    path("roles/", include("apps.roles.presentation.urls.urls")),
    path("qa/", include("apps.qa.presentation.urls.urls")),
    path("errores/", include("apps.errores.presentation.urls.urls")),
    path("tareas/", include("apps.seguimiento.presentation.urls.urls")),
    path("dashboard/", include("apps.dashboard.presentation.urls.urls")),
    path("notificaciones/", include("apps.notificaciones.presentation.urls.urls")),
    path("adjuntos/", include("apps.adjuntos.presentation.urls.urls")),
    path("reportes/", include("apps.reportes.presentation.urls.urls")),
    path("configuracion/", include("apps.configuracion.presentation.urls.urls")),
    path("auditoria/", include("apps.auditoria.presentation.urls.urls")),
    path("comentarios/", include("apps.comentarios.presentation.urls.urls")),
]

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include(api_v1_patterns)),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path("api/qa/", include("apps.qa.presentation.urls.urls")),
]

if settings.DEBUG:
    import debug_toolbar

    from apps.errores.presentation.views.debug_view import DebugBoomView

    urlpatterns += [
        path("__debug__/", include(debug_toolbar.urls)),
        path("api/v1/_debug/boom/", DebugBoomView.as_view()),
    ]
