from pathlib import Path

import pytest

from app.core.dbrouter import router


@pytest.fixture(scope="session", autouse=True)
def seeddatabases() -> None:
    base = Path(__file__).resolve().parents[1] / "sql"
    for site_code, folder_name in (("north", "site1"), ("central", "site2"), ("south", "site3")):
        router.executescript(site_code, base / folder_name / "01-schema.sql")
        router.executescript(site_code, base / folder_name / "02-seed.sql")
