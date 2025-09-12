import { toast } from "sonner";

export async function fetchTradeOptions() {
    try {
        const [sessionRes, occasionRes, buyRes, sellRes] = await Promise.all([
            fetch("/api/options/entry-session"),
            fetch("/api/options/entry-occasion"),
            fetch("/api/options/buy-reason"),
            fetch("/api/options/sell-reason"),
        ]);

        const [session, occasion, buy, sell] = await Promise.all([
            sessionRes.json(),
            occasionRes.json(),
            buyRes.json(),
            sellRes.json(),
        ]);

        return {
            entrySession: session?.entrySessionOptions ?? [],
            entryOccasion: occasion?.entryOccasionOptions ?? [],
            buyReason: buy?.buyReasonOptions ?? [],
            sellReason: sell?.sellReasonOptions ?? [],
        };
    } catch (error) {
        toast.error("❌ Failed to fetch trade options:", error);
        return {
            entrySession: [],
            entryOccasion: [],
            buyReason: [],
            sellReason: [],
        };
    }
}
