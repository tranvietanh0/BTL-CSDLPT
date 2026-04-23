from app.services.inventoryservice import inventoryservice


def test_quote_split_allocation() -> None:
    quote = inventoryservice.quotefulfillment("LAP-01", 10, "north")
    assert quote["is_fulfillable"] is True
    assert quote["shortfall_qty"] == 0
    assert sum(item["allocated_qty"] for item in quote["allocations"]) == 10
