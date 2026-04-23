from app.core.dbrouter import router
from app.core.siteregistry import allsites, sitepriorityforregion


class InventoryService:
    def getglobalinventory(self, sku: str) -> dict:
        product = router.executequery(
            "north",
            "SELECT sku, name FROM products WHERE sku = %(sku)s",
            {"sku": sku},
            fetch="one",
        )
        if product is None:
            raise ValueError("Không tìm thấy sản phẩm")

        items: list[dict] = []
        total_available_qty = 0
        total_reserved_qty = 0
        query = """
        SELECT w.site_code, w.warehouse_code, w.warehouse_name, w.city,
               i.available_qty, i.reserved_qty, i.reorder_level
        FROM inventory i
        JOIN warehouses w ON w.warehouse_code = i.warehouse_code
        WHERE i.sku = %(sku)s
        ORDER BY w.site_code
        """
        for site in allsites():
            rows = router.executequery(site.code, query, {"sku": sku})
            for row in rows:
                items.append(row)
                total_available_qty += row["available_qty"]
                total_reserved_qty += row["reserved_qty"]

        return {
            "sku": product["sku"],
            "product_name": product["name"],
            "total_available_qty": total_available_qty,
            "total_reserved_qty": total_reserved_qty,
            "items": items,
        }

    def quotefulfillment(self, sku: str, quantity: int, customer_region: str) -> dict:
        requested_qty = quantity
        allocations: list[dict] = []
        for site in sitepriorityforregion(customer_region):
            row = router.executequery(
                site.code,
                """
                SELECT w.site_code, w.warehouse_code, w.warehouse_name, i.available_qty
                FROM inventory i
                JOIN warehouses w ON w.warehouse_code = i.warehouse_code
                WHERE i.sku = %(sku)s AND i.available_qty > 0
                ORDER BY i.available_qty DESC
                LIMIT 1
                """,
                {"sku": sku},
                fetch="one",
            )
            if row is None:
                continue
            allocated_qty = min(requested_qty, row["available_qty"])
            if allocated_qty <= 0:
                continue
            allocations.append(
                {
                    "site_code": row["site_code"],
                    "warehouse_code": row["warehouse_code"],
                    "warehouse_name": row["warehouse_name"],
                    "allocated_qty": allocated_qty,
                    "available_before": row["available_qty"],
                }
            )
            requested_qty -= allocated_qty
            if requested_qty == 0:
                break

        return {
            "sku": sku,
            "requested_qty": quantity,
            "customer_region": customer_region,
            "is_fulfillable": requested_qty == 0,
            "shortfall_qty": requested_qty,
            "allocations": allocations,
        }

    def lowstocksummary(self) -> list[dict]:
        rows: list[dict] = []
        query = """
        SELECT w.site_code, w.warehouse_code, i.sku, p.name AS product_name,
               i.available_qty, i.reorder_level
        FROM inventory i
        JOIN warehouses w ON w.warehouse_code = i.warehouse_code
        JOIN products p ON p.sku = i.sku
        WHERE i.available_qty <= i.reorder_level
        ORDER BY w.site_code, i.available_qty, i.sku
        """
        for site in allsites():
            rows.extend(router.executequery(site.code, query))
        return rows


inventoryservice = InventoryService()
