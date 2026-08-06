import uuid
from dataclasses import dataclass, field
from datetime import datetime, timezone


@dataclass(frozen=True, kw_only=True)
class QaCreatedEvent:
    qa_id: uuid.UUID
    occurred_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
