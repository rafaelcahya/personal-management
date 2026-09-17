// API-only spec: cy.request only (via custom commands) — no cy.visit, no DOM assertions.
// Covers global navbar notification center (#801) and the realtime bell (#818):
//   GET /api/notifications/v1              — list, paginated, filterable by status
//   GET /api/notifications/v1/unread-count — unread count
//   PUT /api/notifications/v1/read         — mark one notification read
//   PUT /api/notifications/v1/read-all     — mark all notifications read
//
// Realtime bell (#818): the feature streams notification row changes over
// Supabase Realtime to the navbar bell. Websocket delivery can't be asserted
// with cy.request, so these tests cover the DATA CONTRACT the bell relies on:
//   - the row shape the realtime INSERT handler prepends + NotificationRow renders
//   - a freshly inserted unread row raises unread-count and sorts newest-first
//     (the onInsert "badge +1 / prepend" contract)
//   - marking it read lowers the count back (the onUpdate "reconcile" contract)
// Seeding uses the seedNotification/deleteNotification cy.tasks (admin client),
// since notifications have no create API.
//
// IDOR test setup: the "PUT /read IDOR protection" suite needs a notification
// row owned by a user other than CYPRESS_TEST_EMAIL. Seed one via Supabase
// before running, then pass its id as an env var:
//   insert into notifications (user_id, type, title, message, is_read)
//   values ('<some-other-auth-user-id>', 'product_update', 'IDOR test row', 'seed', false)
//   returning id;
// npx cypress run --config-file=cypress.config.js --headed --browser chrome \
//   --spec "cypress/e2e/notifications/notifications-api.cy.js" \
//   --env FOREIGN_NOTIFICATION_ID=<seeded id>
// Delete the seeded row after the run completes.

// ─── auth guard ────────────────────────────────────────────────────────────────

describe('Notifications API — auth guard', () => {
  beforeEach(() => {
    cy.clearAllCookies()
    cy.clearAllLocalStorage()
  })

  it('GET / returns 401 when unauthenticated', () => {
    cy.getNotificationsNoAuth().then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error')
    })
  })

  it('GET /unread-count returns 401 when unauthenticated', () => {
    cy.getUnreadNotificationCountNoAuth().then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error')
    })
  })

  it('PUT /read returns 401 when unauthenticated', () => {
    cy.putNotificationReadNoAuth({ id: 1 }).then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error')
    })
  })

  it('PUT /read-all returns 401 when unauthenticated', () => {
    cy.putAllNotificationsReadNoAuth().then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error')
    })
  })
})

// ─── list — response shape ──────────────────────────────────────────────────────

describe('Notifications API — GET list response shape (authenticated)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with data object and message', () => {
    cy.getNotifications().then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body).to.have.property('message', 'OK')
    })
  })

  it('data contains items, page, limit, total, totalPages, hasMore', () => {
    cy.getNotifications().then((res) => {
      const { data } = res.body
      expect(data).to.include.all.keys('items', 'page', 'limit', 'total', 'totalPages', 'hasMore')
      expect(data.items).to.be.an('array')
    })
  })

  it('page, limit, total, totalPages are numbers and hasMore is boolean', () => {
    cy.getNotifications().then((res) => {
      const { data } = res.body
      expect(data.page).to.be.a('number')
      expect(data.limit).to.be.a('number')
      expect(data.total).to.be.a('number')
      expect(data.totalPages).to.be.a('number')
      expect(data.hasMore).to.be.a('boolean')
    })
  })

  it('default page is 1 and default limit is 20 when no query params sent', () => {
    cy.getNotifications().then((res) => {
      const { data } = res.body
      expect(data.page).to.eq(1)
      expect(data.limit).to.eq(20)
    })
  })

  it('each item has id, type, title, message, data, is_read, created_at, read_at fields', () => {
    cy.getNotifications().then((res) => {
      const { items } = res.body.data
      if (items.length === 0) {
        return cy.log('No notification items — field shape skipped')
      }
      items.forEach((item) => {
        expect(item).to.include.all.keys(
          'id',
          'type',
          'title',
          'message',
          'data',
          'is_read',
          'created_at',
          'read_at'
        )
      })
    })
  })

  it('each item type is one of the known notification types', () => {
    const validTypes = [
      'post_activity',
      'weekly_review',
      'friday_prep',
      'anomaly',
      'race_reminder',
      'product_update',
      'pr_achieved',
      'gear_mileage',
    ]
    cy.getNotifications().then((res) => {
      const { items } = res.body.data
      if (items.length === 0) return cy.log('No notification items — type check skipped')
      items.forEach((item) => {
        expect(validTypes).to.include(item.type)
      })
    })
  })

  it('each item is_read is a boolean', () => {
    cy.getNotifications().then((res) => {
      const { items } = res.body.data
      if (items.length === 0) return cy.log('No notification items — is_read check skipped')
      items.forEach((item) => {
        expect(item.is_read).to.be.a('boolean')
      })
    })
  })

  it('items are ordered newest first by created_at', () => {
    cy.getNotifications().then((res) => {
      const { items } = res.body.data
      if (items.length < 2) return cy.log('Fewer than 2 items — order check skipped')
      for (let i = 1; i < items.length; i++) {
        expect(new Date(items[i].created_at).getTime()).to.be.lte(
          new Date(items[i - 1].created_at).getTime()
        )
      }
    })
  })
})

