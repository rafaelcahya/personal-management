# Pending Cross-Agent Signals

> This file is the central inbox for all cross-agent communication.
> Every agent reads this at kickoff. After handling a signal, mark it `[RESOLVED]` — never delete rows.

---

## How to Use

**Writing a signal:**

1. Append a new row to the relevant section below
2. Use the exact signal format defined in `shared-knowledge.md`
3. Set status to `[PENDING]`

**Resolving a signal:**

1. Change status from `[PENDING]` to `[RESOLVED: YYYY-MM-DD]`
2. Add a one-line note on what was done

---

## Signals: Tester → Frontend (data-testid requests)

| Status | Date | Signal         |
| ------ | ---- | -------------- |
| —      | —    | No signals yet |

---

## Signals: Tester → Backend (endpoint gaps)

| Status | Date | Signal         |
| ------ | ---- | -------------- |
| —      | —    | No signals yet |

---

## Signals: UI/UX → PM (UX gaps)

| Status | Date | Signal         |
| ------ | ---- | -------------- |
| —      | —    | No signals yet |

---

## Signals: Backend → Frontend (API contracts)

| Status | Date | Signal         |
| ------ | ---- | -------------- |
| —      | —    | No signals yet |

---

## Signals: PM → Any Agent (PRD change impact)

| Status                 | Date       | Target      | Signal                                                                                              |
| ---------------------- | ---------- | ----------- | --------------------------------------------------------------------------------------------------- |
| [RESOLVED: 2026-05-10] | 2026-05-10 | UI/UX Agent | Product List analysis complete. Design review selesai, PRD v1.8 sudah diupdate dengan spec lengkap. |
