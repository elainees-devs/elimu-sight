import time
import hashlib
import json
from collections import OrderedDict
from typing import Any, Optional

from app.core.config import settings
from app.core.logging import logger


class TTLCache:
    def __init__(self, max_size: int = 256, default_ttl: int = 300):
        self.max_size = max_size
        self.default_ttl = default_ttl
        self._cache: OrderedDict[str, tuple[Any, float]] = OrderedDict()
        self._hits = 0
        self._misses = 0

    def get(self, key: str) -> Optional[Any]:
        self._evict_expired()

        if key not in self._cache:
            self._misses += 1
            return None

        value, expiry = self._cache[key]
        if time.monotonic() > expiry:
            del self._cache[key]
            self._misses += 1
            return None

        self._cache.move_to_end(key)
        self._hits += 1
        return value

    def set(self, key: str, value: Any, ttl: Optional[int] = None):
        ttl = ttl if ttl is not None else self.default_ttl
        expiry = time.monotonic() + ttl

        if key in self._cache:
            self._cache.move_to_end(key)

        self._cache[key] = (value, expiry)

        while len(self._cache) > self.max_size:
            self._cache.popitem(last=False)

    def delete(self, key: str):
        self._cache.pop(key, None)

    def clear(self):
        self._cache.clear()
        self._hits = 0
        self._misses = 0

    def _evict_expired(self):
        now = time.monotonic()
        expired = [k for k, (_, exp) in self._cache.items() if now > exp]
        for k in expired:
            del self._cache[k]

    @property
    def stats(self) -> dict:
        total = self._hits + self._misses
        hit_rate = round(self._hits / total * 100, 2) if total > 0 else 0.0
        return {
            "size": len(self._cache),
            "max_size": self.max_size,
            "hits": self._hits,
            "misses": self._misses,
            "hit_rate": hit_rate,
        }

    @staticmethod
    def make_key(*args, **kwargs) -> str:
        content = json.dumps({"args": args, "kwargs": kwargs}, sort_keys=True, default=str)
        return hashlib.sha256(content.encode()).hexdigest()


analysis_cache = TTLCache(max_size=256, default_ttl=settings.cache_ttl_seconds)
