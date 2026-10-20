## 6. Database Tables

### Inventory Tables

| Table                  | Module    | Description                                                                                                       |
| ---------------------- | --------- | ----------------------------------------------------------------------------------------------------------------- |
| `inv_product_list`     | Inventory | Product data                                                                                                      |
| `inv_product_brand`    | Inventory | Brand master data                                                                                                 |
| `inv_product_name`     | Inventory | Product type master data                                                                                          |
| `inv_product_quantity` | Inventory | Current stock per product                                                                                         |
| `inv_product_history`  | Inventory | Stock activity log                                                                                                |
| `inv_budget`           | Inventory | Monthly budget per type — columns: `user_id`, `type`, `monthly_budget`, `updated_at`; unique on `(user_id, type)` |

### Trading Tables

| Table        | Module  | Description       |
| ------------ | ------- | ----------------- |
| `trade_list` | Trading | Trade data        |
| `event_list` | Trading | Market events     |
| `fee_list`   | Trading | Fee structure     |
| `settings`   | Trading | Per-user settings |

### Auth Tables

| Table        | Module | Description         |
| ------------ | ------ | ------------------- |
| `auth.users` | Auth   | Managed by Supabase |

### Running Tracker Tables

> Full schema (columns, RLS, indexes) is documented in PRD_Running_Tracker.md section 8.

| Table                       | Description                                  |
| --------------------------- | -------------------------------------------- |
| `rt_activities`             | Core run/workout record                      |
| `rt_race_log`               | Race finish entries                          |
| `rt_upcoming_races`         | Future race targets                          |
| `rt_gear`                   | Shoe and equipment tracking                  |
| `rt_goals`                  | Training goals                               |
| `rt_symptom_logs`           | Injury and pain entries                      |
| `rt_ai_insights`            | AI-generated insight records                 |
| `rt_activity_best_efforts`  | Per-activity personal record entries         |
| `rt_activity_splits`        | Per-km splits per activity                   |
| `rt_activity_streams`       | Second-by-second telemetry (HR, pace, power) |
| `rt_daily_training_metrics` | Computed daily load (ACWR, acute/chronic)    |
| `rt_subjective_health_logs` | Daily sleep, energy, and mood entries        |
| `rt_weight_logs`            | Body weight and composition entries          |
| `rt_strava_credentials`     | Strava OAuth tokens                          |
| `rt_users`                  | Runner profile                               |
| `rt_user_settings`          | Per-user notification and zone preferences   |

---
