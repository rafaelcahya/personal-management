import { getProductList } from "@/lib/services/inventory/product/getProductList";
import ProductsPage from "./ProductsPage";

export default async function InventoryPage() {
    const products = await getProductList();

    return <ProductsPage initialProducts={products} />;
}
