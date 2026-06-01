import { RUNNING_ENDPOINTS } from '../../../fixtures/endpoints.js'

const BASE_EP = RUNNING_ENDPOINTS.RACE_LOG_LIST

describe('Race Log API — GET (authenticated)', () => {
  before(() => {
    cy.setupApiAuthCookies()
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with data array and message', () => {
    cy.request({
      method: 'GET',
      url: BASE_EP,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body.data).to.be.an('array')
      expect(res.body).to.have.property('message')
    })
  })

  it('each entry has required fields when list is non-empty', () => {
    cy.request({
      method: 'GET',
      url: BASE_EP,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      const entries = res.body.data
      if (entries.length === 0) {
        cy.log('No race log entries yet — skipping field assertions')
        return
      }
      const entry = entries[0]
      expect(entry).to.have.property('id')
      expect(entry).to.have.property('title')
      expect(entry).to.have.property('race_date')
      expect(entry).to.have.property('distance_m')
      expect(entry).to.have.property('created_at')
    })
  })

  it('entries are ordered by race_date DESC', () => {
    cy.request({
      method: 'GET',
      url: BASE_EP,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      const entries = res.body.data
      if (entries.length < 2) {
        cy.log('Fewer than 2 entries — skipping sort order assertion')
        return
      }
      for (let i = 1; i < entries.length; i++) {
        const prev = new Date(entries[i - 1].race_date)
        const curr = new Date(entries[i].race_date)
        expect(prev.getTime()).to.be.gte(curr.getTime())
      }
    })
  })

  it('avg_pace_sec_per_km is null when finish_time_sec is null', () => {
    cy.request({
      method: 'GET',
      url: BASE_EP,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      const dnfEntries = res.body.data.filter(
        (e) => e.finish_time_sec == null || e.did_not_finish === true
      )
      dnfEntries.forEach((e) => {
        if (e.finish_time_sec == null) {
          expect(e.avg_pace_sec_per_km).to.be.null
        }
      })
    })
  })
})

