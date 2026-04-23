from app.services.inventoryservice import inventoryservice


def test_quote_uses_multiple_sites() -> None:
    quote = inventoryservice.quotefulfillment("LAP-01", 10, "north")
    site_codes = {item["site_code"] for item in quote["allocations"]}
    assert site_codes == {"north", "south"}
