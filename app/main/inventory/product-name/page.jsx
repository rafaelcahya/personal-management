import { getProductNameList } from "@/lib/services/inventory/product_name/getProductNameList";
import { requireAuth } from "@/lib/auth/utils";
import ProductNamesPageClient from "./ProductNamesPageClient";

export default async function ProductNamePage() {
    const user = await requireAuth();

    if (!user || !user.id) {
        throw new Error("User ID is missing after authentication");
    }

    const names = await getProductNameList(user.id);

    return <ProductNamesPageClient initialNames={names} />;
}
