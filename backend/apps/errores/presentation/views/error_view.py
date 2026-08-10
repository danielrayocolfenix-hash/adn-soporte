from urllib.parse import urlsplit

from django.db.models import Q
from django.utils import timezone
from rest_framework import viewsets
from rest_framework.decorators import action

from apps.errores.infraestructure.models.error_model import ErrorGroupModel
from apps.errores.infraestructure.services.browser_capture import capture_browser_errors
from apps.errores.infraestructure.services.browser_prober import probe_with_browser
from apps.errores.infraestructure.services.prober import (
    ProbeHostNotAllowed,
    probe_endpoint,
    resolve_probe_url,
)
from apps.errores.presentation.permissions.error_permissions import ErrorPermissions
from apps.errores.presentation.serializers.error_serializer import (
    ErrorGroupDetailSerializer,
    ErrorGroupListSerializer,
    ProbarEndpointSerializer,
)
from shared.presentation.response import error_response, success_response


class ErrorViewSet(viewsets.ReadOnlyModelViewSet):
    """Evidencia técnica de los errores capturados automáticamente. La
    triage (estado, causa raíz, solución) se hace en el ticket QA vinculado
    (`apps.qa`, categoría server_error) — ver `QaDetallePage` en el
    frontend. Los registros solo los crea la captura automática
    (`capture_service.capture_exception`); esta API es de solo lectura."""

    permission_classes = [ErrorPermissions]

    def get_queryset(self):
        queryset = ErrorGroupModel.objects.select_related("usuario", "qa_ticket").all()
        params = self.request.query_params

        ambiente = params.get("ambiente")
        if ambiente:
            queryset = queryset.filter(ambiente=ambiente)

        nivel = params.get("nivel")
        if nivel:
            queryset = queryset.filter(nivel=nivel)

        search = params.get("search")
        if search:
            queryset = queryset.filter(
                Q(exception_type__icontains=search)
                | Q(mensaje__icontains=search)
                | Q(path__icontains=search)
            )

        return queryset

    def get_serializer_class(self):
        if self.action == "retrieve":
            return ErrorGroupDetailSerializer
        return ErrorGroupListSerializer

    def retrieve(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_object())
        return success_response(serializer.data)

    @action(detail=False, methods=["post"], url_path="probar")
    def probar(self, request):
        """Prueba un endpoint bajo demanda (botón "Probar endpoint" del
        ticket QA): hace una petición HTTP simple (rápida, siempre
        disponible) y, además, abre la URL en un navegador headless para
        detectar errores de JavaScript que una petición HTTP no puede ver
        (por ejemplo, una SPA que responde 200 pero falla al iniciar). Si
        alguno de los dos genera un error capturado por el monitor, lo
        vincula al ticket QA indicado para poblar su consola de
        diagnóstico."""
        serializer = ProbarEndpointSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            url = resolve_probe_url(serializer.validated_data["url"], request)
        except ProbeHostNotAllowed as exc:
            return error_response(
                f"No se permiten pruebas contra el host \"{exc.host}\".",
                400,
                "PROBE_HOST_NOT_ALLOWED",
            )
        except ValueError as exc:
            return error_response(str(exc), 400, "PROBE_INVALID_URL")

        qa_ticket_id = serializer.validated_data.get("qa_ticket")
        before = timezone.now()

        result = probe_endpoint(url, authorization=request.headers.get("Authorization"))
        browser_result = probe_with_browser(url)

        error_group = None
        target_host = urlsplit(url).hostname
        own_host = request.get_host().split(":")[0].lower()
        if target_host and target_host.lower() == own_host:
            path = urlsplit(url).path
            candidate = (
                ErrorGroupModel.objects.filter(path=path, last_seen__gte=before)
                .order_by("-last_seen")
                .first()
            )
            if candidate is not None:
                self._link_qa_ticket(candidate, qa_ticket_id)
                error_group = ErrorGroupDetailSerializer(candidate).data

        browser_error_group = None
        browser_group = capture_browser_errors(
            url=url,
            path=urlsplit(url).path,
            console_errors=browser_result["console_errors"],
            page_errors=browser_result["page_errors"],
            triggered_by=request.user,
        )
        if browser_group is not None:
            self._link_qa_ticket(browser_group, qa_ticket_id)
            browser_error_group = ErrorGroupDetailSerializer(browser_group).data

        return success_response(
            {
                "url": url,
                "status_code": result["status_code"] or browser_result["status_code"],
                "ok": result["ok"],
                "body_snippet": result["body_snippet"],
                "network_error": result["network_error"],
                "error_group": error_group,
                "browser_error_group": browser_error_group,
                "browser_probe_error": browser_result["network_error"],
            }
        )

    @staticmethod
    def _link_qa_ticket(group: ErrorGroupModel, qa_ticket_id) -> None:
        if not qa_ticket_id:
            return
        from apps.qa.infraestructure.models.qa_model import QaModel

        qa_ticket = QaModel.objects.filter(id=qa_ticket_id).first()
        if qa_ticket is not None:
            group.qa_ticket = qa_ticket
            group.save(update_fields=["qa_ticket"])
