from .base import *  # noqa: F401,F403

DEBUG = False
ALLOWED_HOSTS = ["testserver"]

PASSWORD_HASHERS = ["django.contrib.auth.hashers.MD5PasswordHasher"]

CELERY_TASK_ALWAYS_EAGER = True

LOGGING["root"]["handlers"] = ["console"]  # noqa: F405
for _logger in LOGGING["loggers"].values():  # noqa: F405
    _logger["handlers"] = ["console"]
