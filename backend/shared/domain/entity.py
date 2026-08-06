import uuid
from dataclasses import dataclass, field


@dataclass(kw_only=True)
class Entity:
    id: uuid.UUID = field(default_factory=uuid.uuid4)

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Entity):
            return NotImplemented
        return self.id == other.id

    def __hash__(self) -> int:
        return hash(self.id)
