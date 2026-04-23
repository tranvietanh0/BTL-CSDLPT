from collections import defaultdict
from decimal import Decimal

from app.core.dbrouter import router
from app.core.siteregistry import allsites


class ReportService:
    def revenuebysite(self) -> list[dict]:
        rows: list[dict] = []
        query = """
        SELECT %(site_code)s AS site_code,
               COUNT(*)::int AS order_count,
               COALESCE(SUM(total_amount), 0)::numeric AS revenue
        FROM orders
        WHERE status = 'completed'
        """
        for site in allsites():
            row = router.executequery(site.code, query, {"site_code": site.code}, fetch="one")
            rows.append(row)

        total_orders = sum(row["order_count"] for row in rows)
        total_revenue = sum(Decimal(str(row["revenue"])) for row in rows)
        rows.append({"site_code": "all", "order_count": total_orders, "revenue": total_revenue})
        return rows

    def topproducts(self) -> list[dict]:
        combined: dict[str, dict] = defaultdict(lambda: {"sku": "", "product_name": "", "total_sold_qty": 0, "total_revenue": Decimal("0")})
        query = """
        SELECT oi.sku,
               p.name AS product_name,
               SUM(oi.quantity)::int AS total_sold_qty,
               SUM(oi.line_total)::numeric AS total_revenue
        FROM order_items oi
        JOIN products p ON p.sku = oi.sku
        GROUP BY oi.sku, p.name
        """
        for site in allsites():
            for row in router.executequery(site.code, query):
                bucket = combined[row["sku"]]
                bucket["sku"] = row["sku"]
                bucket["product_name"] = row["product_name"]
                bucket["total_sold_qty"] += row["total_sold_qty"]
                bucket["total_revenue"] += Decimal(str(row["total_revenue"]))

        result = list(combined.values())
        result.sort(key=lambda row: (-row["total_sold_qty"], row["sku"]))
        return result[:5]

    def multiwarehouseorders(self) -> list[dict]:
        results: list[dict] = []
        query = """
        SELECT order_code,
               MAX(site_code) AS primary_site_code,
               COUNT(DISTINCT warehouse_code)::int AS distinct_warehouses,
               SUM(allocated_qty)::int AS total_allocated_qty
        FROM allocation_logs
        WHERE action = 'commit'
        GROUP BY order_code
        HAVING COUNT(DISTINCT warehouse_code) > 1
        ORDER BY order_code
        """
        for site in allsites():
            results.extend(router.executequery(site.code, query))
        return results


reportservice = ReportService()
