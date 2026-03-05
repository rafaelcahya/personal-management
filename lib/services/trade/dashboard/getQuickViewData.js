import { getTradeList } from "../getTradeList";
import { getEventList } from "../../event/getEventList";
import { getFeeList } from "../../fee/getFeeList";

export async function getQuickViewData(userId, limit = 5) {
    try {
        const [allTrades, allEvents, allFees] = await Promise.all([
            getTradeList(userId),
            getEventList(userId),
            getFeeList(userId),
        ]);

        const trades = allTrades.slice(0, limit);
        const events = allEvents.slice(0, limit);
        const fees = allFees.slice(0, limit);

        return {
            trades,
            events,
            fees,
        };
    } catch (error) {
        console.error("Failed to fetch quick view data:", error);
        throw new Error("Failed to fetch quick view data");
    }
}
