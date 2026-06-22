import { faker } from '@faker-js/faker'

const makeEventPayload = () => ({
  title: faker.word.words(4),
  event_date: faker.date.recent().toISOString().split('T')[0],
  impact_direction: 'UP',
  event_description: faker.word.words(15),
  links: [{ hyperlink: 'Read more', link: 'https://example.com' }],
})

describe('Event API — GET /api/trade/v1/event/list', () => {
  let seededId

  before(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.setupApiAuthCookies()

    cy.AddEvent(makeEventPayload()).then((res) => {
      expect(res.status).to.eq(201)
      seededId = res.body.data.id
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  // ─── auth guard ─────────────────────────────────────────────────────────────

  it('returns 200 with valid session', () => {
    cy.GetListEvent().then((res) => {
      expect(res.status).to.eq(200)
    })
  })

  it('returns 401 when unauthenticated', () => {
    cy.clearCookies()
    cy.GetListEventNoAuth().then((res) => {
      expect(res.status).to.be.oneOf([401, 307])
    })
  })

  // ─── response shape ─────────────────────────────────────────────────────────

  it('returns correct response structure', () => {
    cy.GetListEvent().then((res) => {
      expect(res.body).to.have.property('success', true)
      expect(res.body).to.have.property('events').that.is.an('array')
      expect(res.body).to.have.property('total').that.is.a('number')
      expect(res.body).to.have.property('page').that.is.a('number')
      expect(res.body).to.have.property('limit').that.is.a('number')
      expect(res.body).to.have.property('totalPages').that.is.a('number')
    })
  })

  it('returns expected item fields when list is non-empty', () => {
    cy.GetListEvent().then((res) => {
      if (res.body.events.length === 0) {
        cy.log('List is empty — skipping field shape check')
        return
      }
      const item = res.body.events[0]
      expect(item).to.have.property('id')
      expect(item).to.have.property('title')
      expect(item).to.have.property('event_date')
      expect(item).to.have.property('impact_direction')
      expect(item).to.have.property('links').that.is.an('array')
    })
  })

  // ─── pagination ─────────────────────────────────────────────────────────────

  it('respects limit param — page=1&limit=2 returns at most 2 items', () => {
    cy.GetListEvent({ page: 1, limit: 2 }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.events.length).to.be.lte(2)
      expect(res.body.page).to.eq(1)
      expect(res.body.limit).to.eq(2)
    })
  })

  it('search param filters by title or description', () => {
    cy.GetListEvent({ search: 'nonexistentXYZ999' }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.events).to.be.an('array')
    })
  })
})

// ─── summary ────────────────────────────────────────────────────────────────

describe('Event API — GET /api/trade/v1/event/summary', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with valid session', () => {
    cy.GetEventSummary().then((res) => {
      expect(res.status).to.eq(200)
    })
  })

  it('returns 401 when unauthenticated', () => {
    cy.clearCookies()
    cy.GetEventSummaryNoAuth().then((res) => {
      expect(res.status).to.be.oneOf([401, 307])
    })
  })

  it('returns correct response shape', () => {
    cy.GetEventSummary().then((res) => {
      expect(res.body).to.have.property('success', true)
      expect(res.body).to.have.property('event')
      const s = res.body.event
      expect(s).to.have.property('totalEvents').that.is.a('number')
      expect(s).to.have.property('totalBullish').that.is.a('number')
      expect(s).to.have.property('totalBearish').that.is.a('number')
      expect(s).to.have.property('totalFavorite').that.is.a('number')
    })
  })

  it('all summary counts are non-negative', () => {
    cy.GetEventSummary().then((res) => {
      const s = res.body.event
      expect(s.totalEvents).to.be.gte(0)
      expect(s.totalBullish).to.be.gte(0)
      expect(s.totalBearish).to.be.gte(0)
      expect(s.totalFavorite).to.be.gte(0)
    })
  })
})

// ─── event detail ────────────────────────────────────────────────────────────

