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

| Table                            | Module  | Description                                            |
| -------------------------------- | ------- | ------------------------------------------------------ |
| `trd_trade_list`                 | Trading | Trade data                                             |
| `trd_event_list`                 | Trading | Market events                                          |
| `trd_fee_list`                   | Trading | Fee structure                                          |
| `trd_event_ai_analysis`          | Trading | Saved AI analysis per event                            |
| `trd_buy_reason_options`         | Trading | Buy reason dropdown options                            |
| `trd_sell_reason_options`        | Trading | Sell reason dropdown options                           |
| `trd_entry_occasion_options`     | Trading | Entry occasion dropdown options                        |
| `trd_entry_session_options`      | Trading | Entry session dropdown options                         |
| `trd_stock_type_options`         | Trading | Stock type dropdown options                            |
| `trd_currency_investments`       | Trading | Currency buy/sell transactions                         |
| `trd_currency_holdings`          | Trading | Currencies the user holds                              |
| `trd_forex_rate_cache`           | Trading | Cached daily exchange rates                            |
| `trd_investment_flow_nodes`      | Trading | Investment flow tree nodes                             |
| `trd_investment_flow_settings`   | Trading | Investment flow settings (uninvested cash, highlights) |
| `trd_uninvested_cash_categories` | Trading | Uninvested cash categories                             |
| `trd_research_cache`             | Trading | Cached research data per ticker and endpoint           |
| `trd_watchlist`                  | Trading | Watched tickers per user                               |
| `trd_watchlist_fundamentals`     | Trading | Cached valuation data per ticker                       |
| `trd_settings`                   | Trading | Per-user trading settings (margin, risk-free rates)    |

### Shared Tables

| Table                          | Module | Description                                    |
| ------------------------------ | ------ | ---------------------------------------------- |
| `app_notifications`            | Shared | In-app notifications (Realtime-enabled)        |
| `app_notification_preferences` | Shared | Push on/off per user and notification type     |
| `app_push_subscriptions`       | Shared | One row per browser device registered for push |
| `app_push_delivery_log`        | Shared | One row per push attempt (kept 30 days)        |

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
