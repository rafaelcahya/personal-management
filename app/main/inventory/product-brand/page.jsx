import { getProductBrandList } from "@/lib/services/inventory/product/brand/getProductBrandList";
import { requireAuth } from "@/lib/auth/utils";
import ProductBrandsPageClient from "./ProductBrandsPageClient";

export default async function ProductBrandPage() {
    const user = await requireAuth();

    if (!user || !user.id) {
        throw new Error("User ID is missing after authentication");
    }
    
    const brands = await getProductBrandList(user.id);

    return <ProductBrandsPageClient initialBrands={brands} />;
}
