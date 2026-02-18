import { getSingleTradeFromDb } from "@/lib/db/trade/getSingleTradeFromDb";

export async function getSingleTrade(userId, tradeId) {
    if (!userId) {
        throw new Error("User ID is required");
    }

    if (!tradeId) {
        throw new Error("Trade ID is required");
    }

    const result = await getSingleTradeFromDb(userId, tradeId);

    return result;
}
