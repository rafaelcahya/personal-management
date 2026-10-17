# Checklist per HTTP Method

## GET

1. 200 with session, 401 without.
2. Required top-level properties exist (`data`, `total`, `pagination`, ...).
3. Important fields have the right type (`number`, `boolean`, `array`, `string`).
4. Query params work: filters, `page`, `limit` (including the max clamp), `sort` allow-list.
5. When the array can be empty, guard before asserting item fields:

   ```js
   cy.getActivities().then((res) => {
     const items = res.body.data
     if (!items.length) return cy.log('no activities — skipping item shape checks')
     expect(items[0]).to.have.property('id')
   })
   ```

6. Nullable aggregate fields: early return + `cy.log()` before asserting their shape.
7. Invariants beat exact values: `min <= median <= max`, `a.count + b.count === total`.

## POST

1. 201 (or 200/202 for actions) with session, 401 without.
2. Response contains the created data (fields you sent come back).
3. 400 for: missing required field, wrong type (string for number), out-of-range value, invalid enum.
4. 400 for an invalid JSON body where the route handles it.
5. 409 for duplicates when the route has a uniqueness rule.

## PATCH

1. 200 with session, 401 without.
2. Response has the **new** value for the patched field.
3. 400 for wrong type / invalid enum / empty body (when the schema requires at least one field).
4. 404 for an unknown ID.
5. Don't re-check fields you didn't patch.

## PUT

Check the route first — most of this project uses PATCH. If PUT exists:

1. 200 with session, 401 without.
2. Full replace: fields not sent become null/default.
3. 400 for missing required fields / wrong type. 404 for unknown ID.

## DELETE

1. 200 with session, 401 without.
2. Confirmation in the body (`message` or deleted data).
3. 404 for an unknown ID; 404 again for an already-deleted ID.
4. Data actually gone or soft-deleted → only with a DB check (see `db-verification`), not via another GET test.

## IDOR (every route that takes an ID)

- Use an ID owned by another user (seed it via a DB task or pass it with `--env`, like `FOREIGN_NOTIFICATION_ID` in `notifications-api.cy.js`).
- GET/PATCH/DELETE on it must return 404 (or 403) and must not change the row.
- Bulk endpoints: mix one foreign ID into the list and check it isn't touched.
