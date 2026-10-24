---
name: running-integration-ui
description: Running module UI decisions for third-party integrations (Strava, Garmin): accent color and hide-when-empty rule
metadata:
  type: project
---

No brand tokens exist for Strava or Garmin. Use a dark -700 shade with a short code comment (Strava = orange-700, Garmin = sky-700). Optional-data sections on the activity detail page hide entirely when empty (no empty cards).

**Why:** PRD 26.7 (#922) says no empty cards or errors when Garmin data is missing; white text on -700 keeps AA contrast.

**How to apply:** any new integration card in Running Settings or optional section on activity detail.