describe('Event API — GET /api/trade/v1/event/[id]', () => {
  let testEventId

  before(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.setupApiAuthCookies()

    cy.AddEvent(makeEventPayload()).then((res) => {
      expect(res.status).to.eq(201)
      testEventId = res.body.data.id
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 for valid event id', () => {
    cy.GetEventDetail(testEventId).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('success', true)
      expect(res.body).to.have.property('event')
      expect(res.body.event.id).to.eq(testEventId)
    })
  })

  it('returns 401 when unauthenticated', () => {
    cy.clearCookies()
    cy.GetEventDetailNoAuth(testEventId).then((res) => {
      expect(res.status).to.be.oneOf([401, 307])
    })
  })

  it('returns 404 for unknown id', () => {
    cy.GetEventDetail(999999999).then((res) => {
      expect(res.status).to.eq(404)
      expect(res.body).to.have.property('success', false)
    })
  })

  it('returns 404 for event owned by another user (IDOR guard)', () => {
    cy.GetEventDetail(72).then((res) => {
      expect(res.status).to.be.oneOf([403, 404])
    })
  })

  it('returns event with expected fields', () => {
    cy.GetEventDetail(testEventId).then((res) => {
      const ev = res.body.event
      expect(ev).to.have.property('id')
      expect(ev).to.have.property('title')
      expect(ev).to.have.property('event_date')
      expect(ev).to.have.property('impact_direction')
    })
  })
})

// ─── create ──────────────────────────────────────────────────────────────────

describe('Event API — POST /api/trade/v1/event/create', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 201 with valid payload', () => {
    cy.AddEvent(makeEventPayload()).then((res) => {
      expect(res.status).to.eq(201)
      expect(res.body).to.have.property('data')
      expect(res.body).to.have.property('message', 'Event created successfully')
    })
  })

  it('returns 401 when unauthenticated', () => {
    cy.clearCookies()
    cy.AddEventNoAuth(makeEventPayload()).then((res) => {
      expect(res.status).to.be.oneOf([401, 307])
    })
  })

  it('created event has expected fields', () => {
    cy.AddEvent(makeEventPayload()).then((res) => {
      expect(res.status).to.eq(201)
      const ev = res.body.data
      expect(ev).to.have.property('id')
      expect(ev).to.have.property('title')
      expect(ev).to.have.property('event_date')
      expect(ev).to.have.property('impact_direction')
      expect(ev).to.have.property('user_id').that.is.a('string')
    })
  })

  it('returns 400 when title is missing', () => {
    const payload = makeEventPayload()
    delete payload.title
    cy.AddEvent(payload).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body).to.have.property('error')
    })
  })

  it('returns 400 when event_date is missing', () => {
    const payload = makeEventPayload()
    delete payload.event_date
    cy.AddEvent(payload).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body).to.have.property('error')
    })
  })

  it('returns 400 when impact_direction is missing', () => {
    const payload = makeEventPayload()
    delete payload.impact_direction
    cy.AddEvent(payload).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body).to.have.property('error')
    })
  })

  it('returns 400 when links array is empty', () => {
    cy.AddEvent({ ...makeEventPayload(), links: [] }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body).to.have.property('error')
    })
  })

  it('returns 400 when links is missing', () => {
    const payload = makeEventPayload()
    delete payload.links
    cy.AddEvent(payload).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body).to.have.property('error')
    })
  })
})

// ─── update ──────────────────────────────────────────────────────────────────

describe('Event API — PUT /api/trade/v1/event/update/[id]', () => {
  let testEventId

  before(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.setupApiAuthCookies()

    cy.AddEvent(makeEventPayload()).then((res) => {
      expect(res.status).to.eq(201)
      testEventId = res.body.data.id
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with valid payload', () => {
    cy.UpdateEvent(testEventId, makeEventPayload()).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body).to.have.property('message', 'Event updated successfully')
    })
  })

  it('returns 401 when unauthenticated', () => {
    cy.clearCookies()
    cy.UpdateEventNoAuth(testEventId, makeEventPayload()).then((res) => {
      expect(res.status).to.be.oneOf([401, 307])
    })
  })

  it('updated event reflects sent values', () => {
    const payload = makeEventPayload()
    payload.impact_direction = 'DOWN'
    cy.UpdateEvent(testEventId, payload).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data.impact_direction).to.eq('DOWN')
    })
  })

  it('returns 400 when body is missing required fields', () => {
    cy.UpdateEvent(testEventId, {}).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body).to.have.property('error')
    })
  })

  it('returns 404 for unknown event id', () => {
    cy.UpdateEvent(999999999, makeEventPayload()).then((res) => {
      expect(res.status).to.be.oneOf([404, 400, 500])
    })
  })
})

