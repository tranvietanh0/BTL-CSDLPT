from fastapi import APIRouter

from app.models.schemas import MultiWarehouseOrderRow, RevenueRow, TopProductRow
from app.services.reportservice import reportservice

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get("/revenue-by-site", response_model=list[RevenueRow])
def revenuebysite() -> list[dict]:
    return reportservice.revenuebysite()


@router.get("/top-products", response_model=list[TopProductRow])
def topproducts() -> list[dict]:
    return reportservice.topproducts()


@router.get("/multi-warehouse-orders", response_model=list[MultiWarehouseOrderRow])
def multiwarehouseorders() -> list[dict]:
    return reportservice.multiwarehouseorders()
