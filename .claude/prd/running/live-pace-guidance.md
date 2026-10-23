## 25. Live Pace Guidance (Run Mode)

**Where:** mobile app → Run tab (shared section 11)
**Status:** Draft
**Release:** TBD (proposed v1.34)
**Issue:** #875
**Needs:** shared section 11 (Mobile App) first

---

### 25.1 Overview

Run Mode is a live coach in my phone. Before a run I pick a plan. While I run, the phone follows me with GPS (even when the screen is locked), compares where I am to the plan, and tells me when to **speed up** or **ease off** so I still hit my target time.

Example: a 10 km hilly route with a 50:00 target. At km 4 I'm 18 seconds behind. Run Mode tells me, and spreads those 18 seconds over the rest of the route — but it doesn't ask me to push on the climb at km 5. It asks me to win the time back on the flat and downhill parts.

**Where the plan comes from**

- **Saved simulation** — a plan from the Route Pacing Simulator (section 24). It already has a pace per km that follows the hills (`km_splits`). This is the main way.
- **Quick plan** — distance + target time → even pace every km. For flat routes or when I didn't make a simulation.

**How it works with my Garmin**

- My Garmin keeps recording the run as usual. That's the official activity that goes to Strava. The phone is only the coach.
- Every cue is also a phone notification. With **Garmin Connect → Smart Notifications → During Activity** turned on, my watch shows the cue and vibrates. I don't need to look at the phone.
- Phone GPS and Garmin GPS can disagree a little (often 1–2%). Run Mode follows the phone's distance, so its km marks can be a bit off from the watch's auto laps. Run Mode says this on its first screen.

**Not in v1**

- A Garmin watch app (Connect IQ) or reading live data from the watch
- Saving the phone's track as an activity (Garmin + Strava already do this)
- A map, turn-by-turn directions, or off-route alerts
- Heart-rate based cues

---

### 25.2 User stories

- As a runner, I want to pick a saved route plan before I start, so that the guidance follows the hills of that route.
- As a runner, I want to hear when I'm ahead or behind at every km, so that I know where I stand without looking.
- As a runner, I want to be told to speed up or ease off when I drift from the plan, so that I fix it early instead of at the end.
- As a runner, I want a warning before a climb or a descent, so that I change pace at the right moment.
- As a runner, I want a lost gap spread over the rest of the route, so that I don't have to sprint up a hill to catch up.
- As a runner, I want the cues to show up on my Garmin, so that I can keep my phone in my pocket.
- As a runner, I want an honest new finish time when my target is out of reach, so that I don't blow up chasing it.
- As a runner, I want a quick plan from just distance and target time, so that I can use Run Mode without making a simulation first.

---

### 25.3 How the guidance works

All of this runs **on the phone**, not on the server. No internet is needed during the run.

**Plan → target clock**

- From the plan's `km_splits`, build the target time at every km mark (target at km 3 = km 1 + km 2 + km 3 target times). The last, partial km is scaled to its length.
- Between km marks the target time is interpolated, so there's a target time for any distance.

**While running (on every GPS update)**

- `distance` = phone GPS distance, smoothed (points with accuracy worse than 30 m are skipped).
- `elapsed` = clock time since **Start**, minus pauses. Stops at traffic lights count unless I press **Pause** — it's race time.
- `gap` = elapsed − target time at this distance. Positive = behind, negative = ahead.
- `current pace` = rolling pace over the last 30 seconds.

**Spreading the gap (re-plan)**

- `factor` = (target finish − elapsed) ÷ (plan finish − plan time at this distance).
- The target for the current km and every km after it = plan pace × `factor`. The shape of the plan (slower uphill, faster downhill) stays the same. Only the level moves.
- Example: 18 s behind at km 4 of a 50:00 plan → `factor` ≈ 0.99 → every km left gets about 3 s/km faster.

**The cues**

