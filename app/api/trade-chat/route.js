import Anthropic from "@anthropic-ai/sdk";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export async function POST(req) {
    const { messages } = await req.json();

    const authClient = await createClient();
    const {
        data: { user },
    } = await authClient.auth.getUser();
    const userId = user?.id;

    const [
        { data: tradeList },
        { data: feeList },
        { data: eventList },
        { data: settings },
    ] = await Promise.all([
        supabase
            .from("trade_list")
            .select("trade_date,ticker,margin,proceeds,return_percent,realized_gain,entry_session_option,buy_reason_option,sell_reason_option,entry_occasion_option,stock_type_option,notes")
            .eq("user_id", userId)
            .is("deleted_at", null)
            .order("trade_date", { ascending: false })
            .limit(200),
        supabase
            .from("fee_list")
            .select("fee_name,fee,fee_date")
            .eq("user_id", userId)
            .is("deleted_at", null)
            .order("fee_date", { ascending: false })
            .limit(100),
        supabase
            .from("event_list")
            .select("event_description,impact_direction,event_date,is_favorite")
            .eq("user_id", userId)
            .is("deleted_at", null)
            .order("event_date", { ascending: false })
            .limit(50),
        supabase
            .from("settings")
            .select("initial_margin,bi_risk_free_rate,personal_risk_free_rate,margin_of_error")
            .eq("user_id", userId)
            .limit(1)
            .single(),
    ]);

    const systemPrompt = `You are an AI assistant for the Trading Management feature in a personal management app.
You help users analyze their stock trades, review performance, manage fees, and track market events.

Here is the user's current trading data:

## Trade List — ${tradeList?.length ?? 0} trades (most recent 200):
${JSON.stringify(tradeList)}

## Fee List — ${feeList?.length ?? 0} fees (most recent 100):
${JSON.stringify(feeList)}

## Event List — ${eventList?.length ?? 0} events (most recent 50):
${JSON.stringify(eventList)}

## User Settings:
${JSON.stringify(settings)}

Guidelines:
- Answer in clear, friendly English
- Provide actionable insights based on the user's real data only
- When discussing trades, mention specific tickers, dates, and P&L numbers from the data
- Calculate win rate, total realized gain/loss, and average trade metrics when relevant
- If the user has a losing streak or is underwater, offer constructive analysis
- Use tables when comparing multiple trades or metrics
- Never fabricate data — only use what is provided above
- Format currency values clearly (e.g., +Rp 1,500,000 or -Rp 250,000)`;

    const stream = await anthropic.messages.stream({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages,
    });

    const readableStream = new ReadableStream({
        async start(controller) {
            for await (const chunk of stream) {
                if (
                    chunk.type === "content_block_delta" &&
                    chunk.delta.type === "text_delta"
                ) {
                    controller.enqueue(
                        new TextEncoder().encode(chunk.delta.text),
                    );
                }
            }
            controller.close();
        },
    });

    return new Response(readableStream, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Transfer-Encoding": "chunked",
        },
    });
}
