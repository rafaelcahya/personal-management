## 10.11 Injury & Sports Medicine AI Coach

### Overview

When you're dealing with soreness, a niggle, or something that doesn't feel right, you shouldn't have to leave the app to figure out what to do. This feature adds two new AI personas to the existing coach system — a Sports Physiotherapist and a Sports Medicine Physician — so you can ask body-related questions with proper context from your training data.

Both roles give you grounded, evidence-based answers. Neither one diagnoses you or prescribes anything. If something sounds serious, they tell you to see a real clinician — and if it's pain 10/10, the app handles that client-side before even calling the AI.

The entry point is `InjuryCoachCard.jsx`, a new card on the Dashboard placed between `DailyInsightCard` and `FridayPrepCard`.

---

### User Stories

> As a runner, I want to describe soreness or pain and get physio-informed guidance so that I know whether to rest, modify training, or see a specialist.

> As a runner, I want the AI coach to automatically flag injury risk when my training load spikes so that I don't wait until I'm actually hurt to ask for help.

> As a runner, I want the coach to stay grounded in my actual training data rather than giving generic advice so that the guidance is relevant to what I've been doing.

---

### New AI Roles

Two new roles added alongside existing coach modes:

| Role                      | `focus` value     | Persona                                           | Scope                                                                           |
| ------------------------- | ----------------- | ------------------------------------------------- | ------------------------------------------------------------------------------- |
| Sports Physiotherapist    | `physio`          | MSc-level sports physio with 10+ years experience | Movement assessment, load management, rehabilitation, return-to-run progression |
| Sports Medicine Physician | `sports_medicine` | Board-certified sports medicine physician         | Medical context around injury, recovery timelines, when to seek further care    |

**Hard guardrails (enforced via system prompt):**

- Never use the words "diagnose", "prescribe", or "you have [condition]"
- Always use hedge language: "this may suggest", "it's possible that", "worth discussing with a clinician"
- If the response contains a red flag (e.g. bone stress, compartment syndrome, nerve symptoms), include the token `[ESCALATE]` at the start of the response — the frontend detects this and renders a red escalation banner instead of normal content
- Output language: English

**Client-side escalation (no LLM call):**

When user reports `pain_level = 10`, the frontend immediately renders a hardcoded message without calling the AI:

> "Pain at 10/10 needs medical attention now. Please stop training and see a doctor or go to an emergency clinic."

No API call is made. The message is shown in a red banner inside the card.

---

### New DB Table: `rt_symptom_logs`

```sql
CREATE TABLE rt_symptom_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  body_region TEXT,                         -- e.g. 'left_knee', 'right_achilles', 'lower_back' — nullable
  pain_level INT CHECK (pain_level BETWEEN 0 AND 10),
  pain_type TEXT,                           -- 'sharp', 'dull', 'burning', 'aching', 'tightness' — nullable
  occurs_when TEXT,                         -- 'at_rest', 'during_run', 'after_run', 'next_morning' — nullable
  notes TEXT,                               -- free-form description from user
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  archived_at TIMESTAMPTZ DEFAULT NULL      -- set after 30 days of inactivity (no new log for same region)
);

CREATE INDEX idx_symptom_logs_user ON rt_symptom_logs(user_id, logged_at DESC);
```

**Auto-archive rule:** a cron job (or inline check at query time) sets `archived_at = NOW()` on rows where `logged_at < NOW() - INTERVAL '30 days'` and no newer row exists for the same `user_id + body_region`. Archived logs are excluded from the AI context window but remain in DB for history.

---

### InjuryCoachCard.jsx — Component Spec

**Location on Dashboard:** between `DailyInsightCard` and `FridayPrepCard`.

**Card header:**

```
🩺 Injury Coach  [BETA]
```

- Icon: `Stethoscope` (rose-400)
- Label: "Injury Coach" (semibold, slate-700)
- Badge: "BETA" (bg-rose-100, text-rose-700)
- Role toggle: two pill buttons — "Physio" / "Sports Medicine" — shown after user has submitted at least one question

**Persistent disclaimer strip (not a modal):**

A small strip at the top of the card content area, always visible, non-dismissible:

> "This is not medical advice. Always consult a qualified clinician for diagnosis and treatment."

- Style: `bg-amber-50 border border-amber-100 text-amber-700 text-xs rounded`
- Test ID: `injuryCoachDisclaimer_dashboardPage`

**Context form (shown when card is in idle/empty state):**

| Field        | Type                                       | Required | Notes                          |
| ------------ | ------------------------------------------ | -------- | ------------------------------ |
| Body part    | Text input or select                       | No       | Freeform or from a preset list |
| Injury phase | Pill buttons: Acute / Sub-acute / Recovery | No       | Single select                  |
| Question     | Textarea                                   | Yes      | Min 10 chars                   |

- Injury phase pills render only after body part is entered (or always — UX to decide)
- "Ask Physio" and "Ask Sports Medicine" are two separate submit buttons (or one "Ask" button + role selector above)
- Submitting calls `POST /api/running/v1/ai/injury-coach`

**Triggers for card auto-opening or surfacing:**

| Trigger                     | Condition                                                              | Action                                                                                                                                              |
| --------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| User-initiated              | User taps the card / starts typing                                     | Normal flow                                                                                                                                         |
| ACWR spike + recent symptom | `acwr > 1.4` AND a `rt_symptom_log` row exists within the last 14 days | Card appears with a pre-filled nudge: "You've logged symptoms recently and your training load is elevated. Want to check in with the Injury Coach?" |
| Explicit role switch        | User clicks "Physio" or "Sports Medicine" pill                         | Switches context; existing conversation is retained but the next question uses the new role                                                         |

---

### API Endpoint

