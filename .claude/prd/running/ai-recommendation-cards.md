### 11.5 AI Recommendation Cards

There are 6 AI cards on the Analytics page, each placed below its corresponding chart. Plus 1 "Analysis History" button in the page header that opens a modal with the full analysis history.

**6 AI card slots:**

- Weekly Distance
- Pace Trend
- Training Load (ACWR)
- VO2max Trend
- EF Trend
- Race Predictor

**UI states per card:**

- **Loading:** violet skeleton on initial load
- **Pending:** polling every 8 seconds, max 2 minutes. Copy rotates: "Reading trends…" → "Analysing patterns…" → "Writing recommendations…"
- **Completed:** show headline + body_markdown. Generation date in the top right.
- **Error:** "Analysis unavailable" (muted), with a retry link
- **Empty:** "No analysis yet. Your next activity will be analysed automatically."
- **Stale badge:** if `insight.created_at` is older than the latest activity → show "Before last run" badge

**History modal:** base `<Modal>` / `<Sheet>` from `@/components/base/Modal/Modal` and `@/components/base/Sheet/Sheet`, lists all `rt_ai_insights` with `insight_type = 'analytics_summary'`, sorted newest first, grouped by month. Each entry: date, section coverage, expandable to see full content.

**Phase 1 (initial):** Weekly Distance, Pace Trend, Training Load + staleness check logic
**Phase 2:** VO2max Trend, EF Trend, Race Predictor + history modal

---
