import { getProductNameList } from "@/lib/services/inventory/product/name/getProductNameList";
import ProductNamesPageClient from "./ProductNamesPageClient";

export default async function ProductNamePage() {
    const names = await getProductNameList();

    return <ProductNamesPageClient initialNames={names} />;
}
