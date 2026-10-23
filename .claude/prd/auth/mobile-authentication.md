#### 3.3.6 Mobile Authentication (Google Sign-In)

> **Moving to the mobile repo (2026-10-23).** This feature now lives in the mobile repo PRD (`authentication.md`). The Supabase redirect URL config is in `shared/mobile-backend.md`, section 3.3.6. Don't edit this file anymore.

**Status:** Draft
**Release:** TBD (proposed v1.34, with the mobile app)
**Issue:** #874

**What it is**
The mobile app signs me in with Google, the same way the web does. Same Supabase project, same Google account, same data. This file is the detailed version of the sign-in part in `shared/mobile-app.md`, section 11.3. The Bearer token backend work is in section 11.4 of that file.

How it maps to the web:

| Web (sections 3.3.1–3.3.4)                       | Mobile                                                              |
| ------------------------------------------------ | ------------------------------------------------------------------- |
| `/login` page with "Sign in with Google"         | Sign-in screen with the same button                                 |
| `signInWithOAuth()` redirects to Google          | `signInWithOAuth()` opens Google in the system browser              |
| Callback `/auth/v1/callback?code=xxx`            | Deep link `pmapp://auth/callback?code=xxx`                          |
| Server exchanges the code, sets a session cookie | App exchanges the code, keeps the session in secure storage         |
| `?error=auth_failed`, `?error=no_code`           | Same two errors, shown as a message on the sign-in screen           |
| `?reason=session_expired`                        | Same message after a failed token refresh                           |
| `?next=` sends me back to the page I wanted      | Not needed. The app always lands on the Run tab                     |
| `AuthListener` watches for `SIGNED_OUT`          | App watches `onAuthStateChange` for `SIGNED_OUT`                    |
| Logout button calls `POST /api/auth/logout`      | Sign out in Settings clears the phone, then calls the same endpoint |
| Middleware checks the cookie                     | Every API call sends `Authorization: Bearer <access token>`         |

---

##### SIGN-IN FLOW

```
App opens
    │
    ▼
Read session from secure storage
    │
    ├── ✅ Valid (or refreshable) session → Run tab
    │
    └── ❌ No session → Sign-in screen
            │
            ▼
        User taps "Sign in with Google"
            │
            ▼
        Button shows "Redirecting to Google..." and is disabled
            │
            ▼
        signInWithOAuth() → system browser opens Google
        (redirectTo = pmapp://auth/callback, PKCE, access_type=offline, prompt=consent)
            │
            ├── ❌ User closes the browser → "Sign in cancelled"
            │
            ▼
        User approves → browser returns to pmapp://auth/callback?code=xxx
            │
            ├── ❌ no code in the link → "Invalid login attempt. Please try again."
            ├── ❌ code exchange fails → "Login failed. Please try again."
            └── ✅ session saved to secure storage → Run tab
```

---

##### SESSION EXPIRY FLOW

```
Access token expired → app refreshes it with the refresh token
    │
    ├── ✅ Refresh works → I don't notice anything
    │
    └── ❌ Refresh fails (SIGNED_OUT, no intentional sign out)
            │
            ▼
        Secure storage cleared → Sign-in screen
        Shows: "You've been signed out. Please sign in again to continue."
```

---

**Screen: Sign in**

- App identity above the card: app icon and the text "Personal Management" (same as the web login).
- Title "Welcome back" and the same one-line description as the web.
- One button: **Sign in with Google**. The label is the same as the web, not "Continue with Google".
- The button follows Google branding, like the web: white background, light gray border, dark gray text, and the 4-color Google logo (`#4285F4`, `#34A853`, `#FBBC05`, `#EA4335`). In dark mode the button stays white.
- While the browser is opening: button is disabled and says "Redirecting to Google...".
- Messages are shown as a toast on the sign-in screen.

**Session**

- Stored in secure storage (iOS Keychain / Android Keystore), never in plain storage.
- The app refreshes the access token by itself before it expires.
- If an API call gets 401, the app refreshes and tries **once** more. If that fails, I go back to the sign-in screen.
- Only the one owner account can use the app. Any other Google account gets the same result as on the web.

**Sign out** (Settings tab)

1. Mark this as an intentional sign out, so the "session ended" message is not shown.
2. Remove this phone from my push devices (`mobile-push.md`, section 12).
3. Clear the widget data (`mobile-widgets.md`, section 13).
4. Call `POST /api/auth/logout` with the Bearer token. If it fails because there is no internet, still go on. The phone must always be able to sign out.
5. Clear secure storage and go to the sign-in screen.

