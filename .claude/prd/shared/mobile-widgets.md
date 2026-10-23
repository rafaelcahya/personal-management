## 13. Home Screen Widgets

> **Moving to the mobile repo (2026-10-23).** The app part now lives in the mobile repo PRD (`widgets.md`). The widgets API (13.7) is in `mobile-backend.md` (section 14). Don't edit this file anymore.

**Status:** Draft
**Release:** TBD (proposed v1.34)
**Issue:** #877
**Needs:** section 11 (Mobile App) first

**What it is**
Widgets on my Android and iPhone home screen, so I see the numbers I check most without opening anything. Three widgets, each in a small and a medium size.

---

### 13.1 The widgets

| Widget       | Small                            | Medium                                                  | Tap opens                    |
| ------------ | -------------------------------- | ------------------------------------------------------- | ---------------------------- |
| Running week | Ring: km this week / weekly goal | Ring + runs this week + days to next race and its name  | App → Run tab                |
| Portfolio    | Today's change in %              | Total value + today's change (amount and %) + top mover | Web → trading dashboard      |
| Low stock    | Number of low-stock products     | Number + the 3 most urgent product names                | Web → inventory product list |

- **Hide amounts** (Portfolio): on by default. When on, only percentages show, never money. Changed in the widget's settings (long-press → Edit widget on iPhone, widget settings on Android).
- Widgets follow the phone's light/dark mode and use the web palette colors (green up, red down, same as the web).
- Every widget shows **"Updated 14:05"** in the corner.

---

### 13.2 How the data gets there

- Widgets **never call the API themselves**. The token stays inside the app.
- The app calls `GET /api/mobile/v1/widgets` and saves the result where widgets can read it (iOS App Group, Android shared preferences). Then it asks the phone to redraw the widgets.
- The app refreshes the data:
  - when I open the app,
  - when the app goes to the background,
  - with background fetch about every 30 minutes (the phone decides the exact time),
  - when a related push arrives (low stock → Low stock widget, race reminder → Running week).
- If the data is **older than 6 hours**, the widget dims and says "Open app to refresh".

---

### 13.3 User stories

- As a runner, I want my weekly km and next race on the home screen, so that I stay on track without opening anything.
- As an investor, I want today's portfolio change on the home screen, so that I know at a glance how the day is going.
- As the owner, I want amounts hidden by default, so that people who see my phone don't see my money.
- As the owner, I want to see which products are running low, so that I can buy them on my next trip.

---

### 13.4 Acceptance criteria

- GIVEN I add the Running week widget WHEN I have a weekly goal THEN it shows km this week against the goal.
- GIVEN no weekly goal WHEN I add Running week THEN it shows the km and "Set a weekly goal on the web".
- GIVEN no upcoming race WHEN I look at medium Running week THEN the race line says "No race planned".
- GIVEN Hide amounts is on WHEN I look at Portfolio THEN only percentages show.
- GIVEN Hide amounts is off WHEN I look at Portfolio THEN total value and today's change in money show too.
- GIVEN no low-stock products WHEN I look at Low stock THEN it says "All stocked up".
- GIVEN the data is older than 6 hours WHEN I look at a widget THEN it's dimmed with "Open app to refresh".
- GIVEN I'm signed out WHEN I look at a widget THEN it says "Sign in to see data" and shows no old numbers.
- GIVEN a low-stock push arrives WHEN the app handles it THEN the Low stock widget updates without me opening the app.
- GIVEN the trading part fails on the server WHEN the app refreshes THEN Running week and Low stock still update, and Portfolio keeps its last data with its old time.
- GIVEN I tap the Running week widget WHEN the app opens THEN it's on the Run tab.

---

### 13.5 Validations

None — the widgets have one setting (Hide amounts), a simple on/off.

---

### 13.6 Error states

| Situation                        | What the widget shows                                      |
| -------------------------------- | ---------------------------------------------------------- |
| Never loaded                     | "Open the app to load data"                                |
| Data older than 6 hours          | Dimmed numbers + "Open app to refresh"                     |
| One section failed on the server | That widget keeps its last data and its old "Updated" time |
| Signed out                       | "Sign in to see data", no numbers                          |

---

### 13.7 API

| Method | Path                   | Notes                                                                                                                                                        |
| ------ | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| GET    | /api/mobile/v1/widgets | Owner only. Returns `{ generated_at, running, trading, inventory }`. Each section can be `null` with an `error` code when it fails — the others still return |

Built from the existing home highlight services (`lib/services/home/getRunningHighlights.js`, `getTradingHighlights.js`, `getInventoryHighlights.js`). Add missing fields there if needed (weekly goal, top mover). Small payload, standard rate-limit tier.

Response shape:

```json
{
  "data": {
    "generated_at": "2026-10-19T07:05:00Z",
    "running": {
      "week_km": 32.4,
      "goal_km": 40,
      "runs": 3,
      "next_race": { "name": "Jakarta 10K", "date": "2026-11-02", "days_left": 14 }
    },
    "trading": {
      "total_value": 152300000,
      "currency": "IDR",
      "day_change": 1250000,
      "day_change_pct": 0.83,
      "top_mover": { "symbol": "BBCA", "change_pct": 2.1 }
    },
    "inventory": { "low_stock_count": 4, "top": [{ "name": "Shampoo", "days_left": 3 }] }
  }
}
```

---

### 13.8 Definition of done

- [ ] Three widgets in small and medium on iPhone (WidgetKit) and Android (app widget)
- [ ] App saves data to shared storage and refreshes on open, background, background fetch, and related pushes
- [ ] Hide amounts works and is on by default
- [ ] Stale, signed-out, empty, and partial-failure states
- [ ] `GET /api/mobile/v1/widgets` with Cypress API tests (owner only, partial failure, 401) — headed, 100% pass
- [ ] Manual check on both phones, light and dark mode
- [ ] PRD updated with the final behavior
