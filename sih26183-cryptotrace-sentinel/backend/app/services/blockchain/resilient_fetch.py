import functools
import logging

logger = logging.getLogger("cryptotrace.resilient_fetch")


class BlockchainFetchError(Exception):
    pass


def resilient(fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            return fn(*args, **kwargs)
        except Exception as exc:
            logger.warning("Live fetch failed in %s: %s", fn.__name__, exc)
            raise BlockchainFetchError(f"Live data source unavailable ({fn.__name__}): {exc}") from exc
    return wrapper