Label: "Sign out" while idle, "Signing out..." while working. Neutral color, not red, same as the web.

**User stories**

- As the owner, I want to sign in with the same Google account as the web, so that I see my own data on my phone without setting anything up again.
- As the owner, I want to stay signed in after I close the app, so that I don't sign in every time I go for a run.
- As the owner, I want a clear message when sign-in fails or I cancel, so that I know what to do next.
- As the owner, I want to sign out fully from my phone, so that nobody who picks it up can see my data or get my notifications.

**Acceptance criteria**

- GIVEN I'm not signed in WHEN I open the app THEN I see the sign-in screen with **Sign in with Google**.
- GIVEN I'm on the sign-in screen WHEN I tap **Sign in with Google** THEN the system browser opens Google and the button shows "Redirecting to Google..." and is disabled.
- GIVEN I approve Google sign-in WHEN the browser returns to `pmapp://auth/callback` with a valid code THEN I land on the Run tab and the session is in secure storage.
- GIVEN I'm signed in WHEN I force-close and reopen the app THEN I go straight to the Run tab.
- GIVEN I close the Google browser without finishing WHEN I come back to the app THEN I stay on the sign-in screen, see "Sign in cancelled", and the button is available again.
- GIVEN the app link has no code WHEN the app handles it THEN I see "Invalid login attempt. Please try again."
- GIVEN the code exchange fails WHEN the app handles it THEN I see "Login failed. Please try again." and the button is available again.
- GIVEN the browser can't open (no internet) WHEN I tap the button THEN I see "Couldn't sign in with Google. Please try again." and the button is available again.
- GIVEN my access token expired WHEN the app calls an API THEN it refreshes and retries once, and I don't notice.
- GIVEN the refresh fails WHEN the app tries to refresh THEN secure storage is cleared and I see the sign-in screen with "You've been signed out. Please sign in again to continue."
- GIVEN I tap **Sign out** WHEN it finishes THEN secure storage is empty, push is off for this phone, widgets show "Sign in to see data", and I see no "session ended" message.
- GIVEN I tap **Sign out** with no internet WHEN it finishes THEN I'm still signed out on this phone.
- GIVEN I sign out on the web WHEN I use the phone THEN the phone session is not affected (each device has its own session).
- GIVEN a forged `pmapp://auth/callback` link with a code I didn't start WHEN the app opens it THEN the exchange fails (PKCE) and I see "Login failed. Please try again."

**Validations**

None for the user. There are no input fields. The app checks that the callback link has a `code`. The server checks the token (signature, expiry, real user).

**Error states**

| Situation                        | What the user sees                                          |
| -------------------------------- | ----------------------------------------------------------- |
| User cancelled Google            | "Sign in cancelled"                                         |
| Callback link has no code        | "Invalid login attempt. Please try again."                  |
| Code exchange failed             | "Login failed. Please try again."                           |
| Browser could not open or no net | "Couldn't sign in with Google. Please try again."           |
| Token refresh failed             | "You've been signed out. Please sign in again to continue." |
| Sign out failed (server error)   | Phone is still signed out locally. No error shown           |

After any error the button goes back to "Sign in with Google" and can be tapped again.

**API**

No new endpoints. Uses:

| Method | Path             | Notes                                                                   |
| ------ | ---------------- | ----------------------------------------------------------------------- |
| POST   | /api/auth/logout | Bearer token accepted (shared/mobile-app.md, section 11.4). Best effort |

**Config**

- Supabase Auth, URL configuration: add `pmapp://auth/callback` to the allowed redirect URLs. Keep the existing web callback.
- Google provider stays the same one the web uses. No new Google client for the browser flow.
- The app only holds the Supabase URL and the public anon key. No secrets in the app.
- Deep link scheme `pmapp` is set in the Expo app config.

**Test ids** (React Native `testID`, same naming as the web)

- `googleSignInBtn_signInScreen`
- `signOutBtn_settingsScreen`

**Definition of done**

- [ ] Sign-in screen matches the web login (identity, texts, Google button branding)
- [ ] Google sign-in works on Android (APK) and iPhone (ad hoc or TestFlight) with PKCE
- [ ] Session kept in secure storage and refreshed by itself
- [ ] Cancel, no code, exchange failed, and expired session show the right messages
- [ ] Sign out clears storage, push, and widgets, and works offline
- [ ] `pmapp://auth/callback` added to Supabase redirect URLs
- [ ] Web login and logout still work exactly as before
- [ ] Manual checklist done on both phones (sign in, cancel, restart, expire, sign out)
- [ ] PRD updated with the final behavior

---