describe('Race Log API — GET (unauthenticated)', () => {
  it('returns 401 without a session', () => {
    cy.clearAllCookies()
    cy.request({
      method: 'GET',
      url: BASE_EP,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

describe('Race Log API — POST (authenticated)', () => {
  let createdId

  before(() => {
    cy.setupApiAuthCookies()
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  after(() => {
    if (createdId) {
      cy.setupApiAuthCookies()
      cy.request({
        method: 'DELETE',
        url: `${BASE_EP}/${createdId}`,
        failOnStatusCode: false,
      })
    }
  })

  it('creates an entry and returns 201 with the new record', () => {
    cy.request({
      method: 'POST',
      url: BASE_EP,
      body: {
        title: 'Cypress Test Race',
        race_date: '2025-01-15',
        distance_m: 10000,
        finish_time_sec: 3600,
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(201)
      expect(res.body).to.have.property('data')
      const entry = res.body.data
      expect(entry).to.have.property('id')
      expect(entry.title).to.eq('Cypress Test Race')
      expect(entry.distance_m).to.eq(10000)
      expect(entry.finish_time_sec).to.eq(3600)
      createdId = entry.id
    })
  })

  it('server computes avg_pace_sec_per_km (not sent by client)', () => {
    cy.request({
      method: 'POST',
      url: BASE_EP,
      body: {
        title: 'Cypress Pace Test Race',
        race_date: '2025-02-10',
        distance_m: 5000,
        finish_time_sec: 1500,
      },
      failOnStatusCode: false,
    }).then((res) => {
      if (res.status === 201) {
        const entry = res.body.data
        expect(entry.avg_pace_sec_per_km).to.eq(300)
        // cleanup
        cy.request({
          method: 'DELETE',
          url: `${BASE_EP}/${entry.id}`,
          failOnStatusCode: false,
        })
      }
    })
  })

  it('accepts did_not_finish=true without finish_time_sec', () => {
    cy.request({
      method: 'POST',
      url: BASE_EP,
      body: {
        title: 'Cypress DNF Race',
        race_date: '2025-03-20',
        distance_m: 42195,
        did_not_finish: true,
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(201)
      const entry = res.body.data
      expect(entry.did_not_finish).to.eq(true)
      expect(entry.finish_time_sec).to.be.null
      expect(entry.avg_pace_sec_per_km).to.be.null
      // cleanup
      cy.request({
        method: 'DELETE',
        url: `${BASE_EP}/${entry.id}`,
        failOnStatusCode: false,
      })
    })
  })

  it('returns 400 when title is missing', () => {
    cy.request({
      method: 'POST',
      url: BASE_EP,
      body: {
        race_date: '2025-04-01',
        distance_m: 10000,
        finish_time_sec: 3600,
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })

  it('returns 400 when race_date is missing', () => {
    cy.request({
      method: 'POST',
      url: BASE_EP,
      body: {
        title: 'Missing Date Race',
        distance_m: 10000,
        finish_time_sec: 3600,
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })

  it('returns 400 when distance_m is missing', () => {
    cy.request({
      method: 'POST',
      url: BASE_EP,
      body: {
        title: 'Missing Distance Race',
        race_date: '2025-05-01',
        finish_time_sec: 3600,
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })

  it('returns 400 when finish_time_sec missing and did_not_finish=false', () => {
    cy.request({
      method: 'POST',
      url: BASE_EP,
      body: {
        title: 'Missing Time Race',
        race_date: '2025-06-01',
        distance_m: 10000,
        did_not_finish: false,
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })
})

describe('Race Log API — POST (unauthenticated)', () => {
  it('returns 401 without a session', () => {
    cy.clearAllCookies()
    cy.request({
      method: 'POST',
      url: BASE_EP,
      body: {
        title: 'Unauth Race',
        race_date: '2025-01-01',
        distance_m: 5000,
        finish_time_sec: 1500,
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

describe('Race Log API — PATCH (authenticated)', () => {
  let entryId

  before(() => {
    cy.setupApiAuthCookies()
    cy.request({
      method: 'POST',
      url: BASE_EP,
      body: {
        title: 'Cypress Patch Test Race',
        race_date: '2025-07-04',
        distance_m: 21097.5,
        finish_time_sec: 7200,
      },
      failOnStatusCode: false,
    }).then((res) => {
      if (res.status === 201) {
        entryId = res.body.data.id
      }
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  after(() => {
    if (entryId) {
      cy.setupApiAuthCookies()
      cy.request({
        method: 'DELETE',
        url: `${BASE_EP}/${entryId}`,
        failOnStatusCode: false,
      })
    }
  })

  it('returns 200 with updated entry on valid partial payload', function () {
    if (!entryId) this.skip()
    cy.request({
      method: 'PATCH',
      url: `${BASE_EP}/${entryId}`,
      body: { title: 'Updated Cypress Race', avg_hr: 155 },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      const updated = res.body.data
      expect(updated.title).to.eq('Updated Cypress Race')
      expect(updated.avg_hr).to.eq(155)
    })
  })

  it('recomputes avg_pace_sec_per_km when finish_time_sec is updated', function () {
    if (!entryId) this.skip()
    // distance = 21097.5m, new finish_time = 6300s → pace = 6300 / 21.0975 ≈ 298.6 → round to int
    cy.request({
      method: 'PATCH',
      url: `${BASE_EP}/${entryId}`,
      body: { finish_time_sec: 6300 },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      const updated = res.body.data
      expect(updated.finish_time_sec).to.eq(6300)
      expect(updated.avg_pace_sec_per_km).to.be.a('number').and.greaterThan(0)
    })
  })

  it('returns 400 when request body is empty', function () {
    if (!entryId) this.skip()
    cy.request({
      method: 'PATCH',
      url: `${BASE_EP}/${entryId}`,
      body: {},
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })

  it('returns 404 for entry not belonging to the authenticated user', () => {
    const nonExistentId = '00000000-0000-0000-0000-000000000000'
    cy.request({
      method: 'PATCH',
      url: `${BASE_EP}/${nonExistentId}`,
      body: { title: 'Should not update' },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(404)
    })
  })
})

describe('Race Log API — PATCH (unauthenticated)', () => {
  it('returns 401 without a session', () => {
    cy.clearAllCookies()
    cy.request({
      method: 'PATCH',
      url: `${BASE_EP}/any-id`,
      body: { title: 'Unauth Update' },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

describe('Race Log API — DELETE (authenticated)', () => {
  let entryId

  before(() => {
    cy.setupApiAuthCookies()
    cy.request({
      method: 'POST',
      url: BASE_EP,
      body: {
        title: 'Cypress Delete Test Race',
        race_date: '2025-08-10',
        distance_m: 5000,
        finish_time_sec: 1800,
      },
      failOnStatusCode: false,
    }).then((res) => {
      if (res.status === 201) {
        entryId = res.body.data.id
      }
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with message on successful delete', function () {
    if (!entryId) this.skip()
    cy.request({
      method: 'DELETE',
      url: `${BASE_EP}/${entryId}`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('message')
      entryId = null
    })
  })

  it('returns 404 for entry not belonging to the authenticated user', () => {
    const nonExistentId = '00000000-0000-0000-0000-000000000000'
    cy.request({
      method: 'DELETE',
      url: `${BASE_EP}/${nonExistentId}`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(404)
    })
  })
})

describe('Race Log API — DELETE (unauthenticated)', () => {
  it('returns 401 without a session', () => {
    cy.clearAllCookies()
    cy.request({
      method: 'DELETE',
      url: `${BASE_EP}/any-id`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})
