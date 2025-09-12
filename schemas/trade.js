import { z } from "zod";

export const tradeSchema = z.object({
	trade_date: z.date({ required_error: "Trade date is required" }),
	ticker: z.string().min(1, "Ticker cannot be empty"),
	margin: z.string().min(1, "Margin cannot be empty"),
	proceeds: z.string().min(1, "Proceeds cannot be empty"),
	return_percent: z.string(),
	realized_gain: z.string(),
	entry_session_option: z.string().min(1, "Entry Session is required"),
	entry_occasion_option: z.string().min(1, "Entry Occasion is required"),
	buy_reason_option: z.string().min(1, "Buy Reason is required"),
	sell_reason_option: z.string().min(1, "Sell Reason is required"),
	notes: z.string(),
});
