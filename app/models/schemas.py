from datetime import datetime
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, Field


RegionCode = Literal["north", "central", "south"]


class SiteHealth(BaseModel):
    site_code: str
    site_name: str
    is_healthy: bool
    database_name: str | None = None
    checked_at: str | None = None
    error: str | None = None


class ProductSummary(BaseModel):
    sku: str
    name: str
    category_code: str
    category_name: str
    price: Decimal


class InventoryItem(BaseModel):
    site_code: str
    warehouse_code: str
    warehouse_name: str
    city: str
    available_qty: int
    reserved_qty: int
    reorder_level: int


class InventoryLookupResponse(BaseModel):
    sku: str
    product_name: str
    total_available_qty: int
    total_reserved_qty: int
    items: list[InventoryItem]


class FulfillmentAllocation(BaseModel):
    site_code: str
    warehouse_code: str
    warehouse_name: str
    allocated_qty: int
    available_before: int


class FulfillmentQuoteRequest(BaseModel):
    sku: str = Field(min_length=1)
    quantity: int = Field(gt=0)
    customer_region: RegionCode


class FulfillmentQuoteResponse(BaseModel):
    sku: str
    requested_qty: int
    customer_region: RegionCode
    is_fulfillable: bool
    shortfall_qty: int
    allocations: list[FulfillmentAllocation]


class OrderCreateRequest(BaseModel):
    customer_code: str = Field(min_length=1)
    sku: str = Field(min_length=1)
    quantity: int = Field(gt=0)
    customer_region: RegionCode


class OrderCreateResponse(BaseModel):
    order_code: str
    status: str
    primary_site_code: str
    total_amount: Decimal
    allocations: list[FulfillmentAllocation]


class OrderAllocationRow(BaseModel):
    order_code: str
    sku: str
    site_code: str
    warehouse_code: str
    allocated_qty: int
    action: str
    created_at: datetime


class OrderDetailResponse(BaseModel):
    order_code: str
    customer_code: str
    primary_site_code: str
    primary_warehouse_code: str
    status: str
    total_amount: Decimal
    created_at: datetime
    allocations: list[OrderAllocationRow]


class RevenueRow(BaseModel):
    site_code: str
    order_count: int
    revenue: Decimal


class TopProductRow(BaseModel):
    sku: str
    product_name: str
    total_sold_qty: int
    total_revenue: Decimal


class MultiWarehouseOrderRow(BaseModel):
    order_code: str
    primary_site_code: str
    distinct_warehouses: int
    total_allocated_qty: int


class ConcurrencyDemoRequest(BaseModel):
    sku: str = Field(min_length=1)
    quantity_per_order: int = Field(gt=0)
    customer_region: RegionCode
    customer_codes: list[str] = Field(min_length=2, max_length=2)


class ConcurrencyAttemptResult(BaseModel):
    customer_code: str
    is_success: bool
    order_code: str | None = None
    error: str | None = None


class ConcurrencyDemoResponse(BaseModel):
    sku: str
    quantity_per_order: int
    results: list[ConcurrencyAttemptResult]
    inventory_after: InventoryLookupResponse
