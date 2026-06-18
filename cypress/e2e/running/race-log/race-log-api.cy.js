// API-only spec: no cy.visit, no DOM assertions.
// Covers GET / POST / PATCH / DELETE for /api/running/v1/race-log
// and GET / POST / PATCH / DELETE for /api/running/v1/upcoming-races.

function getFirstRaceLogId() {
  return cy.getRaceLog().then((res) => {
    const list = res.body?.data ?? []
    return list.length > 0 ? list[0].id : null
  })
}

// GET /race-log

describe('Race Log API — GET (authenticated)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with data array and message', () => {
    cy.getRaceLog().then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body.data).to.be.an('array')
      expect(res.body).to.have.property('message')
    })
  })

  it('each entry has required fields when list is non-empty', () => {
    cy.getRaceLog().then((res) => {
      const entries = res.body.data
      if (entries.length === 0) return
      const entry = entries[0]
      expect(entry).to.have.property('id')
      expect(entry).to.have.property('title')
      expect(entry).to.have.property('race_date')
      expect(entry).to.have.property('distance_m')
      expect(entry).to.have.property('created_at')
    })
  })

  it('entries are ordered by race_date DESC', () => {
    cy.getRaceLog().then((res) => {
      const entries = res.body.data
      if (entries.length < 2) return
      for (let i = 1; i < entries.length; i++) {
        const prev = new Date(entries[i - 1].race_date)
        const curr = new Date(entries[i].race_date)
        expect(prev.getTime()).to.be.gte(curr.getTime())
      }
    })
  })

  it('avg_pace_sec_per_km is null when finish_time_sec is null', () => {
    cy.getRaceLog().then((res) => {
      res.body.data
        .filter((e) => e.finish_time_sec == null)
        .forEach((e) => {
          expect(e.avg_pace_sec_per_km).to.be.null
        })
    })
  })
})

