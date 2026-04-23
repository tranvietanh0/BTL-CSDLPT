from contextlib import contextmanager
from pathlib import Path
from typing import Any, Iterator

import psycopg
from psycopg.rows import dict_row

from app.core.siteregistry import allsites, getsite


class DatabaseRouter:
    def __init__(self) -> None:
        self.sites = {site.code: site for site in allsites()}

    @contextmanager
    def connection(self, site_code: str, autocommit: bool = False) -> Iterator[psycopg.Connection]:
        site = getsite(site_code)
        with psycopg.connect(site.dsn, row_factory=dict_row, autocommit=autocommit) as connection:
            yield connection

    def healthcheck(self) -> list[dict[str, Any]]:
        statuses: list[dict[str, Any]] = []
        for site in allsites():
            try:
                with self.connection(site.code, autocommit=True) as connection:
                    with connection.cursor() as cursor:
                        cursor.execute("SELECT current_database() AS database_name, now() AS checked_at")
                        payload = cursor.fetchone()
                statuses.append(
                    {
                        "site_code": site.code,
                        "site_name": site.name,
                        "is_healthy": True,
                        "database_name": payload["database_name"],
                        "checked_at": payload["checked_at"].isoformat(),
                    }
                )
            except Exception as error:  # noqa: BLE001
                statuses.append(
                    {
                        "site_code": site.code,
                        "site_name": site.name,
                        "is_healthy": False,
                        "database_name": None,
                        "checked_at": None,
                        "error": str(error),
                    }
                )
        return statuses

    def executescript(self, site_code: str, script_path: Path) -> None:
        sql = script_path.read_text(encoding="utf-8")
        with self.connection(site_code, autocommit=True) as connection:
            with connection.cursor() as cursor:
                cursor.execute(sql)

    def executequery(
        self,
        site_code: str,
        query: str,
        params: dict[str, Any] | tuple[Any, ...] | None = None,
        *,
        fetch: str = "all",
        connection: psycopg.Connection | None = None,
    ) -> Any:
        if connection is not None:
            with connection.cursor() as cursor:
                cursor.execute(query, params)
                return self._readresult(cursor, fetch)

        with self.connection(site_code) as owned_connection:
            with owned_connection.cursor() as cursor:
                cursor.execute(query, params)
                return self._readresult(cursor, fetch)

    @staticmethod
    def _readresult(cursor: psycopg.Cursor, fetch: str) -> Any:
        if cursor.description is None:
            return None
        if fetch == "one":
            return cursor.fetchone()
        if fetch == "value":
            row = cursor.fetchone()
            return next(iter(row.values())) if row else None
        return cursor.fetchall()


router = DatabaseRouter()
