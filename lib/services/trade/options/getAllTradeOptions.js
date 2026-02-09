import { getStockTypeOptions } from "./getStockTypeOptions";
import { getEntrySessionOptions } from "./getEntrySessionOptions";
import { getEntryOccasionOptions } from "./getEntryOccasionOptions";
import { getBuyReasonOptions } from "./getBuyReasonOptions";
import { getSellReasonOptions } from "./getSellReasonOptions";

export async function getAllTradeOptions() {
    try {
        const [stockType, entrySession, entryOccasion, buyReason, sellReason] =
            await Promise.all([
                getStockTypeOptions(),
                getEntrySessionOptions(),
                getEntryOccasionOptions(),
                getBuyReasonOptions(),
                getSellReasonOptions(),
            ]);

        return {
            stockType,
            entrySession,
            entryOccasion,
            buyReason,
            sellReason,
        };
    } catch (error) {
        console.error("Failed to fetch all trade options:", error);
        throw new Error("Failed to fetch trade options");
    }
}