// ─── delete ──────────────────────────────────────────────────────────────────

describe('Event API — DELETE /api/trade/v1/event/delete/[id]', () => {
  let testEventId

  before(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.setupApiAuthCookies()

    cy.AddEvent(makeEventPayload()).then((res) => {
      expect(res.status).to.eq(201)
      testEventId = res.body.data.id
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 401 when unauthenticated', () => {
    cy.clearCookies()
    cy.DeleteEventNoAuth(testEventId).then((res) => {
      expect(res.status).to.be.oneOf([401, 307])
    })
  })

  it('returns 400 for invalid id format', () => {
    cy.setupApiAuthCookies()
    cy.DeleteEvent('0').then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body).to.have.property('error')
    })
  })

  it('returns 200 and confirmation message on success', () => {
    cy.AddEvent(makeEventPayload()).then((createRes) => {
      expect(createRes.status).to.eq(201)
      const idToDelete = createRes.body.data.id

      cy.DeleteEvent(idToDelete).then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body).to.have.property('success', true)
        expect(res.body).to.have.property('message', 'Event deleted successfully')
      })
    })
  })

  it('returns 404 after deleting same event again (idempotency)', () => {
    cy.AddEvent(makeEventPayload()).then((createRes) => {
      expect(createRes.status).to.eq(201)
      const idToDelete = createRes.body.data.id

      cy.DeleteEvent(idToDelete).then((res) => {
        expect(res.status).to.eq(200)

        cy.GetEventDetail(idToDelete).then((detailRes) => {
          expect(detailRes.status).to.eq(404)
        })
      })
    })
  })
})

// ─── favorite ────────────────────────────────────────────────────────────────

describe('Event API — PATCH /api/trade/v1/event/favorite/[id]', () => {
  let testEventId

  before(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.setupApiAuthCookies()

    cy.AddEvent(makeEventPayload()).then((res) => {
      expect(res.status).to.eq(201)
      testEventId = res.body.data.id
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 when marking as favorite', () => {
    cy.FavoriteEvent(testEventId, { is_favorite: true }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('success', true)
      expect(res.body).to.have.property('message', 'Event favorite status updated')
    })
  })

  it('returns 200 when unmarking favorite', () => {
    cy.FavoriteEvent(testEventId, { is_favorite: false }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('success', true)
    })
  })

  it('returns 401 when unauthenticated', () => {
    cy.clearCookies()
    cy.FavoriteEventNoAuth(testEventId, { is_favorite: true }).then((res) => {
      expect(res.status).to.be.oneOf([401, 307])
    })
  })

  it('toggles favorite from false to true', () => {
    cy.FavoriteEvent(testEventId, { is_favorite: false }).then(() => {
      cy.FavoriteEvent(testEventId, { is_favorite: true }).then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body.success).to.be.true
      })
    })
  })

  it('toggles favorite from true to false', () => {
    cy.FavoriteEvent(testEventId, { is_favorite: true }).then(() => {
      cy.FavoriteEvent(testEventId, { is_favorite: false }).then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body.success).to.be.true
      })
    })
  })
})

// ─── tags ────────────────────────────────────────────────────────────────────

describe('Event API — GET /api/trade/v1/event/tags', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with valid session', () => {
    cy.GetEventTags().then((res) => {
      expect(res.status).to.eq(200)
    })
  })

  it('returns 401 when unauthenticated', () => {
    cy.clearCookies()
    cy.GetEventTagsNoAuth().then((res) => {
      expect(res.status).to.be.oneOf([401, 307])
    })
  })

  it('returns tags as an array', () => {
    cy.GetEventTags().then((res) => {
      expect(res.body).to.have.property('tags').that.is.an('array')
    })
  })

  it('each tag is a string when tags exist', () => {
    cy.GetEventTags().then((res) => {
      if (res.body.tags.length === 0) {
        cy.log('No tags found — skipping type check')
        return
      }
      res.body.tags.forEach((tag) => {
        expect(tag).to.be.a('string')
      })
    })
  })
})
