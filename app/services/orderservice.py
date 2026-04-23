from concurrent.futures import ThreadPoolExecutor
from decimal import Decimal

import psycopg
from psycopg.rows import dict_row

from app.core.dbrouter import router
from app.services.catalogservice import catalogservice
from app.services.inventoryservice import inventoryservice
from app.services.transactioncoordinator import Reservation, transactioncoordinator


class OrderService:
    def createorder(self, customer_code: str, sku: str, quantity: int, customer_region: str) -> dict:
        customer = self._findcustomer(customer_code)
        if customer is None:
            raise ValueError("Không tìm thấy khách hàng")
        if customer["region_code"] != customer_region:
            raise ValueError("Khu vực khách hàng không khớp dữ liệu đã lưu")

        product = catalogservice.getproduct(sku)
        if product is None:
            raise ValueError("Không tìm thấy sản phẩm")

        quote = inventoryservice.quotefulfillment(sku, quantity, customer_region)
        if not quote["is_fulfillable"]:
            raise ValueError("Tồn kho toàn hệ thống không đủ")

        primary_site_code = quote["allocations"][0]["site_code"]
        primary_warehouse_code = quote["allocations"][0]["warehouse_code"]
        order_code = transactioncoordinator.newrequestcode("ORD")
        request_code = transactioncoordinator.newrequestcode("REQ")
        total_amount = Decimal(str(product["price"])) * quantity

        owned_connections: dict[str, psycopg.Connection] = {}
        reservations: list[Reservation] = []
        try:
            for allocation in quote["allocations"]:
                site_code = allocation["site_code"]
                if site_code not in owned_connections:
                    owned_connections[site_code] = psycopg.connect(router.sites[site_code].dsn, row_factory=dict_row)
                connection = owned_connections[site_code]
                reservation = transactioncoordinator.reserveallocation(
                    site_code=site_code,
                    warehouse_code=allocation["warehouse_code"],
                    sku=sku,
                    quantity=allocation["allocated_qty"],
                    request_code=request_code,
                    connection=connection,
                )
                reservations.append(reservation)

            primary_connection = owned_connections[primary_site_code]
            router.executequery(
                primary_site_code,
                """
                INSERT INTO orders (order_code, customer_code, primary_site_code, primary_warehouse_code, status, total_amount)
                VALUES (%(order_code)s, %(customer_code)s, %(primary_site_code)s, %(primary_warehouse_code)s, 'completed', %(total_amount)s)
                """,
                {
                    "order_code": order_code,
                    "customer_code": customer_code,
                    "primary_site_code": primary_site_code,
                    "primary_warehouse_code": primary_warehouse_code,
                    "total_amount": total_amount,
                },
                connection=primary_connection,
            )
            router.executequery(
                primary_site_code,
                """
                INSERT INTO order_items (order_code, sku, quantity, unit_price, line_total)
                VALUES (%(order_code)s, %(sku)s, %(quantity)s, %(unit_price)s, %(line_total)s)
                """,
                {
                    "order_code": order_code,
                    "sku": sku,
                    "quantity": quantity,
                    "unit_price": product["price"],
                    "line_total": total_amount,
                },
                connection=primary_connection,
            )

            for reservation in reservations:
                transactioncoordinator.commitreservation(order_code, reservation, owned_connections[reservation.site_code])

            for connection in owned_connections.values():
                connection.commit()
        except Exception:  # noqa: BLE001
            for reservation in reversed(reservations):
                connection = owned_connections.get(reservation.site_code)
                if connection is None:
                    continue
                try:
                    transactioncoordinator.releasereservation(reservation, request_code, connection)
                except Exception:  # noqa: BLE001
                    connection.rollback()
            for connection in owned_connections.values():
                connection.rollback()
            raise
        finally:
            for connection in owned_connections.values():
                connection.close()

        return {
            "order_code": order_code,
            "status": "completed",
            "primary_site_code": primary_site_code,
            "total_amount": total_amount,
            "allocations": quote["allocations"],
        }

    def getorderdetail(self, order_code: str) -> dict | None:
        order = None
        for site_code in ("north", "central", "south"):
            order = router.executequery(
                site_code,
                """
                SELECT order_code, customer_code, primary_site_code, primary_warehouse_code, status, total_amount, created_at
                FROM orders
                WHERE order_code = %(order_code)s
                """,
                {"order_code": order_code},
                fetch="one",
            )
            if order is not None:
                break
        if order is None:
            return None

        allocations: list[dict] = []
        for site_code in ("north", "central", "south"):
            allocations.extend(
                router.executequery(
                    site_code,
                    """
                    SELECT order_code, sku, site_code, warehouse_code, allocated_qty, action, created_at
                    FROM allocation_logs
                    WHERE order_code = %(order_code)s
                    ORDER BY created_at
                    """,
                    {"order_code": order_code},
                )
            )
        order["allocations"] = allocations
        return order

    def runconcurrencydemo(self, sku: str, quantity_per_order: int, customer_region: str, customer_codes: list[str]) -> dict:
        def submit(customer_code: str) -> dict:
            try:
                result = self.createorder(customer_code, sku, quantity_per_order, customer_region)
                return {"customer_code": customer_code, "is_success": True, "order_code": result["order_code"], "error": None}
            except Exception as error:  # noqa: BLE001
                return {"customer_code": customer_code, "is_success": False, "order_code": None, "error": str(error)}

        with ThreadPoolExecutor(max_workers=2) as executor:
            results = list(executor.map(submit, customer_codes))

        inventory_after = inventoryservice.getglobalinventory(sku)
        return {
            "sku": sku,
            "quantity_per_order": quantity_per_order,
            "results": results,
            "inventory_after": inventory_after,
        }

    def _findcustomer(self, customer_code: str) -> dict | None:
        prefix = customer_code.split("-")[1].lower()
        site_code = {"n": "north", "c": "central", "s": "south"}.get(prefix)
        if site_code is None:
            return None
        return router.executequery(
            site_code,
            "SELECT customer_code, full_name, region_code FROM customers WHERE customer_code = %(customer_code)s",
            {"customer_code": customer_code},
            fetch="one",
        )


orderservice = OrderService()
