import os
from dataclasses import dataclass
from functools import lru_cache

from dotenv import load_dotenv

load_dotenv()


@dataclass(frozen=True)
class Settings:
    app_name: str
    app_env: str
    api_host: str
    api_port: int
    site1_dsn: str
    site2_dsn: str
    site3_dsn: str


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings(
        app_name=os.getenv("APP_NAME", "Distributed Warehouse Demo"),
        app_env=os.getenv("APP_ENV", "development"),
        api_host=os.getenv("API_HOST", "0.0.0.0"),
        api_port=int(os.getenv("API_PORT", "8000")),
        site1_dsn=os.getenv("SITE1_DSN", "postgresql://postgres:postgres@localhost:5433/warehouse_north"),
        site2_dsn=os.getenv("SITE2_DSN", "postgresql://postgres:postgres@localhost:5434/warehouse_central"),
        site3_dsn=os.getenv("SITE3_DSN", "postgresql://postgres:postgres@localhost:5435/warehouse_south"),
    )


settings = get_settings()
