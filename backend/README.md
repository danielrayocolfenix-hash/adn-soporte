# ADN-Soporte — Backend

API del módulo de soporte técnico/QA de ADN-VORTEX. Django + Django REST
Framework con arquitectura hexagonal (Ports & Adapters): cada app de
`apps/` está aislada en capas `domain` / `application` / `infraestructure` /
`presentation`, sin dependencias cruzadas entre módulos de negocio.

## Arquitectura

```
config/                 Composition root: settings, urls raíz, wsgi/asgi, celery
shared/                 Kernel transversal (Entity/ValueObject base, UseCase base,
                         exception handler DRF, envelope de respuesta, paginación)
apps/
  <modulo>/
    domain/             Entidades, value objects, excepciones, eventos, interfaces
                         de repositorio, servicios de dominio — sin Django.
    application/         Casos de uso (orquestan domain + repositorios).
    infraestructure/     Implementación de repositorios (ORM), modelos Django.
    presentation/         Views/ViewSets DRF, serializers, urls, permisos.
    tests/
```

`apps/qa` es el módulo de referencia: tiene las 4 capas completas con clases
mínimas (sin lógica de negocio todavía) que sirven de plantilla para el resto.
Los demás módulos (`roles`, `dashboard`, `seguimiento`, `notificaciones`,
`adjuntos`, `reportes`, `configuracion`, `auditoria`, `comentarios`) están
scaffoldeados solo como paquetes Django registrados, listos para llenarse sin
reestructurar. `usuarios` ya incluye el modelo de usuario custom
(`AUTH_USER_MODEL`) porque cambiarlo después del primer `migrate` obliga a
resetear la base de datos. `auth` cablea los endpoints JWT de
`djangorestframework-simplejwt`.

## Requisitos (instalación nativa, sin Docker)

- Python 3.12+
- PostgreSQL instalado y corriendo localmente
- Redis instalado y corriendo localmente

## Puesta en marcha

```bash
python -m venv .venv
.venv\Scripts\activate          # PowerShell: .venv\Scripts\Activate.ps1
pip install -r requirements/development.txt

copy .env.example .env          # y ajustar credenciales de Postgres/Redis

# Crear la base de datos en Postgres (una sola vez):
#   psql -U postgres -c "CREATE DATABASE adn_soporte;"
#   psql -U postgres -c "CREATE USER adn_soporte WITH PASSWORD 'change-me';"
#   psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE adn_soporte TO adn_soporte;"

python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

API disponible en `http://localhost:8000/api/v1/`, documentación OpenAPI en
`http://localhost:8000/api/docs/`.

## Calidad de código

```bash
black .
isort .
flake8
pytest
```

`pre-commit install` activa estas mismas validaciones antes de cada commit
(ver `.pre-commit-config.yaml`).

## Variables de entorno

Ver `.env.example`. Nunca commitear `.env`.
