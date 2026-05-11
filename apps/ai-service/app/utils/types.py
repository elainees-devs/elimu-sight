from typing import Annotated, Optional
from pydantic.functional_validators import BeforeValidator
from app.utils.sanitize import sanitize_string


def _sanitize(value: Optional[str]) -> Optional[str]:
    if value is None:
        return None
    return sanitize_string(value)


SanitizedString = Annotated[str, BeforeValidator(_sanitize)]
