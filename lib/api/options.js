import { toast } from "sonner";

export async function fetchTradeOptions() {
    try {
        const [stockRes, sessionRes, occasionRes, buyRes, sellRes] =
            await Promise.all([
                fetch("/api/options/stock-type"),
                fetch("/api/options/entry-session"),
                fetch("/api/options/entry-occasion"),
                fetch("/api/options/buy-reason"),
                fetch("/api/options/sell-reason"),
            ]);

        const [stock, session, occasion, buy, sell] = await Promise.all([
            stockRes.json(),
            sessionRes.json(),
            occasionRes.json(),
            buyRes.json(),
            sellRes.json(),
        ]);

        return {
            stockType: stock?.option ?? [],
            entrySession: session?.option ?? [],
            entryOccasion: occasion?.option ?? [],
            buyReason: buy?.option ?? [],
            sellReason: sell?.option ?? [],
        };
    } catch (error) {
        toast.error("Failed to fetch trade options:", error);
        return {
            stockType: [],
            entrySession: [],
            entryOccasion: [],
            buyReason: [],
            sellReason: [],
        };
    }
}
