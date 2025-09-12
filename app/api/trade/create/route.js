import { getCreateTrade } from "@/lib/services/trade/getCreateTrade";

export async function POST(req) {
    try {
        const body = await req.json();
        const newTrade = await getCreateTrade(
            body.trade_date,
            body.ticker,
            body.margin,
            body.proceeds,
            body.return_percent,
            body.realized_gain,
            body.entry_session_option,
            body.entry_occasion_option,
            body.sell_reason_option,
            body.buy_reason_option,
            body.notes
        );

        return new Response(
            JSON.stringify({ success: true, trade: newTrade }),
            {
                status: 200,
            }
        );
    } catch (err) {
        return new Response(
            JSON.stringify({ success: false, error: err.message }),
            {
                status: 500,
            }
        );
    }
}
