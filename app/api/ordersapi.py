from fastapi import APIRouter, HTTPException

from app.models.schemas import ConcurrencyDemoRequest, ConcurrencyDemoResponse, OrderCreateRequest, OrderCreateResponse, OrderDetailResponse
from app.services.orderservice import orderservice

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("", response_model=OrderCreateResponse)
def createorder(payload: OrderCreateRequest) -> dict:
    try:
        return orderservice.createorder(payload.customer_code, payload.sku, payload.quantity, payload.customer_region)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@router.get("/{order_code}", response_model=OrderDetailResponse)
def getorderdetail(order_code: str) -> dict:
    order = orderservice.getorderdetail(order_code)
    if order is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy đơn hàng")
    return order


@router.post("/demo-concurrency", response_model=ConcurrencyDemoResponse)
def runconcurrencydemo(payload: ConcurrencyDemoRequest) -> dict:
    return orderservice.runconcurrencydemo(
        payload.sku,
        payload.quantity_per_order,
        payload.customer_region,
        payload.customer_codes,
    )