| Cue           | When                                                                                                        | Example (voice)                                         |
| ------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Km split      | Every km mark                                                                                               | "Km 4. 5:12. 18 seconds behind. Next km 5:20, uphill."  |
| Speed up      | Current pace is slower than the target by more than the tolerance (default 10 s/km) for 30 seconds in a row | "Speed up to 5:05."                                     |
| Ease off      | Current pace is faster than the target by more than the tolerance for 30 seconds in a row                   | "Ease off to 5:20."                                     |
| Terrain ahead | 200 m before a km whose target differs from the current one by 15 s/km or more                              | "Climb in 200 meters. Ease to 5:40."                    |
| Out of reach  | Once, when `factor` drops below 0.95 (the rest would need to be 5% or more faster than plan)                | "Target is out of reach. Hold 5:10 for a 51:40 finish." |
| Finish        | At the plan's distance                                                                                      | "Done. 49:52. 8 seconds under target."                  |

Rules so it doesn't nag:

- No speed up / ease off cues in the first 400 m (GPS settles, everyone starts fast).
- At least 60 seconds between two speed up / ease off cues.
- No speed up / ease off cue within 15 seconds of a km split cue (the split cue already says it).
- After the out-of-reach cue, the target becomes the new projected finish and guidance continues against that.

**How each cue reaches me** — each one can be turned on or off in Run settings:

- **Voice** — text-to-speech, lowers my music while it talks. Language: Bahasa Indonesia (default) or English.
- **Vibration** — speed up = two short buzzes, ease off = one long buzz, split = one short buzz.
- **Notification** — a phone notification that replaces the previous cue, so my Garmin always shows the latest one.

---

### 25.4 Screens and states

| State           | What I see                                                                                                                                                                                                  |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pick a plan     | List of saved simulations (name, distance, target time, date) + **Quick plan**. Loading skeleton / error with Try again / empty: "No saved plans yet — make one in Route Simulator on the web" + Quick plan |
| Quick plan form | Distance (km) and target time (h:mm:ss) → shows the even pace live                                                                                                                                          |
| Ready           | Plan summary, GPS status ("Finding GPS…" → "GPS ready"), battery warning when under 20%, the Garmin note. **Start** is disabled until GPS accuracy is 20 m or better                                        |
| Running         | Big **gap** (+0:18 behind in red / −0:06 ahead in green), current pace vs target pace, distance, elapsed, "Km 5 of 10", next km's target and terrain. **Pause** button. **Stop** needs a long press         |
| Paused          | Clock stopped, **Resume** and long-press **Stop**                                                                                                                                                           |
| GPS lost        | "GPS signal lost" banner and one voice cue. The clock keeps going; distance resumes when GPS comes back                                                                                                     |
| Finished        | Final time vs target, a table per km (target vs actual pace, gap at each mark), how many cues fired. Kept on the phone (last 20 runs)                                                                       |
| No permission   | "Run Mode needs location access, also when the screen is locked" + **Open phone settings**                                                                                                                  |

- Works with the screen locked. Android shows a "Run Mode is on" notification while running (needed for background GPS). iPhone shows the blue location indicator.
- Big numbers, high contrast, and color is never the only signal ("behind" / "ahead" is written too).
- The plan is downloaded when I pick it, so the run itself works with no internet.

---

### 25.5 Run settings (in the app)

| Setting                        | Default          | Range               |
| ------------------------------ | ---------------- | ------------------- |
| Pace tolerance                 | 10 s/km          | 5–30 s/km           |
| Voice cues                     | On               | On / Off            |
| Voice language                 | Bahasa Indonesia | Indonesia / English |
| Vibration                      | On               | On / Off            |
| Notification cues (for Garmin) | On               | On / Off            |
| Terrain-ahead cues             | On               | On / Off            |

Saved on the phone.

---

### 25.6 Validations

| Field          | Rule                                 | Message                                               |
| -------------- | ------------------------------------ | ----------------------------------------------------- |
| Distance       | required, 1–100 km, up to 2 decimals | "Distance must be between 1 and 100 km"               |
| Target time    | required, h:mm:ss                    | "Enter a target time like 0:50:00"                    |
| Target time    | pace between 2:30 and 15:00 per km   | "That target works out to [pace]/km — check the time" |
| Pace tolerance | 5–30 s/km                            | "Tolerance must be between 5 and 30 seconds"          |

---

### 25.7 Error states

