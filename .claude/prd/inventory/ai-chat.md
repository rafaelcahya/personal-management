#### 3.1.5 Inventory AI Chat

**Description:** A chat interface powered by Claude that lets the user ask natural language questions about their inventory data. Context is built from the user's current product list, stock levels, and usage history. Conversation history is not persisted — each request is stateless.

**Route:** Embedded in the Inventory module (no dedicated route)
**API:** `POST /api/chat`

---

**User Story:**

> As a user, I want to ask questions about my inventory in natural language so I can quickly get insights without navigating multiple pages.

---

**Core Features:**

- Send a text message and receive a text response from Claude
- Input field clears automatically after the message is sent
- Loading indicator is shown while the API is processing the request
- Error message is shown if the API call fails

---

**Acceptance Criteria:**

```
GIVEN the user types a message and submits it
WHEN the API call is in progress
THEN a loading indicator is shown and the input is disabled

GIVEN the API responds successfully
WHEN the response arrives
THEN the reply is displayed and the input field is cleared

GIVEN the API call fails (network error or 5xx)
WHEN the error occurs
THEN an error message is shown to the user (e.g. "Something went wrong. Please try again.")
AND the input remains available so the user can retry

GIVEN the user submits an empty message
WHEN the form validates
THEN the message is not sent
```

---

**API:**

`POST /api/chat`

- Auth: Required
- Body: `{ message: string }`
- Description: Sends the user's message to Claude with inventory context (product list, stock levels, usage history) and returns a reply. Each request is independent — no session or conversation history is stored.
- Response: `{ reply: string }`
- Error: 400 if message is empty; 500 on unexpected error

---