```
POST /api/running/v1/ai/injury-coach
```

**Request body:**

```json
{
  "focus": "physio" | "sports_medicine",
  "question": "string (required, min 10 chars)",
  "body_region": "string (optional)",
  "injury_phase": "acute" | "sub_acute" | "recovery" | null,
  "pain_level": 0-10 (optional — if provided, saved to rt_symptom_logs)
}
```

**Server behavior:**

1. If `pain_level` is provided, insert a row into `rt_symptom_logs`
2. Build context: last 14 days of activities, current ACWR, any `rt_symptom_logs` rows from the last 30 days (non-archived), user profile (age, weight, max_hr)
3. Select system prompt based on `focus` value
4. Call Claude API (Sonnet 4.6, temp 0.4, max 600 tokens)
5. If response starts with `[ESCALATE]` → return with `escalate: true` flag in response body
6. Save response to `rt_ai_insights` with `insight_type = 'injury_coach'`, `data_refs: { focus, body_region }`
7. Return `{ data: { content, escalate: boolean }, message }`

**Auth:** session required — 401 if not authenticated

**Ownership:** only the authenticated user's data is fetched for context (no cross-user access)

---

### Acceptance Criteria

```
GIVEN user opens the Injury Coach card on Dashboard
WHEN card renders
THEN the persistent disclaimer strip is always visible
AND the disclaimer is not dismissible

GIVEN user types a question with fewer than 10 characters
WHEN user submits
THEN form shows validation error: "Please describe your situation in more detail (min 10 characters)"
AND no API call is made

GIVEN user reports pain_level = 10 on the form
WHEN user submits
THEN NO API call is made
AND card renders a red hardcoded escalation message:
  "Pain at 10/10 needs medical attention now. Please stop training and see a doctor or go to an emergency clinic."

GIVEN user submits a valid question with focus = 'physio'
WHEN POST /api/running/v1/ai/injury-coach is called
THEN system prompt uses the Sports Physiotherapist persona
AND response does not contain the words "diagnose", "prescribe", or "you have [condition]"
AND response contains hedge language

GIVEN user submits a valid question with focus = 'sports_medicine'
WHEN POST /api/running/v1/ai/injury-coach is called
THEN system prompt uses the Sports Medicine Physician persona

GIVEN AI response contains [ESCALATE] token
WHEN frontend receives response
THEN a red escalation banner is shown above the AI content
AND banner text: "This sounds like it may need prompt medical attention. Please consult a clinician soon."

GIVEN user has logged a symptom in the last 14 days AND current acwr > 1.4
WHEN Dashboard loads
THEN InjuryCoachCard surfaces with a pre-filled prompt nudge

GIVEN user submits a question
WHEN pain_level is included in the request body
THEN a row is inserted into rt_symptom_logs with the correct user_id, body_region, pain_level, and logged_at

GIVEN another user's user_id is used in context build
WHEN API handler runs
THEN only the authenticated user's data is used (IDOR check)

GIVEN role toggle is visible
WHEN user switches from 'physio' to 'sports_medicine'
THEN the next question submitted uses the sports_medicine system prompt
AND previous conversation is still visible in the card
```

---

### Validations & Error States

| Scenario                                     | Handling                                                                            |
| -------------------------------------------- | ----------------------------------------------------------------------------------- |
| `question` is empty or < 10 chars            | 400 — "Question must be at least 10 characters"                                     |
| `focus` is not `physio` or `sports_medicine` | 400 — "Invalid focus value"                                                         |
| `pain_level` outside 0–10                    | 400 — "Pain level must be between 0 and 10"                                         |
| `pain_level = 10`                            | Client-side block — hardcoded message, no API call                                  |
| Claude timeout (> 30s)                       | Show "Analysis is taking longer than expected. Try again." with retry button        |
| Claude API error                             | Show "Unable to get a response right now. Try again in a moment." with retry button |
| No session                                   | 401                                                                                 |
| Context build fails (DB error)               | 500 — log to Sentry, show generic error to user                                     |

---

### Test IDs

Registered in `cypress/fixtures/app-constants.json` under `test_ids.injury_coach.*`:

| ID                                         | Element                                                |
| ------------------------------------------ | ------------------------------------------------------ |
| `injuryCoachCard_dashboardPage`            | Card root element                                      |
| `injuryCoachDisclaimer_dashboardPage`      | Persistent disclaimer strip                            |
| `injuryCoachQuestionInput_dashboardPage`   | Question textarea                                      |
| `injuryCoachBodyPartInput_dashboardPage`   | Body part input                                        |
| `injuryCoachPhaseAcute_dashboardPage`      | "Acute" phase pill                                     |
| `injuryCoachPhaseSubAcute_dashboardPage`   | "Sub-acute" phase pill                                 |
| `injuryCoachPhaseRecovery_dashboardPage`   | "Recovery" phase pill                                  |
| `injuryCoachSubmitPhysio_dashboardPage`    | Submit button — physio role                            |
| `injuryCoachSubmitSportsMed_dashboardPage` | Submit button — sports medicine role                   |
| `injuryCoachResponse_dashboardPage`        | Response content area                                  |
| `injuryCoachEscalateBanner_dashboardPage`  | Red escalation banner (shown when [ESCALATE] detected) |
| `injuryCoachPain10Banner_dashboardPage`    | Hardcoded pain 10/10 message                           |
| `injuryCoachNudge_dashboardPage`           | Pre-filled nudge when ACWR > 1.4 + recent symptom      |
| `injuryCoachRolePhysio_dashboardPage`      | "Physio" role toggle pill                              |
| `injuryCoachRoleSportsMed_dashboardPage`   | "Sports Medicine" role toggle pill                     |

---
