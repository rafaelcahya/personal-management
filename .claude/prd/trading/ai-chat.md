#### 3.2.6 Trading AI Chat

**Description:** A floating chat interface powered by Claude Sonnet 4.6 that lets the user ask questions about their trading data in natural language. The AI has full context of the user's trades, fees, events, and settings.

**User Stories:**

> As a user, I want to chat with an AI about my trading data, so that I can get insights without manually computing metrics.

**AI Context Injected at Runtime:**

| Data          | Source                 | Limit           |
| ------------- | ---------------------- | --------------- |
| Trade list    | `trd_trade_list` table | Most recent 200 |
| Fee list      | `trd_fee_list` table   | Most recent 100 |
| Event list    | `trd_event_list` table | Most recent 50  |
| User settings | `trd_settings` table   | 1 row           |

**AI Capabilities:**

- Calculate win rate and trade counts from real data
- Analyze best and worst individual trades
- Compute total P/L, profit factor, and other metrics on demand
- Compare performance across time periods or tickers
- Suggest areas for improvement based on patterns
- Answer natural language questions about any part of the trading data

**AI Response Rules:**

- Answers only in English
- Uses only the injected data — never fabricates
- Formats currency as Rp (e.g., `+Rp 1,500,000`)
- Uses tables when comparing multiple trades or metrics
- When the user is in a losing streak, provides constructive analysis rather than only negative feedback

**Streaming:** Responses are streamed token-by-token to the frontend (streaming SSE/chunked transfer encoding).

**API Endpoint:**

| Method | Path              | Description                                 |
| ------ | ----------------- | ------------------------------------------- |
| POST   | `/api/trade-chat` | Send a message and stream Claude's response |

**Request body:**

```json
{
  "messages": [{ "role": "user", "content": "What is my win rate this year?" }]
}
```

**Response:** Streaming plain text — `Content-Type: text/plain; charset=utf-8`, `Transfer-Encoding: chunked`

**UI Behavior:**

- Floating chat button accessible from any trading page
- Message history maintained in local component state (not persisted to DB)
- Streaming indicator while AI is responding
- User can send follow-up messages within the same session

**Acceptance Criteria:**

```
GIVEN the user opens the AI chat
WHEN the user types a question about their trades and sends it
THEN the AI response streams in token by token

GIVEN the user asks "What is my win rate?"
WHEN the AI responds
THEN the answer includes the exact win rate computed from the user's real trade data

GIVEN the AI response includes a currency value
WHEN the response is rendered
THEN currency values are shown as Rp formatted (not USD)

GIVEN the user sends a follow-up message in the same session
WHEN the request is sent
THEN prior messages are included in the context so the AI maintains conversation continuity

GIVEN the user has no trades
WHEN the AI is asked about performance
THEN the AI acknowledges there is no data rather than making up numbers
```

---
