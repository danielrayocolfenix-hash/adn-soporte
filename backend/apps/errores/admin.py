from django.contrib import admin

from apps.errores.infraestructure.models.error_model import ErrorGroupModel


@admin.register(ErrorGroupModel)
class ErrorGroupAdmin(admin.ModelAdmin):
    list_display = (
        "exception_type",
        "path",
        "nivel",
        "ambiente",
        "count",
        "last_seen",
        "qa_ticket",
    )
    list_filter = ("ambiente", "nivel")
    search_fields = ("exception_type", "mensaje", "path", "fingerprint")
    readonly_fields = [field.name for field in ErrorGroupModel._meta.fields]
