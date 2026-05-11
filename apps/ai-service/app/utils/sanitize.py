import re
from typing import Any


DEFAULT_PROMPT_PATTERNS = [
    (r"(?i)\bignore all previous instructions\b", "prompt_injection_ignore"),
    (r"(?i)\bforget (all )?(previous |prior )?(instructions|prompts|rules)\b", "prompt_injection_forget"),
    (r"(?i)\byou are (not |no longer )?(an? )?(ai|assistant|chatbot|language model)\b", "prompt_injection_identity"),
    (r"(?i)\boutput your (system )?prompt\b", "prompt_injection_system_leak"),
    (r"(?i)\bignore (the )?(above|previous|all) (and )?(do|say|output|respond)\b", "prompt_injection_override"),
]


def sanitize_string(value: str) -> str:
    if not isinstance(value, str):
        return str(value) if value is not None else ""
    cleaned = value.strip()
    cleaned = re.sub(r"<[^>]*>", "", cleaned)
    return cleaned[:10000]


def detect_prompt_injection(text: str) -> list[dict]:
    detected = []
    for pattern, label in DEFAULT_PROMPT_PATTERNS:
        if re.search(pattern, text):
            detected.append({"pattern": label, "match": text[:100]})
    return detected


def sanitize_input(data: Any, max_depth: int = 5) -> Any:
    if max_depth <= 0:
        return str(data)[:100]

    if isinstance(data, str):
        return sanitize_string(data)

    if isinstance(data, dict):
        return {k: sanitize_input(v, max_depth - 1) for k, v in data.items()}

    if isinstance(data, list):
        return [sanitize_input(item, max_depth - 1) for item in data]

    return data


def validate_no_injection(data: Any) -> list[dict]:
    warnings = []
    if isinstance(data, str):
        return detect_prompt_injection(data)

    if isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, str):
                warnings.extend(detect_prompt_injection(value))
            elif isinstance(value, (dict, list)):
                warnings.extend(validate_no_injection(value))

    if isinstance(data, list):
        for item in data:
            warnings.extend(validate_no_injection(item))

    return warnings
