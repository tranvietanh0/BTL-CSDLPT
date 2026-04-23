from pathlib import Path

from fastapi import APIRouter

from app.core.dbrouter import router

routerapi = APIRouter(prefix="/demo", tags=["Demo"])

BASE_DIR = Path(__file__).resolve().parents[2]
SQL_DIR = BASE_DIR / "sql"


@routerapi.get("/health/distributed")
def healthdistributed() -> list[dict]:
    return router.healthcheck()


@routerapi.post("/reset")
def resetdatabases() -> dict:
    for site_code in ("north", "central", "south"):
        folder_name = {"north": "site1", "central": "site2", "south": "site3"}[site_code]
        router.executescript(site_code, SQL_DIR / folder_name / "01-schema.sql")
    return {"status": "ok"}


@routerapi.post("/seed")
def seeddatabases() -> dict:
    for site_code in ("north", "central", "south"):
        folder_name = {"north": "site1", "central": "site2", "south": "site3"}[site_code]
        router.executescript(site_code, SQL_DIR / folder_name / "01-schema.sql")
        router.executescript(site_code, SQL_DIR / folder_name / "02-seed.sql")
    return {"status": "ok"}