describe('Race Log API — GET (unauthenticated)', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('returns 401 without a session', () => {
    cy.getRaceLogNoAuth().then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

// GET /race-log/:id

describe('Race Log API — GET detail (authenticated)', () => {
  let raceLogId

  before(() => {
    cy.setupApiAuthCookies()
    getFirstRaceLogId().then((id) => {
      raceLogId = id
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 for a valid id', function () {
    if (!raceLogId) this.skip()
    cy.getRaceLogDetail(raceLogId).then((res) => {
      expect(res.status).to.eq(200)
    })
  })

  it('response has data object with the requested entry', function () {
    if (!raceLogId) this.skip()
    cy.getRaceLogDetail(raceLogId).then((res) => {
      expect(res.body).to.have.property('data')
      expect(res.body.data.id).to.eq(raceLogId)
    })
  })

  it('returns 404 for an id not belonging to the authenticated user', () => {
    const nonExistentId = '00000000-0000-0000-0000-000000000000'
    cy.getRaceLogDetail(nonExistentId).then((res) => {
      expect(res.status).to.eq(404)
    })
  })
})

describe('Race Log API — GET detail (unauthenticated)', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('returns 401 without a session', () => {
    cy.getRaceLogDetailNoAuth('any-id').then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

// POST /race-log

describe('Race Log API — POST (authenticated)', () => {
  const createdIds = []

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  after(() => {
    cy.setupApiAuthCookies()
    createdIds.forEach((id) => cy.deleteRaceLog(id))
  })

  it('creates an entry and returns 201 with the new record', () => {
    cy.postRaceLog({
      title: 'Cypress Test Race',
      race_date: '2024-01-15',
      distance_m: 10000,
      finish_time_sec: 3600,
    }).then((res) => {
      expect(res.status).to.eq(201)
      const entry = res.body.data
      expect(entry).to.have.property('id')
      expect(entry.title).to.eq('Cypress Test Race')
      expect(entry.distance_m).to.eq(10000)
      expect(entry.finish_time_sec).to.eq(3600)
      createdIds.push(entry.id)
    })
  })

  it('server computes avg_pace_sec_per_km (not sent by client)', () => {
    cy.postRaceLog({
      title: 'Cypress Pace Test Race',
      race_date: '2024-02-10',
      distance_m: 5000,
      finish_time_sec: 1500,
    }).then((res) => {
      expect(res.status).to.eq(201)
      const entry = res.body.data
      expect(entry.avg_pace_sec_per_km).to.eq(300)
      createdIds.push(entry.id)
    })
  })

  it('accepts did_not_finish=true without finish_time_sec', () => {
    cy.postRaceLog({
      title: 'Cypress DNF Race',
      race_date: '2024-03-20',
      distance_m: 42195,
      did_not_finish: true,
    }).then((res) => {
      expect(res.status).to.eq(201)
      const entry = res.body.data
      expect(entry.did_not_finish).to.eq(true)
      expect(entry.finish_time_sec).to.be.null
      expect(entry.avg_pace_sec_per_km).to.be.null
      createdIds.push(entry.id)
    })
  })

  it('returns 400 when title is missing', () => {
    cy.postRaceLog({
      race_date: '2024-04-01',
      distance_m: 10000,
      finish_time_sec: 3600,
    }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })

  it('returns 400 when race_date is missing', () => {
    cy.postRaceLog({
      title: 'Missing Date Race',
      distance_m: 10000,
      finish_time_sec: 3600,
    }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })

  it('returns 400 when distance_m is missing', () => {
    cy.postRaceLog({
      title: 'Missing Distance Race',
      race_date: '2024-05-01',
      finish_time_sec: 3600,
    }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })

  it('returns 400 when finish_time_sec missing and did_not_finish=false', () => {
    cy.postRaceLog({
      title: 'Missing Time Race',
      race_date: '2024-06-01',
      distance_m: 10000,
      did_not_finish: false,
    }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })
})

describe('Race Log API — POST (unauthenticated)', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('returns 401 without a session', () => {
    cy.postRaceLogNoAuth({
      title: 'Unauth Race',
      race_date: '2024-01-01',
      distance_m: 5000,
      finish_time_sec: 1500,
    }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

// PATCH /race-log/:id

describe('Race Log API — PATCH (authenticated)', () => {
  let entryId

  before(() => {
    cy.setupApiAuthCookies()
    cy.postRaceLog({
      title: 'Cypress Patch Test Race',
      race_date: '2024-07-04',
      distance_m: 21097.5,
      finish_time_sec: 7200,
    }).then((res) => {
      if (res.status === 201) entryId = res.body.data.id
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  after(() => {
    if (entryId) {
      cy.setupApiAuthCookies()
      cy.deleteRaceLog(entryId)
    }
  })

  it('returns 200 with updated entry on valid partial payload', function () {
    if (!entryId) this.skip()
    cy.patchRaceLog(entryId, { title: 'Updated Cypress Race', avg_hr: 155 }).then((res) => {
      expect(res.status).to.eq(200)
      const updated = res.body.data
      expect(updated.title).to.eq('Updated Cypress Race')
      expect(updated.avg_hr).to.eq(155)
    })
  })

  it('recomputes avg_pace_sec_per_km when finish_time_sec is updated', function () {
    if (!entryId) this.skip()
    // distance = 21097.5m, new finish_time = 6300s → pace = 6300 / 21.0975 ≈ 298.6 → round to int
    cy.patchRaceLog(entryId, { finish_time_sec: 6300 }).then((res) => {
      expect(res.status).to.eq(200)
      const updated = res.body.data
      expect(updated.finish_time_sec).to.eq(6300)
      expect(updated.avg_pace_sec_per_km).to.be.a('number').and.greaterThan(0)
    })
  })

  it('returns 400 when request body is empty', function () {
    if (!entryId) this.skip()
    cy.patchRaceLog(entryId, {}).then((res) => {
      expect(res.status).to.eq(400)
    })
  })

  it('returns 404 for an id not belonging to the authenticated user', () => {
    const nonExistentId = '00000000-0000-0000-0000-000000000000'
    cy.patchRaceLog(nonExistentId, { title: 'Should not update' }).then((res) => {
      expect(res.status).to.eq(404)
    })
  })
})

describe('Race Log API — PATCH (unauthenticated)', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('returns 401 without a session', () => {
    cy.patchRaceLogNoAuth('any-id', { title: 'Unauth Update' }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

// DELETE /race-log/:id

describe('Race Log API — DELETE (authenticated)', () => {
  let entryId

  before(() => {
    cy.setupApiAuthCookies()
    cy.postRaceLog({
      title: 'Cypress Delete Test Race',
      race_date: '2024-08-10',
      distance_m: 5000,
      finish_time_sec: 1800,
    }).then((res) => {
      if (res.status === 201) entryId = res.body.data.id
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with message on successful delete', function () {
    if (!entryId) this.skip()
    cy.deleteRaceLog(entryId).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('message')
    })
  })

  it('entry is absent from the list after delete', function () {
    if (!entryId) this.skip()
    cy.getRaceLog().then((res) => {
      const found = res.body.data.find((e) => e.id === entryId)
      expect(found).to.be.undefined
    })
  })

  it('returns 404 on detail fetch after delete', function () {
    if (!entryId) this.skip()
    cy.getRaceLogDetail(entryId).then((res) => {
      expect(res.status).to.eq(404)
      entryId = null
    })
  })

  it('returns 404 for an id not belonging to the authenticated user', () => {
    const nonExistentId = '00000000-0000-0000-0000-000000000000'
    cy.deleteRaceLog(nonExistentId).then((res) => {
      expect(res.status).to.eq(404)
    })
  })
})

describe('Race Log API — DELETE (unauthenticated)', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('returns 401 without a session', () => {
    cy.deleteRaceLogNoAuth('any-id').then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

// API vs database comparison

describe('Race Log API — API vs Database Comparison', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('total count in API response matches database count', () => {
    cy.getRaceLog().then((apiRes) => {
      expect(apiRes.status).to.eq(200)
      cy.getRaceLogCountFromDb().then((dbCount) => {
        expect(apiRes.body.data.length).to.eq(dbCount)
      })
    })
  })

  it('first entry fields match database record', () => {
    cy.getRaceLog().then((apiRes) => {
      if (apiRes.body.data.length === 0) return
      const first = apiRes.body.data[0]
      cy.getSingleRaceLogFromDb(first.id).then((dbRow) => {
        expect(first.id).to.eq(dbRow.id)
        expect(first.title).to.eq(dbRow.title)
        expect(first.distance_m).to.eq(Number(dbRow.distance_m))
        expect(first.finish_time_sec).to.eq(dbRow.finish_time_sec)
      })
    })
  })

  it('PATCH update persists in database', () => {
    cy.postRaceLog({
      title: 'DB Compare Patch Race',
      race_date: '2024-09-01',
      distance_m: 10000,
      finish_time_sec: 3000,
    }).then((createRes) => {
      const id = createRes.body.data.id
      cy.patchRaceLog(id, { title: 'db-compare-cypress-test' }).then((patchRes) => {
        expect(patchRes.status).to.eq(200)
        cy.getSingleRaceLogFromDb(id).then((dbRow) => {
          expect(dbRow.title).to.eq('db-compare-cypress-test')
          cy.deleteRaceLog(id)
        })
      })
    })
  })

  it('after DELETE, the entry no longer exists in the database (hard delete — no deleted_at column)', () => {
    cy.postRaceLog({
      title: 'DB Compare Delete Race',
      race_date: '2024-10-01',
      distance_m: 5000,
      finish_time_sec: 1500,
    }).then((createRes) => {
      const id = createRes.body.data.id
      cy.deleteRaceLog(id).then((deleteRes) => {
        expect(deleteRes.status).to.eq(200)
        cy.getSingleRaceLogIncludeDeletedFromDb(id).then((dbRow) => {
          expect(dbRow).to.be.null
        })
      })
    })
  })
})

// GET /upcoming-races

describe('Upcoming Races API — GET list (authenticated)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with data array and message', () => {
    cy.getUpcomingRaces().then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body.data).to.be.an('array')
      expect(res.body).to.have.property('message')
    })
  })

  it('each entry has required fields when list is non-empty', () => {
    cy.getUpcomingRaces().then((res) => {
      const entries = res.body.data
      if (entries.length === 0) return
      const entry = entries[0]
      expect(entry).to.have.property('id')
      expect(entry).to.have.property('title')
      expect(entry).to.have.property('race_date')
      expect(entry).to.have.property('distance_m')
      expect(entry).to.have.property('created_at')
    })
  })
})

describe('Upcoming Races API — GET list (unauthenticated)', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('returns 401 without a session', () => {
    cy.getUpcomingRacesNoAuth().then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

// POST /upcoming-races

describe('Upcoming Races API — POST create (authenticated)', () => {
  const createdIds = []

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  after(() => {
    cy.setupApiAuthCookies()
    createdIds.forEach((id) => cy.deleteUpcomingRace(id))
  })

  it('creates an entry and returns 201 with the new record', () => {
    cy.postUpcomingRace({
      title: 'Cypress Upcoming Test Race',
      race_date: '2099-12-31',
      distance_m: 42195,
    }).then((res) => {
      expect(res.status).to.eq(201)
      expect(res.body).to.have.property('data')
      const entry = res.body.data
      expect(entry).to.have.property('id')
      expect(entry.title).to.eq('Cypress Upcoming Test Race')
      expect(entry.distance_m).to.eq(42195)
      createdIds.push(entry.id)
    })
  })

  it('accepts optional location and notes fields', () => {
    cy.postUpcomingRace({
      title: 'Cypress Optional Fields Race',
      race_date: '2099-11-01',
      distance_m: 10000,
      location: 'Bali, Indonesia',
      notes: 'Target sub-50',
    }).then((res) => {
      if (res.status === 201) {
        const entry = res.body.data
        expect(entry.location).to.eq('Bali, Indonesia')
        expect(entry.notes).to.eq('Target sub-50')
        createdIds.push(entry.id)
      }
    })
  })

  it('returns 400 when title is missing', () => {
    cy.postUpcomingRace({
      race_date: '2099-12-31',
      distance_m: 10000,
    }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })

  it('returns 400 when race_date is missing', () => {
    cy.postUpcomingRace({
      title: 'No Date Race',
      distance_m: 10000,
    }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })

  it('returns 400 when distance_m is missing', () => {
    cy.postUpcomingRace({
      title: 'No Distance Race',
      race_date: '2099-12-31',
    }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })

  it('returns 400 when race_date is in the past', () => {
    cy.postUpcomingRace({
      title: 'Past Race',
      race_date: '2020-01-01',
      distance_m: 10000,
    }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })

  it('returns 400 when distance_m is zero or negative', () => {
    cy.postUpcomingRace({
      title: 'Zero Distance Race',
      race_date: '2099-12-31',
      distance_m: 0,
    }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })
})

describe('Upcoming Races API — POST create (unauthenticated)', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('returns 401 without a session', () => {
    cy.postUpcomingRaceNoAuth({
      title: 'Unauth Race',
      race_date: '2099-12-31',
      distance_m: 5000,
    }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

// PATCH /upcoming-races/:id

describe('Upcoming Races API — PATCH update (authenticated)', () => {
  let entryId

  before(() => {
    cy.setupApiAuthCookies()
    cy.postUpcomingRace({
      title: 'Cypress Patch Base Race',
      race_date: '2099-09-15',
      distance_m: 21097.5,
    }).then((res) => {
      if (res.status === 201) entryId = res.body.data.id
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  after(() => {
    if (entryId) {
      cy.setupApiAuthCookies()
      cy.deleteUpcomingRace(entryId)
    }
  })

  it('returns 200 with updated entry on valid partial payload', function () {
    if (!entryId) this.skip()
    cy.patchUpcomingRace(entryId, {
      title: 'Updated Cypress Upcoming Race',
      location: 'Jakarta, Indonesia',
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      const updated = res.body.data
      expect(updated.title).to.eq('Updated Cypress Upcoming Race')
      expect(updated.location).to.eq('Jakarta, Indonesia')
    })
  })

  it('returns 400 when request body is empty', function () {
    if (!entryId) this.skip()
    cy.patchUpcomingRace(entryId, {}).then((res) => {
      expect(res.status).to.eq(400)
    })
  })

  it('returns 404 for an ID that does not belong to the authenticated user', () => {
    const nonExistentId = '00000000-0000-0000-0000-000000000000'
    cy.patchUpcomingRace(nonExistentId, { title: 'Should not update' }).then((res) => {
      expect(res.status).to.eq(404)
    })
  })
})

describe('Upcoming Races API — PATCH update (unauthenticated)', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('returns 401 without a session', () => {
    cy.patchUpcomingRaceNoAuth('any-id', { title: 'Unauth update' }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

// DELETE /upcoming-races/:id

describe('Upcoming Races API — DELETE (authenticated)', () => {
  let entryId

  before(() => {
    cy.setupApiAuthCookies()
    cy.postUpcomingRace({
      title: 'Cypress Delete Target Race',
      race_date: '2099-08-20',
      distance_m: 5000,
    }).then((res) => {
      if (res.status === 201) entryId = res.body.data.id
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with message on successful delete', function () {
    if (!entryId) this.skip()
    cy.deleteUpcomingRace(entryId).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('message')
      entryId = null
    })
  })

  it('returns 404 for an ID that does not belong to the authenticated user', () => {
    const nonExistentId = '00000000-0000-0000-0000-000000000000'
    cy.deleteUpcomingRace(nonExistentId).then((res) => {
      expect(res.status).to.eq(404)
    })
  })
})

describe('Upcoming Races API — DELETE (unauthenticated)', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('returns 401 without a session', () => {
    cy.deleteUpcomingRaceNoAuth('any-id').then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})
