import { getProductNameList } from "@/lib/services/inventory/product/name/getProductNameList";
import { requireAuth } from "@/lib/auth/utils";
import ProductNamesPageClient from "./ProductNamesPageClient";

export default async function ProductNamePage() {
    await requireAuth();

    const names = await getProductNameList();

    return <ProductNamesPageClient initialNames={names} />;
}
