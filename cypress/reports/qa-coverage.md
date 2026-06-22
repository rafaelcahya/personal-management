# QA Coverage Report

**Last Updated:** 2026-06-22 (issue #444 — weekly stats filter)
**Branch:** feat/issue-444-weekly-stats-filter

---

## Summary

| Type      | Tests  | %    |
| --------- | ------ | ---- |
| API       | 1,270  | 42%  |
| UI        | 1,731  | 58%  |
| **Total** | **3,001** | 100% |

---

## Module Overview

| Module               | API   | UI    | Total |
| -------------------- | ----- | ----- | ----- |
| Auth                 | 22    | 107   | 129   |
| Inventory Management | 701   | 454   | 1,155 |
| Trading Management   | 104   | 434   | 538   |
| Running Tracker      | 443   | 695   | 1,138 |
| Landing Page         | 0     | 33    | 33    |
| Shared               | 0     | 8     | 8     |
| **Total**            | **1,270** | **1,731** | **3,001** |

---

## Detailed Breakdown

### Auth

| Feature       | API | UI | Total |
| ------------- | --- | -- | ----- |
| Auth Guard    | 6   | 0  | 6     |
| Login         | 9   | 58 | 67    |
| Logout        | 3   | 32 | 35    |
| Session       | 4   | 17 | 21    |
| **Subtotal**  | **22** | **107** | **129** |

---

### Inventory Management

#### Dashboard

| Feature       | API | UI | Total |
| ------------- | --- | -- | ----- |
| Dashboard     | 54  | 95 | 149   |
| Summary       | 17  | 0  | 17    |
| **Subtotal**  | **71** | **95** | **166** |

#### Product

| Feature              | API | UI | Total |
| -------------------- | --- | -- | ----- |
| Auth Guard           | 26  | 0  | 26    |
| Add Product          | 40  | 60 | 100   |
| Create Stock         | 40  | 0  | 40    |
| Delete Product       | 23  | 0  | 23    |
| Edit Product         | 13  | 0  | 13    |
| Favorite Product     | 27  | 0  | 27    |
| Last Price           | 17  | 0  | 17    |
| List Product         | 41  | 98 | 139   |
| Product Detail       | 25  | 35 | 60    |
| Product Filter       | 0   | 9  | 9     |
| Product History      | 25  | 0  | 25    |
| Product List Image   | 0   | 9  | 9     |
| Restock Predictions  | 16  | 0  | 16    |
| Product Summary      | 16  | 0  | 16    |
| Update Product       | 39  | 0  | 39    |
| **Subtotal**         | **348** | **211** | **559** |

#### Product Brand

| Feature          | API | UI | Total |
| ---------------- | --- | -- | ----- |
| Add Brand        | 24  | 23 | 47    |
| Delete Brand     | 17  | 0  | 17    |
| List Brand       | 14  | 26 | 40    |
| Brand Detail     | 20  | 0  | 20    |
| Brand Summary    | 13  | 0  | 13    |
| Update Brand     | 30  | 13 | 43    |
| **Subtotal**     | **118** | **62** | **180** |

#### Product History

| Feature          | API | UI | Total |
| ---------------- | --- | -- | ----- |
| Product History  | 40  | 28 | 68    |
| **Subtotal**     | **40** | **28** | **68** |

#### Product Name

| Feature          | API | UI | Total |
| ---------------- | --- | -- | ----- |
| Add Name         | 23  | 13 | 36    |
| Bulk Name        | 6   | 16 | 22    |
| Delete Name      | 15  | 0  | 15    |
| List Name        | 18  | 15 | 33    |
| Name Detail      | 20  | 0  | 20    |
| Name Summary     | 13  | 0  | 13    |
| Update Name      | 29  | 14 | 43    |
| **Subtotal**     | **124** | **58** | **182** |

**Inventory Total — API: 701 | UI: 454 | Total: 1,155**

---

### Trading Management

#### Dashboard

| Feature          | API | UI | Total |
| ---------------- | --- | -- | ----- |
| Dashboard API    | 27  | 0  | 27    |
| **Subtotal**     | **27** | **0** | **27** |

#### Trade

| Feature       | API | UI  | Total |
| ------------- | --- | --- | ----- |
| Auth Guard    | 29  | 0   | 29    |
| Add Trade     | 0   | 109 | 109   |
| Delete Trade  | 0   | 6   | 6     |
| List Trade    | 12  | 0   | 12    |
| Option Trade  | 0   | 7   | 7     |
| Trade Summary | 13  | 0   | 13    |
| Trade Detail  | 0   | 15  | 15    |
| Update Trade  | 0   | 32  | 32    |
| **Subtotal**  | **54** | **169** | **223** |

#### Fee

| Feature      | API | UI | Total |
| ------------ | --- | -- | ----- |
| Add Fee      | 0   | 62 | 62    |
| Delete Fee   | 0   | 6  | 6     |
| Fee Detail   | 0   | 15 | 15    |
| List Fee     | 13  | 6  | 19    |
| Fee Summary  | 0   | 23 | 23    |
| Update Fee   | 0   | 19 | 19    |
| **Subtotal** | **13** | **131** | **144** |

#### Event

| Feature        | API | UI | Total |
| -------------- | --- | -- | ----- |
| Add Event      | 0   | 59 | 59    |
| Delete Event   | 0   | 9  | 9     |
| Event Detail   | 0   | 15 | 15    |
| List Event     | 0   | 6  | 6     |
| Event Summary  | 0   | 25 | 25    |
| Update Event   | 0   | 20 | 20    |
| **Subtotal**   | **0** | **134** | **134** |

#### Settings

| Feature          | API | UI | Total |
| ---------------- | --- | -- | ----- |
| Trading Settings | 16  | 0  | 16    |
| **Subtotal**     | **16** | **0** | **16** |

**Trading Total — API: 104 | UI: 434 | Total: 538**

---

### Running Tracker

#### Activities

| Feature                  | API | UI | Total |
| ------------------------ | --- | -- | ----- |
| Activity List            | 28  | 21 | 49    |
| Activity Page Title      | 0   | 10 | 10    |
| Activity Detail          | 23  | 41 | 64    |
| AI Insight               | 8   | 0  | 8     |
| AI Coach Improvements    | 0   | 23 | 23    |
| Cadence Chart            | 0   | 16 | 16    |
| Compare Runs             | 0   | 19 | 19    |
| HR Chart                 | 0   | 18 | 18    |
| HR Zones AI Insight      | 0   | 24 | 24    |
| HR Zones                 | 6   | 0  | 6     |
| Lazy Compute Metrics     | 3   | 0  | 3     |
| Map Style Toggle         | 0   | 14 | 14    |
| Racing Weight Profile    | 12  | 0  | 12    |
| RPE Section              | 0   | 12 | 12    |
| Satellite Map            | 0   | 13 | 13    |
| Splits Bar Chart         | 0   | 24 | 24    |
| Stream Charts            | 7   | 14 | 21    |
| **Subtotal**             | **87** | **249** | **336** |

#### Dashboard

| Feature              | API | UI | Total |
| -------------------- | --- | -- | ----- |
| AI Coach             | 0   | 20 | 20    |
| Dashboard            | 42  | 28 | 70    |
| Dashboard Extended   | 0   | 14 | 14    |
| Gear                 | 6   | 18 | 24    |
| Weekly Stats Filter  | 17  | 0  | 17    |
| **Subtotal**         | **65** | **80** | **145** |

#### AI Coach

| Feature              | API | UI | Total |
| -------------------- | --- | -- | ----- |
| AI Coach Page        | 0   | 56 | 56    |
| Friday Prep Card     | 0   | 44 | 44    |
| AI Coach API         | 44  | 0  | 44    |
| **Subtotal**         | **44** | **100** | **144** |

#### Analytics

| Feature                | API | UI | Total |
| ---------------------- | --- | -- | ----- |
| Analytics AI           | 15  | 20 | 35    |
| Analytics              | 0   | 9  | 9     |
| Endurance Score        | 9   | 0  | 9     |
| Fitness Age            | 10  | 0  | 10    |
| Gear Analytics         | 10  | 0  | 10    |
| Performance Trends     | 5   | 0  | 5     |
| Personal Bests         | 7   | 19 | 26    |
| Qualifying Run Count   | 0   | 8  | 8     |
| Session Profile        | 18  | 0  | 18    |
| Temperature Efficiency | 24  | 0  | 24    |
| VO2Max Target Effort   | 4   | 31 | 35    |
| Zone Analytics         | 24  | 0  | 24    |
| **Subtotal**           | **126** | **87** | **213** |

#### Injury AI

| Feature          | API | UI | Total |
| ---------------- | --- | -- | ----- |
| Friday Prep      | 0   | 0  | 0     |
| Injury Coach     | 0   | 12 | 12    |
| Symptom Log      | 0   | 0  | 0     |
| **Subtotal**     | **0** | **12** | **12** |

#### Race Log

| Feature                      | API | UI | Total |
| ---------------------------- | --- | -- | ----- |
| Race Log + Upcoming Races    | 56  | 89 | 145   |
| Upcoming Races Target Time   | 0   | 19 | 19    |
| **Subtotal**                 | **56** | **108** | **164** |

#### Manual Entry

| Feature        | API | UI | Total |
| -------------- | --- | -- | ----- |
| Manual Entry   | 0   | 0  | 0     |
| **Subtotal**   | **0** | **0** | **0** |

#### Onboarding

| Feature      | API | UI | Total |
| ------------ | --- | -- | ----- |
| Onboarding   | 12  | 38 | 50    |
| **Subtotal** | **12** | **38** | **50** |

#### Settings

| Feature                  | API | UI | Total |
| ------------------------ | --- | -- | ----- |
| HR Zones                 | 20  | 0  | 20    |
| Settings                 | 27  | 21 | 48    |
| Threshold Pace Detect    | 6   | 0  | 6     |
| **Subtotal**             | **53** | **21** | **74** |

**Running Total — API: 443 | UI: 695 | Total: 1,138**

---

### Landing Page

| Feature        | API | UI | Total |
| -------------- | --- | -- | ----- |
| Landing Page   | 0   | 33 | 33    |
| **Subtotal**   | **0** | **33** | **33** |

---

### Shared

| Feature   | API | UI | Total |
| --------- | --- | -- | ----- |
| Sidebar   | 0   | 8  | 8     |
| **Subtotal** | **0** | **8** | **8** |

---

## Grand Total

| Module               | API   | UI    | Total |
| -------------------- | ----- | ----- | ----- |
| Auth                 | 22    | 107   | 129   |
| Inventory Management | 701   | 454   | 1,155 |
| Trading Management   | 104   | 434   | 538   |
| Running Tracker      | 443   | 695   | 1,138 |
| Landing Page         | 0     | 33    | 33    |
| Shared               | 0     | 8     | 8     |
| **Total**            | **1,270** | **1,731** | **3,001** |
