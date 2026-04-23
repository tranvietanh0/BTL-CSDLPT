from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.catalogapi import router as catalogrouter
from app.api.demoapi import routerapi as demorouter
from app.api.inventoryapi import router as inventoryrouter
from app.api.ordersapi import router as ordersrouter
from app.api.reportsapi import router as reportsrouter
from app.core.config import settings

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description="Demo CSDL phân tán cho hệ thống bán hàng trực tuyến đa kho với 3 site PostgreSQL.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(catalogrouter)
app.include_router(inventoryrouter)
app.include_router(ordersrouter)
app.include_router(reportsrouter)
app.include_router(demorouter)


@app.get("/")
def root() -> dict:
    return {
        "message": "Distributed Warehouse Demo",
        "docs": "/docs",
        "openapi": "/openapi.json",
    }
