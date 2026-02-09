import { requireAuth } from "@/lib/auth/utils";
import { getTradeList } from "@/lib/services/trade/getTradeList";
import TradesPageClient from "./TradesPageClient";

export default async function TradesPage() {
    const user = await requireAuth();

    if (!user || !user.id) {
        throw new Error("User ID is missing after authentication");
    }

    const trades = await getTradeList(user.id);

    return <TradesPageClient initialTrades={trades} />;
}