// ─── list — pagination ───────────────────────────────────────────────────────────

describe('Notifications API — GET list pagination (authenticated)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('?limit=5 returns at most 5 items (dropdown "latest 5" use case)', () => {
    cy.getNotifications({ limit: 5 }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data.items.length).to.be.lte(5)
      expect(res.body.data.limit).to.eq(5)
    })
  })

  it('?page=2&limit=5 returns page 2 with correct echoed page/limit', () => {
    cy.getNotifications({ page: 2, limit: 5 }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data.page).to.eq(2)
      expect(res.body.data.limit).to.eq(5)
    })
  })

  it('totalPages matches ceil(total / limit)', () => {
    cy.getNotifications({ limit: 5 }).then((res) => {
      const { total, limit, totalPages } = res.body.data
      expect(totalPages).to.eq(Math.max(1, Math.ceil(total / limit)))
    })
  })

  it('hasMore is false on the last page', () => {
    cy.getNotifications({ limit: 5 }).then((res) => {
      const { totalPages } = res.body.data
      cy.getNotifications({ page: totalPages, limit: 5 }).then((lastPageRes) => {
        expect(lastPageRes.body.data.hasMore).to.eq(false)
      })
    })
  })
})

// ─── list — status filter ────────────────────────────────────────────────────────

describe('Notifications API — GET list status filter (authenticated)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('?status=unread returns only unread items', () => {
    cy.getNotifications({ status: 'unread', limit: 50 }).then((res) => {
      expect(res.status).to.eq(200)
      const { items } = res.body.data
      if (items.length === 0) return cy.log('No unread items — filter check skipped')
      items.forEach((item) => {
        expect(item.is_read).to.eq(false)
      })
    })
  })

  it('?status=read returns only read items', () => {
    cy.getNotifications({ status: 'read', limit: 50 }).then((res) => {
      expect(res.status).to.eq(200)
      const { items } = res.body.data
      if (items.length === 0) return cy.log('No read items — filter check skipped')
      items.forEach((item) => {
        expect(item.is_read).to.eq(true)
      })
    })
  })

  it('?status=all (default) returns both read and unread items', () => {
    cy.getNotifications({ status: 'all' }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data.items).to.be.an('array')
    })
  })
})

// ─── list — validation ──────────────────────────────────────────────────────────

describe('Notifications API — GET list validation (authenticated)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('?status=invalid_status returns 422', () => {
    cy.getNotifications({ status: 'invalid_status' }).then((res) => {
      expect(res.status).to.eq(422)
      expect(res.body).to.have.property('issues')
    })
  })

  it('?limit=51 (over max) returns 422', () => {
    cy.getNotifications({ limit: 51 }).then((res) => {
      expect(res.status).to.eq(422)
      expect(res.body).to.have.property('issues')
    })
  })

  it('?limit=0 returns 422', () => {
    cy.getNotifications({ limit: 0 }).then((res) => {
      expect(res.status).to.eq(422)
      expect(res.body).to.have.property('issues')
    })
  })

  it('?page=0 returns 422', () => {
    cy.getNotifications({ page: 0 }).then((res) => {
      expect(res.status).to.eq(422)
      expect(res.body).to.have.property('issues')
    })
  })
})

