import { getProductBrandList } from "@/lib/services/inventory/product/brand/getProductBrandList";
import ProductBrandsPageClient from "./ProductBrandsPageClient";

export default async function ProductBrandPage() {
    const brands = await getProductBrandList();

    return <ProductBrandsPageClient initialBrands={brands} />;
}
