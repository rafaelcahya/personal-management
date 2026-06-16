# QA Coverage Report

**Last Updated:** 2026-06-16
**Branch:** feat/issue-305-tsb-pmc

---

## Summary

| Type      | Tests  | %    |
| --------- | ------ | ---- |
| API       | 1,048  | 37%  |
| UI        | 1,755  | 63%  |
| **Total** | **2,803** | 100% |

---

## Module Overview

| Module               | API | UI    | Total |
| -------------------- | --- | ----- | ----- |
| Auth                 | 22  | 107   | 129   |
| Inventory Management | 637 | 454   | 1,091 |
| Trading Management   | 29  | 450   | 479   |
| Running Tracker      | 360 | 703   | 1,063 |
| Landing Page         | 0   | 33    | 33    |
| Shared               | 0   | 8     | 8     |
| **Total**            | **1,048** | **1,755** | **2,803** |

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
| Dashboard     | 56  | 95 | 151   |
| Summary       | 17  | 0  | 17    |
| **Subtotal**  | **73** | **95** | **168** |

#### Product

| Feature              | API | UI | Total |
| -------------------- | --- | -- | ----- |
| Auth Guard           | 26  | 0  | 26    |
| Add Product          | 40  | 60 | 100   |
| Create Stock         | 40  | 0  | 40    |
| Delete Product       | 23  | 0  | 23    |
| Favorite Product     | 27  | 0  | 27    |
| Last Price           | 17  | 0  | 17    |
| List Product         | 26  | 98 | 124   |
| Product Detail       | 25  | 35 | 60    |
| Product Filter       | 0   | 9  | 9     |
| Product History      | 25  | 0  | 25    |
| Product List Image   | 0   | 9  | 9     |
| Restock Predictions  | 16  | 0  | 16    |
| Product Summary      | 16  | 0  | 16    |
| Update Product       | 39  | 0  | 39    |
| **Subtotal**         | **320** | **211** | **531** |

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
| Product History  | 15  | 28 | 43    |
| **Subtotal**     | **15** | **28** | **43** |

#### Product Name

| Feature          | API | UI | Total |
| ---------------- | --- | -- | ----- |
| Add Name         | 23  | 13 | 36    |
| Bulk Name        | 0   | 16 | 16    |
| Delete Name      | 15  | 0  | 15    |
| List Name        | 11  | 15 | 26    |
| Name Detail      | 20  | 0  | 20    |
| Name Summary     | 13  | 0  | 13    |
| Update Name      | 29  | 14 | 43    |
| **Subtotal**     | **111** | **58** | **169** |

**Inventory Total — API: 637 | UI: 454 | Total: 1,091**

---

### Trading Management

#### Trade

| Feature       | API | UI  | Total |
| ------------- | --- | --- | ----- |
| Auth Guard    | 29  | 0   | 29    |
| Add Trade     | 0   | 109 | 109   |
| Delete Trade  | 0   | 6   | 6     |
| List Trade    | 0   | 6   | 6     |
| Option Trade  | 0   | 7   | 7     |
| Trade Summary | 0   | 10  | 10    |
| Trade Detail  | 0   | 15  | 15    |
| Update Trade  | 0   | 32  | 32    |
| **Subtotal**  | **29** | **185** | **214** |

#### Fee

| Feature      | API | UI | Total |
| ------------ | --- | -- | ----- |
| Add Fee      | 0   | 62 | 62    |
| Delete Fee   | 0   | 6  | 6     |
| Fee Detail   | 0   | 15 | 15    |
| List Fee     | 0   | 6  | 6     |
| Fee Summary  | 0   | 23 | 23    |
| Update Fee   | 0   | 19 | 19    |
| **Subtotal** | **0** | **131** | **131** |

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

**Trading Total — API: 29 | UI: 450 | Total: 479**

---

### Running Tracker

#### Activities

| Feature                  | API | UI | Total |
| ------------------------ | --- | -- | ----- |
| Activity List            | 28  | 21 | 49    |
| Activity Page Title      | 0   | 10 | 10    |
| Activity Detail          | 18  | 41 | 59    |
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
| **Subtotal**             | **82** | **249** | **331** |

