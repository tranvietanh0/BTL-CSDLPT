from fastapi import APIRouter, HTTPException

from app.models.schemas import FulfillmentQuoteRequest, FulfillmentQuoteResponse, InventoryLookupResponse
from app.services.inventoryservice import inventoryservice

router = APIRouter(prefix="/inventory", tags=["Inventory"])


@router.get("/{sku}/global", response_model=InventoryLookupResponse)
def getglobalinventory(sku: str) -> dict:
    try:
        return inventoryservice.getglobalinventory(sku)
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error


@router.post("/quote-fulfillment", response_model=FulfillmentQuoteResponse)
def quotefulfillment(payload: FulfillmentQuoteRequest) -> dict:
    return inventoryservice.quotefulfillment(payload.sku, payload.quantity, payload.customer_region)


@router.get("/low-stock")
def lowstocksummary() -> list[dict]:
    return inventoryservice.lowstocksummary()