// ─── unread-count ────────────────────────────────────────────────────────────────

describe('Notifications API — GET unread-count (authenticated)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with data.count as a non-negative integer', () => {
    cy.getUnreadNotificationCount().then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body).to.have.property('message', 'OK')
      expect(Number.isInteger(res.body.data.count)).to.be.true
      expect(res.body.data.count).to.be.gte(0)
    })
  })

  it('count matches the number of unread items returned by the list endpoint', () => {
    cy.getUnreadNotificationCount().then((countRes) => {
      cy.getNotifications({ status: 'unread', limit: 50 }).then((listRes) => {
        // Cross-check against page 1 total — if total unread <= 50 the counts
        // must match exactly; otherwise just assert the count endpoint is >= page size.
        const { total } = listRes.body.data
        if (total <= 50) {
          expect(countRes.body.data.count).to.eq(total)
        } else {
          expect(countRes.body.data.count).to.be.gte(listRes.body.data.items.length)
        }
      })
    })
  })
})

// ─── mark one read ───────────────────────────────────────────────────────────────

describe('Notifications API — PUT /read (authenticated)', () => {
  let seededId

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('marks an unread notification as read: 200 with is_read=true and read_at set', () => {
    // Find an unread notification to mark read; seed one via read-all reset is avoided —
    // instead just pick any unread item, or skip if the account has none available.
    cy.getNotifications({ status: 'unread', limit: 1 }).then((res) => {
      const { items } = res.body.data
      if (items.length === 0) {
        return cy.log('No unread notifications available — mark-read happy path skipped')
      }
      seededId = items[0].id
      cy.putNotificationRead({ id: seededId }).then((putRes) => {
        expect(putRes.status).to.eq(200)
        expect(putRes.body).to.have.property('data')
        expect(putRes.body.data).to.have.property('id', seededId)
        expect(putRes.body.data.is_read).to.eq(true)
        expect(putRes.body.data.read_at).to.not.be.null
      })
    })
  })

  it('returns 422 when id is missing', () => {
    cy.putNotificationRead({}).then((res) => {
      expect(res.status).to.eq(422)
      expect(res.body).to.have.property('issues')
    })
  })

  it('returns 422 when id is not a valid number (e.g. a string word)', () => {
    cy.putNotificationRead({ id: 'not-a-number' }).then((res) => {
      expect(res.status).to.eq(422)
      expect(res.body).to.have.property('issues')
    })
  })

  it('returns 422 when id is negative', () => {
    cy.putNotificationRead({ id: -1 }).then((res) => {
      expect(res.status).to.eq(422)
      expect(res.body).to.have.property('issues')
    })
  })

  it('returns 404 when id does not exist', () => {
    cy.putNotificationRead({ id: 999999999 }).then((res) => {
      expect(res.status).to.eq(404)
      expect(res.body).to.have.property('error')
    })
  })
})

// ─── mark one read — IDOR ────────────────────────────────────────────────────────

describe('Notifications API — PUT /read IDOR protection (authenticated)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 404 when marking a notification owned by another user as read', () => {
    // Notification id owned by FOREIGN_USER_ID (not the test user) — seeded
    // out-of-band via Supabase MCP before this run and cleaned up after.
    // See test run report for the seed/cleanup SQL used.
    const foreignNotificationId = Cypress.env('FOREIGN_NOTIFICATION_ID')
    expect(foreignNotificationId, 'FOREIGN_NOTIFICATION_ID env var must be set').to.exist
    cy.putNotificationRead({ id: Number(foreignNotificationId) }).then((res) => {
      expect(res.status).to.eq(404)
      expect(res.body).to.have.property('error')
    })
  })
})

// ─── mark all read ───────────────────────────────────────────────────────────────

