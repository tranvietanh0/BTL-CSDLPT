from app.services.inventoryservice import inventoryservice


def test_low_stock_summary_shape() -> None:
    rows = inventoryservice.lowstocksummary()
    assert isinstance(rows, list)
