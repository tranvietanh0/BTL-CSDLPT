from fastapi import APIRouter, HTTPException

from app.models.schemas import ProductSummary
from app.services.catalogservice import catalogservice

router = APIRouter(prefix="/catalog", tags=["Catalog"])


@router.get("/products", response_model=list[ProductSummary])
def listproducts() -> list[dict]:
    return catalogservice.listproducts()


@router.get("/products/{sku}", response_model=ProductSummary)
def getproduct(sku: str) -> dict:
    product = catalogservice.getproduct(sku)
    if product is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")
    return product


@router.get("/categories")
def listcategories() -> list[dict]:
    return catalogservice.listcategories()
