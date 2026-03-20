import { requireAuth } from "@/lib/auth/utils";
import ProductsPage from "./ProductsPage";

export default async function InventoryPage() {
    const user = await requireAuth();

    if (!user || !user.id) {
        throw new Error("User ID is missing after authentication");
    }

    return <ProductsPage />;
}
