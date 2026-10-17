## 18. Non-functional Requirements

### Performance

- Dashboard load < 2 seconds
- Activity detail render < 1 second
- AI streaming: first token < 2 seconds
- Strava sync: background, non-blocking

### Security

- Strava tokens encrypted AES-256-GCM at rest (see section 17 for implementation details)
- HTTPS only, HSTS enabled
- All API keys in environment variables, never in code
- Session via Supabase SSR (httpOnly cookie)
- Strava token refresh + rotation on every call
- Personal data is not sent to AI as training data

### Reliability

- Graceful degradation when Strava API is down (serve last cached data)
- Retry with exponential backoff for all external calls
- Polling fallback when webhook is missed
- Daily encrypted DB backup
- Manual entry always works regardless of Strava connection status

---
