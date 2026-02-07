import { getProductHistoryList } from "@/lib/services/inventory/product/history/getProductHistoryList";
import { requireAuth } from "@/lib/auth/utils";
import ProductHistoryPageClient from "./ProductHistoryPageClient";

export default async function ProductHistoryPage() {
    const user = await requireAuth();

    if (!user || !user.id) {
        throw new Error("User ID is missing after authentication");
    }

    const history = await getProductHistoryList(user.id);

    return <ProductHistoryPageClient initialHistory={history} />;
}
