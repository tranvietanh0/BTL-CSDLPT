from app.core.dbrouter import router


class CatalogService:
    def listproducts(self) -> list[dict]:
        query = """
        SELECT p.sku, p.name, p.category_code, c.name AS category_name, p.price
        FROM products p
        JOIN categories c ON c.category_code = p.category_code
        ORDER BY p.sku
        """
        return router.executequery("north", query)

    def getproduct(self, sku: str) -> dict | None:
        query = """
        SELECT p.sku, p.name, p.category_code, c.name AS category_name, p.price
        FROM products p
        JOIN categories c ON c.category_code = p.category_code
        WHERE p.sku = %(sku)s
        """
        return router.executequery("north", query, {"sku": sku}, fetch="one")

    def listcategories(self) -> list[dict]:
        query = "SELECT category_code, name, description FROM categories ORDER BY category_code"
        return router.executequery("north", query)


catalogservice = CatalogService()
