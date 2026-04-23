from dataclasses import dataclass
from uuid import uuid4

import psycopg

from app.core.dbrouter import router


@dataclass
class Reservation:
    site_code: str
    warehouse_code: str
    sku: str
    allocated_qty: int
    available_before: int


class TransactionCoordinator:
    def reserveallocation(self, site_code: str, warehouse_code: str, sku: str, quantity: int, request_code: str, connection: psycopg.Connection) -> Reservation:
        row = router.executequery(
            site_code,
            """
            SELECT available_qty
            FROM inventory
            WHERE warehouse_code = %(warehouse_code)s AND sku = %(sku)s
            FOR UPDATE
            """,
            {"warehouse_code": warehouse_code, "sku": sku},
            fetch="one",
            connection=connection,
        )
        if row is None:
            raise ValueError(f"Không tìm thấy tồn kho tại {warehouse_code}")
        if row["available_qty"] < quantity:
            raise ValueError(f"Kho {warehouse_code} không đủ hàng")

        router.executequery(
            site_code,
            """
            UPDATE inventory
            SET available_qty = available_qty - %(quantity)s,
                reserved_qty = reserved_qty + %(quantity)s,
                updated_at = CURRENT_TIMESTAMP
            WHERE warehouse_code = %(warehouse_code)s AND sku = %(sku)s
            """,
            {"warehouse_code": warehouse_code, "sku": sku, "quantity": quantity},
            connection=connection,
        )
        router.executequery(
            site_code,
            """
            INSERT INTO inventory_audit (request_code, sku, warehouse_code, action, delta_available, delta_reserved)
            VALUES (%(request_code)s, %(sku)s, %(warehouse_code)s, 'reserve', %(delta_available)s, %(delta_reserved)s)
            """,
            {
                "request_code": request_code,
                "sku": sku,
                "warehouse_code": warehouse_code,
                "delta_available": -quantity,
                "delta_reserved": quantity,
            },
            connection=connection,
        )
        return Reservation(
            site_code=site_code,
            warehouse_code=warehouse_code,
            sku=sku,
            allocated_qty=quantity,
            available_before=row["available_qty"],
        )

    def commitreservation(self, order_code: str, reservation: Reservation, connection: psycopg.Connection) -> None:
        router.executequery(
            reservation.site_code,
            """
            UPDATE inventory
            SET reserved_qty = reserved_qty - %(quantity)s,
                updated_at = CURRENT_TIMESTAMP
            WHERE warehouse_code = %(warehouse_code)s AND sku = %(sku)s
            """,
            {
                "warehouse_code": reservation.warehouse_code,
                "sku": reservation.sku,
                "quantity": reservation.allocated_qty,
            },
            connection=connection,
        )
        router.executequery(
            reservation.site_code,
            """
            INSERT INTO allocation_logs (order_code, sku, site_code, warehouse_code, allocated_qty, action)
            VALUES (%(order_code)s, %(sku)s, %(site_code)s, %(warehouse_code)s, %(allocated_qty)s, 'commit')
            """,
            {
                "order_code": order_code,
                "sku": reservation.sku,
                "site_code": reservation.site_code,
                "warehouse_code": reservation.warehouse_code,
                "allocated_qty": reservation.allocated_qty,
            },
            connection=connection,
        )
        router.executequery(
            reservation.site_code,
            """
            INSERT INTO inventory_audit (request_code, sku, warehouse_code, action, delta_available, delta_reserved)
            VALUES (%(request_code)s, %(sku)s, %(warehouse_code)s, 'commit', 0, %(delta_reserved)s)
            """,
            {
                "request_code": order_code,
                "sku": reservation.sku,
                "warehouse_code": reservation.warehouse_code,
                "delta_reserved": -reservation.allocated_qty,
            },
            connection=connection,
        )

    def releasereservation(self, reservation: Reservation, request_code: str, connection: psycopg.Connection) -> None:
        router.executequery(
            reservation.site_code,
            """
            UPDATE inventory
            SET available_qty = available_qty + %(quantity)s,
                reserved_qty = reserved_qty - %(quantity)s,
                updated_at = CURRENT_TIMESTAMP
            WHERE warehouse_code = %(warehouse_code)s AND sku = %(sku)s
            """,
            {
                "warehouse_code": reservation.warehouse_code,
                "sku": reservation.sku,
                "quantity": reservation.allocated_qty,
            },
            connection=connection,
        )
        router.executequery(
            reservation.site_code,
            """
            INSERT INTO inventory_audit (request_code, sku, warehouse_code, action, delta_available, delta_reserved)
            VALUES (%(request_code)s, %(sku)s, %(warehouse_code)s, 'release', %(delta_available)s, %(delta_reserved)s)
            """,
            {
                "request_code": request_code,
                "sku": reservation.sku,
                "warehouse_code": reservation.warehouse_code,
                "delta_available": reservation.allocated_qty,
                "delta_reserved": -reservation.allocated_qty,
            },
            connection=connection,
        )

    @staticmethod
    def newrequestcode(prefix: str) -> str:
        return f"{prefix}-{uuid4().hex[:8].upper()}"


transactioncoordinator = TransactionCoordinator()
