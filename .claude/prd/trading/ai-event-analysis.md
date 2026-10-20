#### 3.2.7 Trading AI Event Analysis

**Description:** AI-powered analysis of one or more market events. Triggered from the event detail page (single event) or from the event list page (multi-event, when multiple events are selected). The analysis is streamed in real time, persisted after completion, and can be refreshed at any time. A full analysis history modal is also available.

**Route (UI entry points):**

- Event detail page (`/main/trading/event/:id`) — single event analysis
- Event list page (`/main/trading/event`) — multi-event analysis (multi-select)

**User Stories:**

> As a user, I want to analyze a single market event with AI, so that I can understand its likely impact on the market and my trades.

> As a user, I want to analyze multiple events together, so that I can understand combined market dynamics.

> As a user, I want to view past analyses, so that I can compare my previous interpretations over time.

**Analysis Types:**

| Type   | Trigger                                                        | Input                |
| ------ | -------------------------------------------------------------- | -------------------- |
| Single | "Analyze with AI" button on event detail page                  | One `event_id`       |
| Multi  | Bulk-select events on event list page, then "Analyze Selected" | Array of `event_ids` |

**Additional Context (optional):**

Both single and multi analyses accept an optional `additional_context` field (max 500 characters). The user can enter extra context not already in the event description — e.g., "market opened -1.2% today, rupiah weakened past 16.400".

**Content Gate:**

The Analyze button is disabled if the event has no description AND no additional context has been entered. For multi-analysis, at least one selected event must have a description.

**Daily Limit:**

- 50 analyses per day per user (resets at UTC midnight)
- If exceeded, the API returns HTTP 429 with a message to try again after midnight

**Persistence:**

- Each analysis is saved to the `trd_event_ai_analysis` table after the stream completes
- Before saving, the previous analysis for the same event (or same set of event IDs for multi) is soft-deleted
- The event detail page shows the latest cached analysis inline, without needing to re-run it

**Analysis History Modal:**

Accessible from the event list page. Shows the most recent 50 analyses (single and multi) across all events, in reverse chronological order. Each item shows: analysis type (Single/Multi), event title(s), and generated timestamp. Clicking an item shows the full markdown output.

**Streaming Behavior:**

- The POST endpoint streams the AI output as plain text chunks
- The UI renders the streamed markdown progressively using `ReactMarkdown`
- A pulsing cursor indicator shows that streaming is in progress
- If streaming fails mid-way, the error state shows with a Retry button

**UI States — Analysis Modal:**

| State     | Behavior                                                                          |
| --------- | --------------------------------------------------------------------------------- |
| Idle      | Shows event summary, optional context textarea, and Analyze button                |
| Streaming | Shows progressive markdown output, Analyzing... button (disabled), pulsing cursor |
| Complete  | Shows full result, timestamp, and Refresh button                                  |
| Error     | Shows error message and Retry button                                              |

**API Endpoints:**

| Method | Path                                           | Description                                  |
| ------ | ---------------------------------------------- | -------------------------------------------- |
| POST   | `/api/trade/v1/ai/event-analysis`              | Generate a new analysis (streaming response) |
| GET    | `/api/trade/v1/ai/event-analysis?event_id=:id` | Fetch cached analysis for an event           |
| GET    | `/api/trade/v1/ai/event-analysis/history`      | Fetch full analysis history (latest 50)      |

**Request body — single analysis:**

```json
{
  "event_id": 42,
  "additional_context": "Market opened -1.2% today"
}
```

**Request body — multi analysis:**

```json
{
  "event_ids": [42, 43, 44],
  "additional_context": "All three events happened within the same week"
}
```

**Response — POST:** Streaming plain text — `Content-Type: text/plain; charset=utf-8`, `Transfer-Encoding: chunked`. The response is the raw markdown text of the analysis.

**Response — GET (single event cached analysis):**

```json
{
  "data": {
    "single": {
      "id": 1,
      "analysis_type": "single",
      "model": "claude-sonnet-4-6",
      "output_md": "## Analysis\n...",
      "input_tokens": 1200,
      "output_tokens": 450,
      "cost_usd": 0.0021,
      "generated_at": "2026-06-17T10:30:00Z",
      "event_ids": null
    },
    "multi": [
      {
        "id": 2,
        "analysis_type": "multi",
        "event_ids": [42, 43],
        "generated_at": "2026-06-17T11:00:00Z"
      }
    ]
  },
  "message": "OK"
}
```

**Response — GET (history):**

```json
{
  "data": [
    {
      "id": 1,
      "analysis_type": "single",
      "event_id": 42,
      "event_title": "BI Rate Decision",
      "event_titles": [],
      "output_md": "## Analysis\n...",
      "generated_at": "2026-06-17T10:30:00Z"
    },
    {
      "id": 2,
      "analysis_type": "multi",
      "event_ids": [42, 43],
      "event_titles": ["BI Rate Decision", "USD/IDR spike"],
      "output_md": "## Combined Analysis\n...",
      "generated_at": "2026-06-17T11:00:00Z"
    }
  ],
  "message": "OK"
}
```

**Error Responses:**

| Code | Condition                                                                       |
| ---- | ------------------------------------------------------------------------------- |
| 400  | Validation failed (missing event_id / event_ids, no description and no context) |
| 401  | User not authenticated                                                          |
| 403  | Event not found or does not belong to the user                                  |
| 404  | Event not found (single analysis)                                               |
| 429  | Daily cap of 50 analyses exceeded                                               |
| 500  | Internal server error                                                           |

**Acceptance Criteria:**

```
GIVEN the user opens an event detail page with a description
WHEN the user clicks "Analyze with AI"
THEN the EventAnalysisModal opens showing the event summary and an optional context textarea

GIVEN the event has no description and the user has not entered additional context
WHEN the Analyze button is visible
THEN the Analyze button is disabled

GIVEN the user clicks Analyze with an event that has a description
WHEN the analysis starts
THEN the output streams in progressively with a pulsing cursor

GIVEN the stream completes successfully
WHEN the streaming ends
THEN the full markdown output is shown, a generated timestamp appears, and a Refresh button is visible

GIVEN the stream fails mid-way
WHEN the error is caught
THEN an error message and Retry button are shown

GIVEN the user has already run an analysis on this event
WHEN the event detail page loads
THEN the cached analysis is shown inline below the description without re-running

GIVEN the user clicks Refresh Analysis
WHEN the new analysis completes
THEN the previous analysis is soft-deleted and the new result is saved and displayed

GIVEN the user selects multiple events on the event list page and clicks "Analyze Selected"
WHEN the modal opens
THEN all selected events are listed and a multi-event analysis can be triggered

GIVEN the user has generated 50 analyses today
WHEN the user triggers another analysis
THEN the API returns 429 and the modal shows a toast error with a message about the daily limit

GIVEN the user opens the Analysis History modal
WHEN the modal loads
THEN the 50 most recent analyses are listed with type, event title(s), and timestamp

GIVEN the user clicks a history item
WHEN the detail view opens
THEN the full markdown output for that analysis is shown

GIVEN a multi-analysis references event ID 42
WHEN GET /api/trade/v1/ai/event-analysis?event_id=42 is called
THEN both the single analysis for event 42 and any multi-analyses containing event 42 are returned
```

---
