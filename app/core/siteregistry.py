from dataclasses import dataclass

from app.core.config import settings


@dataclass(frozen=True)
class SiteDefinition:
    code: str
    name: str
    region: str
    dsn: str
    priority: int


SITE_DEFINITIONS = {
    "north": SiteDefinition(
        code="north",
        name="Kho miền Bắc",
        region="north",
        dsn=settings.site1_dsn,
        priority=1,
    ),
    "central": SiteDefinition(
        code="central",
        name="Kho miền Trung",
        region="central",
        dsn=settings.site2_dsn,
        priority=2,
    ),
    "south": SiteDefinition(
        code="south",
        name="Kho miền Nam",
        region="south",
        dsn=settings.site3_dsn,
        priority=3,
    ),
}

REGION_ORDER = {
    "north": ["north", "central", "south"],
    "central": ["central", "north", "south"],
    "south": ["south", "central", "north"],
}


def getsite(site_code: str) -> SiteDefinition:
    return SITE_DEFINITIONS[site_code]


def allsites() -> list[SiteDefinition]:
    return list(SITE_DEFINITIONS.values())


def sitepriorityforregion(region: str) -> list[SiteDefinition]:
    order = REGION_ORDER.get(region, ["north", "central", "south"])
    return [SITE_DEFINITIONS[site_code] for site_code in order]
