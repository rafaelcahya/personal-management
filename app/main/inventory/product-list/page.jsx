import { getProductList } from "@/lib/services/inventory/product/getProductList";
import { requireAuth } from "@/lib/auth/utils";
import ProductsPage from "./ProductsPage";

export default async function InventoryPage() {
    const user = await requireAuth();

    if (!user || !user.id) {
        throw new Error("User ID is missing after authentication");
    }

    const products = await getProductList(user.id);

    return <ProductsPage initialProducts={products} />;
}