#### Dashboard

| Feature              | API | UI | Total |
| -------------------- | --- | -- | ----- |
| AI Coach             | 0   | 20 | 20    |
| Dashboard            | 42  | 28 | 70    |
| Dashboard Extended   | 0   | 14 | 14    |
| Gear                 | 6   | 18 | 24    |
| Performance Trends   | 5   | 0  | 5     |
| **Subtotal**         | **53** | **80** | **133** |

#### AI Coach

| Feature           | API | UI | Total |
| ----------------- | --- | -- | ----- |
| AI Coach Page     | 0   | 56 | 56    |
| Friday Prep Card  | 0   | 44 | 44    |
| **Subtotal**      | **0** | **100** | **100** |

#### Analytics

| Feature                | API | UI | Total |
| ---------------------- | --- | -- | ----- |
| Analytics AI           | 15  | 20 | 35    |
| Analytics              | 0   | 9  | 9     |
| Endurance Score        | 9   | 0  | 9     |
| Fitness Age            | 10  | 0  | 10    |
| Gear Analytics         | 10  | 0  | 10    |
| Personal Bests         | 7   | 19 | 26    |
| Qualifying Run Count   | 0   | 8  | 8     |
| VO2Max Target Effort   | 4   | 31 | 35    |
| Zone Analytics         | 24  | 0  | 24    |
| **Subtotal**           | **79** | **87** | **166** |

#### Injury AI

| Feature          | API | UI | Total |
| ---------------- | --- | -- | ----- |
| Friday Prep      | 6   | 0  | 6     |
| Injury Coach     | 6   | 12 | 18    |
| Symptom Log      | 6   | 0  | 6     |
| **Subtotal**     | **18** | **12** | **30** |

#### Race Log

| Feature                      | API | UI | Total |
| ---------------------------- | --- | -- | ----- |
| Race Log                     | 21  | 51 | 72    |
| Upcoming Races               | 18  | 38 | 56    |
| Upcoming Races Target Time   | 0   | 19 | 19    |
| **Subtotal**                 | **39** | **108** | **147** |

#### Manual Entry

| Feature        | API | UI | Total |
| -------------- | --- | -- | ----- |
| Manual Entry   | 21  | 0  | 21    |
| **Subtotal**   | **21** | **0** | **21** |

#### Onboarding

| Feature      | API | UI | Total |
| ------------ | --- | -- | ----- |
| Onboarding   | 13  | 38 | 51    |
| **Subtotal** | **13** | **38** | **51** |

#### Settings

| Feature                  | API | UI | Total |
| ------------------------ | --- | -- | ----- |
| HR Zones                 | 20  | 0  | 20    |
| Settings                 | 11  | 21 | 32    |
| Threshold Pace Detect    | 6   | 0  | 6     |
| **Subtotal**             | **37** | **21** | **58** |

#### Strava

| Feature             | API | UI | Total |
| ------------------- | --- | -- | ----- |
| Strava Connection   | 6   | 8  | 14    |
| **Subtotal**        | **6** | **8** | **14** |

#### Sync

| Feature      | API | UI | Total |
| ------------ | --- | -- | ----- |
| Sync         | 8   | 0  | 8     |
| **Subtotal** | **8** | **0** | **8** |

#### Push Notification

| Feature             | API | UI | Total |
| ------------------- | --- | -- | ----- |
| Push Subscription   | 4   | 0  | 4     |
| **Subtotal**        | **4** | **0** | **4** |

**Running Total — API: 360 | UI: 703 | Total: 1,063**

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

| Module               | API | UI    | Total |
| -------------------- | --- | ----- | ----- |
| Auth                 | 22  | 107   | 129   |
| Inventory Management | 637 | 454   | 1,091 |
| Trading Management   | 29  | 450   | 479   |
| Running Tracker      | 360 | 703   | 1,063 |
| Landing Page         | 0   | 33    | 33    |
| Shared               | 0   | 8     | 8     |
| **Total**            | **1,048** | **1,755** | **2,803** |