| Situation                            | What I see                                                                                 |
| ------------------------------------ | ------------------------------------------------------------------------------------------ |
| Plans won't load (network/500)       | "Couldn't load your plans." + **Try again**. Quick plan still works                        |
| Location permission denied           | No-permission state with **Open phone settings**                                           |
| "While using" only (no background)   | "Allow location **Always** so Run Mode keeps working with the screen locked"               |
| GPS never gets accurate              | **Start** stays disabled with "Still finding GPS — move to an open area"                   |
| GPS lost during the run              | GPS lost banner + voice cue; clock keeps going                                             |
| App killed by the phone during a run | On reopen: "Your run was interrupted" with **Resume** (if under 10 minutes) or **Discard** |
| 401 while loading plans              | Sent to sign-in (shared section 11.3)                                                      |

---

### 25.8 API

No new endpoints. The app uses the existing ones with a Bearer token (shared section 11.4):

| Method | Path                                  | Used for                                             |
| ------ | ------------------------------------- | ---------------------------------------------------- |
| GET    | /api/running/v1/route-simulations     | the plan list                                        |
| GET    | /api/running/v1/route-simulations/:id | the chosen plan's `km_splits` and `total_distance_m` |

---

### 25.9 Data

No server changes in v1. Finished runs are saved on the phone only (last 20).

---

### 25.10 Acceptance criteria

- GIVEN saved simulations WHEN I open the Run tab THEN I see them with name, distance, and target time, plus Quick plan.
- GIVEN no saved simulations WHEN I open the Run tab THEN I see the empty message and Quick plan still works.
- GIVEN I pick a plan WHEN the GPS isn't accurate yet THEN **Start** is disabled and says "Finding GPS…".
- GIVEN I'm running with the screen locked WHEN I pass a km mark THEN I hear the split cue, feel one short buzz, and my Garmin shows the cue.
- GIVEN I'm 12 s/km slower than the target for 30 seconds (tolerance 10) WHEN I'm past the first 400 m THEN I hear "Speed up to [pace]".
- GIVEN I'm 12 s/km faster than the target for 30 seconds WHEN I'm past the first 400 m THEN I hear "Ease off to [pace]".
- GIVEN a speed up cue just fired WHEN I'm still too slow 30 seconds later THEN no new cue comes until 60 seconds have passed.
- GIVEN I'm 18 s behind at km 4 of a 50:00 plan WHEN the next targets are worked out THEN every remaining km gets faster by about the same share, and climbs stay slower than flats.
- GIVEN the next km's target is 15 s/km or more slower than the current one WHEN I'm 200 m before it THEN I hear the terrain-ahead cue.
- GIVEN the rest of the run would need to be 5% or more faster than plan WHEN that happens THEN I hear the out-of-reach cue once, and guidance continues against the new projected finish.
- GIVEN I press Pause WHEN I resume later THEN the paused time isn't counted and no cues fire while paused.
- GIVEN GPS drops WHEN it comes back THEN distance resumes without a jump, and a GPS lost cue fired once.
- GIVEN I reach the plan's distance WHEN the run ends THEN I hear the finish cue and see the per-km table.
- GIVEN no internet during the run WHEN I run THEN every cue still works.
- GIVEN Quick plan 10 km in 0:50:00 WHEN I start THEN every km target is 5:00.
- GIVEN Quick plan with a target time that works out to 1:50/km WHEN I try to start THEN I see the pace validation message.

---

### 25.11 Testing

- The guidance logic is a pure JS module (`mobile/src/run/paceEngine.js`) with no phone APIs in it. It gets unit tests (Node test runner):
  - target clock, interpolation, partial last km
  - gap, rolling pace, re-plan `factor`
  - every cue rule (thresholds, 400 m start, 60 s cooldown, out-of-reach once)
- **Replay tests:** feed real past runs (Strava streams of my activities: time, distance, altitude) through the engine against a plan, and check which cues fire and when.
- Manual: at least one real run on Android and one on iPhone with the screen locked and the Garmin showing the cues.
- Cypress: no new endpoints. Bearer access to the two simulation routes is covered by shared section 11.

---

### 25.12 Definition of done

- [ ] Pick a plan (saved simulation or Quick plan), Ready, Running, Paused, GPS lost, Finished, and no-permission states
- [ ] Background GPS with the screen locked on Android and iPhone
- [ ] All six cues with voice (Indonesia/English), vibration, and notification; Run settings work
- [ ] Re-plan keeps the terrain shape and spreads the gap
- [ ] Works offline once the plan is picked
- [ ] `paceEngine` unit tests and replay tests pass
- [ ] One real run per platform with cues showing on the Garmin
- [ ] PRD updated with the final behavior
