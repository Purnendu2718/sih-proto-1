import os


def is_air_gapped() -> bool:
    return os.environ.get("AIR_GAPPED_MODE", "false").lower() == "true"


def require_online(feature_name: str):
    if is_air_gapped():
        raise RuntimeError(
            f"'{feature_name}' requires outbound network access, disabled because "
            f"AIR_GAPPED_MODE=true. Use data_mode='mock' or a pre-imported case file instead."
        )