describe('Notifications API — PUT /read-all (authenticated)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with data.success=true', () => {
    cy.putAllNotificationsRead().then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body.data).to.have.property('success', true)
      expect(res.body).to.have.property('message')
    })
  })

  it('unread-count becomes 0 after marking all as read', () => {
    cy.putAllNotificationsRead().then(() => {
      cy.getUnreadNotificationCount().then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body.data.count).to.eq(0)
      })
    })
  })

  it('list with status=unread returns an empty items array after marking all read', () => {
    cy.putAllNotificationsRead().then(() => {
      cy.getNotifications({ status: 'unread' }).then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body.data.items).to.have.length(0)
        expect(res.body.data.total).to.eq(0)
      })
    })
  })
})

// ─── realtime bell — data contract (#818) ────────────────────────────────────────

describe('Notifications API — realtime bell data contract (authenticated)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('list rows expose data as an object or null → NotificationRow reads data?.url safely', () => {
    cy.getNotifications({ limit: 50 }).then((res) => {
      const { items } = res.body.data
      if (items.length === 0) return cy.log('No items — data-field contract skipped')
      items.forEach((item) => {
        expect(item).to.have.property('data')
        if (item.data !== null) expect(item.data).to.be.an('object')
      })
    })
  })

  it('is_read and read_at stay consistent → unread rows have null read_at, read rows have a timestamp', () => {
    // The realtime INSERT handler assumes new rows are unread (read_at null) so
    // it can safely bump the badge; this guards that invariant.
    cy.getNotifications({ limit: 50 }).then((res) => {
      const { items } = res.body.data
      if (items.length === 0) return cy.log('No items — read-state invariant skipped')
      items.forEach((item) => {
        if (item.is_read === false) expect(item.read_at, `row ${item.id} read_at`).to.be.null
        else expect(item.read_at, `row ${item.id} read_at`).to.not.be.null
      })
    })
  })
})

// ─── realtime bell — live-update contract (#818) ─────────────────────────────────

describe('Notifications API — realtime bell live-update contract (authenticated)', () => {
  let userId
  let baselineUnread
  let seededId

  before(() => {
    cy.env(['TEST_EMAIL', 'TEST_PASSWORD']).then(({ TEST_EMAIL, TEST_PASSWORD }) => {
      cy.task('getSupabaseSession', { email: TEST_EMAIL, password: TEST_PASSWORD }).then(
        (session) => {
          expect(session, 'test user session').to.not.be.null
          userId = session.user.id
        }
      )
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
    // Capture the baseline, then seed a fresh unread notification for the test user.
    cy.getUnreadNotificationCount().then((res) => {
      baselineUnread = res.body.data.count
    })
    cy.task('seedNotification', {
      userId,
      type: 'product_update',
      title: 'Cypress realtime seed',
      message: 'Seeded unread notification for the realtime bell contract',
      data: { url: '/main/notifications' },
      is_read: false,
    }).then((row) => {
      seededId = row.id
    })
  })

  afterEach(() => {
    // Always clean up the seeded row, whatever the test did with it.
    cy.task('deleteNotification', { id: seededId })
    seededId = null
  })

  it('a newly inserted unread notification → unread-count rises by one and it sorts newest-first', () => {
    cy.getUnreadNotificationCount().then((res) => {
      expect(res.body.data.count).to.eq(baselineUnread + 1)
    })
    cy.getNotifications({ limit: 5 }).then((res) => {
      const { items } = res.body.data
      expect(items[0].id, 'seeded row is newest-first').to.eq(seededId)
      expect(items[0].is_read).to.eq(false)
      expect(items[0].title).to.eq('Cypress realtime seed')
      expect(items[0].data).to.deep.eq({ url: '/main/notifications' })
    })
  })

  it('marking the seeded notification read → unread-count returns to baseline and it leaves the unread list', () => {
    cy.putNotificationRead({ id: seededId }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data.is_read).to.eq(true)
      expect(res.body.data.read_at).to.not.be.null
    })
    cy.getUnreadNotificationCount().then((res) => {
      expect(res.body.data.count).to.eq(baselineUnread)
    })
    cy.getNotifications({ status: 'unread', limit: 50 }).then((res) => {
      const ids = res.body.data.items.map((n) => n.id)
      expect(ids).to.not.include(seededId)
    })
  })
})
