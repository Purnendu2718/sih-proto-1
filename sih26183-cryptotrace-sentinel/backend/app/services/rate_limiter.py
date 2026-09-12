"""
rate_limiter.py - Sliding Window IP Rate Limiter.
Enforces per-IP request throttling for public unauthenticated endpoints without requiring user accounts.
Thread-safe with automatic window cleanup and RFC-compliant rate limit telemetry.
"""

import time
import threading
from typing import Dict, List, Tuple


class SlidingWindowRateLimiter:
    def __init__(self, default_limit: int = 30, default_window_seconds: int = 60):
        self.default_limit = default_limit
        self.default_window_seconds = default_window_seconds
        self._ip_records: Dict[str, List[float]] = {}
        self._lock = threading.Lock()
        self._last_cleanup = time.time()

    def check_rate_limit(
        self,
        client_ip: str,
        limit: int = None,
        window_seconds: int = None
    ) -> Tuple[bool, int, int]:
        """
        Evaluates whether client_ip is allowed to make a request under the sliding window.
        Returns:
            (is_allowed: bool, remaining_quota: int, reset_seconds: int)
        """
        max_requests = limit if limit is not None else self.default_limit
        window = window_seconds if window_seconds is not None else self.default_window_seconds
        now = time.time()
        window_start = now - window

        with self._lock:
            # Periodic cleanup of expired entries every 300 seconds
            if now - self._last_cleanup > 300:
                self._cleanup(now, window)
                self._last_cleanup = now

            timestamps = self._ip_records.get(client_ip, [])
            # Evict timestamps older than the current sliding window
            valid_timestamps = [ts for ts in timestamps if ts > window_start]

            if len(valid_timestamps) >= max_requests:
                # Limit exceeded
                oldest_in_window = valid_timestamps[0]
                reset_seconds = max(1, int(oldest_in_window + window - now))
                self._ip_records[client_ip] = valid_timestamps
                return False, 0, reset_seconds

            # Request permitted: record current timestamp
            valid_timestamps.append(now)
            self._ip_records[client_ip] = valid_timestamps
            remaining = max_requests - len(valid_timestamps)
            reset_seconds = int(window)
            return True, remaining, reset_seconds

    def _cleanup(self, now: float, window: int):
        cutoff = now - window
        stale_ips = []
        for ip, tss in self._ip_records.items():
            fresh = [ts for ts in tss if ts > cutoff]
            if fresh:
                self._ip_records[ip] = fresh
            else:
                stale_ips.append(ip)
        for ip in stale_ips:
            del self._ip_records[ip]

    def reset(self):
        """Clears all records (useful for automated testing)."""
        with self._lock:
            self._ip_records.clear()


# Global singleton instance configured to 30 requests/minute
public_rate_limiter = SlidingWindowRateLimiter(default_limit=30, default_window_seconds=60)
