import { getProductHistoryList } from "@/lib/services/inventory/product/history/getProductHistoryList";
import ProductHistoryPageClient from "./ProductHistoryPageClient";

export default async function ProductHistoryPage() {
    const history = await getProductHistoryList();

    return <ProductHistoryPageClient initialHistory={history} />;
}
