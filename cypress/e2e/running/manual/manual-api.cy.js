import { RUNNING_ENDPOINTS } from '../../../fixtures/endpoints.js'

const ep = {
  activities: RUNNING_ENDPOINTS.ACTIVITIES,
  subjective_health: RUNNING_ENDPOINTS.SUBJECTIVE_HEALTH,
  weight_log: RUNNING_ENDPOINTS.WEIGHT_LOG,
}

// Use far-past base date with 10-min increments to avoid cross-run dedup collisions.
// Each call to nextTimestamp() advances by 10 min, ensuring no two test activities
// fall within the ±5 min dedup window even if cleanup fails between runs.
const PAST_BASE_MS = new Date('2020-01-01T00:00:00Z').getTime()
let tsCounter = 0
function nextTimestamp() {
  return new Date(PAST_BASE_MS + tsCounter++ * 10 * 60 * 1000).toISOString()
}

/** Minimal valid activity body.
 *  Pass `startedAt` to pin the timestamp (needed for dedup tests). */
function activityBody(startedAt) {
  return {
    started_at: startedAt ?? nextTimestamp(),
    duration_sec: 1800,
    distance_m: 5000,
    activity_type: 'easy',
    notes: 'cypress test run',
  }
}

// Block A — Activities CRUD

describe('Manual API — Activities CRUD (authenticated)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('POST with required fields → 201 with data.id', () => {
    cy.apiRequestWithSession('POST', ep.activities, {
      body: activityBody(),
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(201)
      expect(res.body).to.have.property('data')
      expect(res.body.data).to.have.property('id')

      // cleanup
      cy.apiRequestWithSession('DELETE', `${ep.activities}/${res.body.data.id}`, {
        failOnStatusCode: false,
      })
    })
  })

  it('POST then GET list → created activity appears', () => {
    cy.apiRequestWithSession('POST', ep.activities, {
      body: activityBody(),
      failOnStatusCode: false,
    }).then((postRes) => {
      expect(postRes.status).to.eq(201)
      const createdId = postRes.body.data.id

      cy.apiRequestWithSession('GET', ep.activities, {
        failOnStatusCode: false,
      }).then((listRes) => {
        expect(listRes.status).to.eq(200)
        expect(listRes.body).to.have.property('data').that.is.an('array')
        const found = listRes.body.data.some((a) => a.id === createdId)
        expect(found, 'created activity in list').to.be.true

        // cleanup
        cy.apiRequestWithSession('DELETE', `${ep.activities}/${createdId}`, {
          failOnStatusCode: false,
        })
      })
    })
  })

  it('GET list with ?type=easy → filtered results contain only easy type', () => {
    cy.apiRequestWithSession('GET', ep.activities, {
      qs: { type: 'easy' },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data').that.is.an('array')
      // WB-2: invalid type silently returns empty; valid type must return correctly-typed rows
      res.body.data.forEach((activity) => {
        expect(activity.activity_type).to.eq('easy')
      })
    })
  })

  it('GET list with ?page=abc → 200 with page-1 results (fallback, not error)', () => {
    cy.apiRequestWithSession('GET', ep.activities, {
      qs: { page: 'abc' },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data').that.is.an('array')
    })
  })

  it('GET /:id → 200 with activity and splits keys', () => {
    // create a fresh activity first
    cy.apiRequestWithSession('POST', ep.activities, {
      body: activityBody(),
      failOnStatusCode: false,
    }).then((postRes) => {
      expect(postRes.status).to.eq(201)
      const id = postRes.body.data.id

      cy.apiRequestWithSession('GET', `${ep.activities}/${id}`, {
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body).to.have.property('activity')
        expect(res.body).to.have.property('splits').that.is.an('array')
        expect(res.body.activity.id).to.eq(id)

        // cleanup
        cy.apiRequestWithSession('DELETE', `${ep.activities}/${id}`, {
          failOnStatusCode: false,
        })
      })
    })
  })

  it('GET non-existent activity id → 404', () => {
    const fakeId = '00000000-0000-0000-0000-000000000000'
    cy.apiRequestWithSession('GET', `${ep.activities}/${fakeId}`, {
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(404)
      expect(res.body).to.have.property('error')
    })
  })

  it('PATCH /:id with notes → 200 with updated notes', () => {
    cy.apiRequestWithSession('POST', ep.activities, {
      body: activityBody(),
      failOnStatusCode: false,
    }).then((postRes) => {
      expect(postRes.status).to.eq(201)
      const id = postRes.body.data.id

      cy.apiRequestWithSession('PATCH', `${ep.activities}/${id}`, {
        body: { notes: 'updated by cypress' },
        failOnStatusCode: false,
      }).then((patchRes) => {
        expect(patchRes.status).to.eq(200)
        expect(patchRes.body).to.have.property('data')
        expect(patchRes.body.data.notes).to.eq('updated by cypress')

        // cleanup
        cy.apiRequestWithSession('DELETE', `${ep.activities}/${id}`, {
          failOnStatusCode: false,
        })
      })
    })
  })

  it('PATCH /:id with empty body → 422 validation error', () => {
    cy.apiRequestWithSession('POST', ep.activities, {
      body: activityBody(),
      failOnStatusCode: false,
    }).then((postRes) => {
      expect(postRes.status).to.eq(201)
      const id = postRes.body.data.id

      cy.apiRequestWithSession('PATCH', `${ep.activities}/${id}`, {
        body: {},
        failOnStatusCode: false,
      }).then((patchRes) => {
        expect(patchRes.status).to.eq(422)
        expect(patchRes.body).to.have.property('error', 'Validation failed')

        // cleanup
        cy.apiRequestWithSession('DELETE', `${ep.activities}/${id}`, {
          failOnStatusCode: false,
        })
      })
    })
  })

  // A-9 / A-10: DELETE /:id → 204, then GET → 404
  it('DELETE /:id → 204; subsequent GET → 404', () => {
    cy.apiRequestWithSession('POST', ep.activities, {
      body: activityBody(),
      failOnStatusCode: false,
    }).then((postRes) => {
      expect(postRes.status).to.eq(201)
      const id = postRes.body.data.id

      cy.apiRequestWithSession('DELETE', `${ep.activities}/${id}`, {
        failOnStatusCode: false,
      }).then((delRes) => {
        expect(delRes.status).to.eq(204)

        cy.apiRequestWithSession('GET', `${ep.activities}/${id}`, {
          failOnStatusCode: false,
        }).then((getRes) => {
          expect(getRes.status).to.eq(404)
        })
      })
    })
  })

  it('POST duplicate timestamp within ±5 min → 409 with existing.started_at', () => {
    // Pin timestamp so both requests share the same value
    const sharedTimestamp = nextTimestamp()
    const body = activityBody(sharedTimestamp)

    cy.apiRequestWithSession('POST', ep.activities, {
      body,
      failOnStatusCode: false,
    }).then((firstRes) => {
      expect(firstRes.status).to.eq(201)
      const createdId = firstRes.body.data.id

      cy.apiRequestWithSession('POST', ep.activities, {
        body,
        failOnStatusCode: false,
      }).then((dupRes) => {
        expect(dupRes.status).to.eq(409)
        expect(dupRes.body).to.have.property('existing')
        // S-2 fix: only started_at is exposed, not the full record
        expect(dupRes.body.existing).to.have.property('started_at')
        expect(Object.keys(dupRes.body.existing)).to.deep.eq(['started_at'])

        // cleanup the original
        cy.apiRequestWithSession('DELETE', `${ep.activities}/${createdId}`, {
          failOnStatusCode: false,
        })
      })
    })
  })
})

// Block B — Subjective Health CRUD

describe('Manual API — Subjective Health CRUD (authenticated)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('POST new log_date → 200 with data.id (upsert, not 201)', () => {
    // Use a deterministic date unlikely to collide with real data
    const logDate = '2020-01-15'

    cy.apiRequestWithSession('POST', ep.subjective_health, {
      body: { log_date: logDate, mood: 'good', morning_energy: 3 },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body.data).to.have.property('id')

      // cleanup
      cy.apiRequestWithSession('DELETE', `${ep.subjective_health}/${res.body.data.id}`, {
        failOnStatusCode: false,
      })
    })
  })

  it('POST same log_date twice → 200 both times, second updates the row', () => {
    const logDate = '2020-01-16'

    cy.apiRequestWithSession('POST', ep.subjective_health, {
      body: { log_date: logDate, mood: 'ok' },
      failOnStatusCode: false,
    }).then((firstRes) => {
      expect(firstRes.status).to.eq(200)
      const firstId = firstRes.body.data.id

      cy.apiRequestWithSession('POST', ep.subjective_health, {
        body: { log_date: logDate, mood: 'great' },
        failOnStatusCode: false,
      }).then((secondRes) => {
        expect(secondRes.status).to.eq(200)
        // mood should be updated to 'great'
        expect(secondRes.body.data.mood).to.eq('great')

        // cleanup — use id from the second upsert (same or different row by upsert)
        const idToDelete = secondRes.body.data.id ?? firstId
        cy.apiRequestWithSession('DELETE', `${ep.subjective_health}/${idToDelete}`, {
          failOnStatusCode: false,
        })
      })
    })
  })

  it('GET list → 200 with data array and total', () => {
    cy.apiRequestWithSession('GET', ep.subjective_health, {
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data').that.is.an('array')
      expect(res.body).to.have.property('total').that.is.a('number')
    })
  })

  it('PATCH /:id → 200 updated; DELETE → 204; item no longer in list', () => {
    const logDate = '2020-01-17'

    cy.apiRequestWithSession('POST', ep.subjective_health, {
      body: { log_date: logDate, mood: 'ok', morning_energy: 2 },
      failOnStatusCode: false,
    }).then((postRes) => {
      expect(postRes.status).to.eq(200)
      const id = postRes.body.data.id

      // PATCH
      cy.apiRequestWithSession('PATCH', `${ep.subjective_health}/${id}`, {
        body: { mood: 'great' },
        failOnStatusCode: false,
      }).then((patchRes) => {
        expect(patchRes.status).to.eq(200)
        expect(patchRes.body.data.mood).to.eq('great')

        // DELETE
        cy.apiRequestWithSession('DELETE', `${ep.subjective_health}/${id}`, {
          failOnStatusCode: false,
        }).then((delRes) => {
          expect(delRes.status).to.eq(204)

          // Verify item is gone from list
          cy.apiRequestWithSession('GET', ep.subjective_health, {
            failOnStatusCode: false,
          }).then((listRes) => {
            expect(listRes.status).to.eq(200)
            const found = listRes.body.data.some((row) => row.id === id)
            expect(found, 'deleted item should not appear in list').to.be.false
          })
        })
      })
    })
  })
})

// Block C — Weight Log CRUD

describe('Manual API — Weight Log CRUD (authenticated)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('POST weight entry → 201 with data.id', () => {
    cy.apiRequestWithSession('POST', ep.weight_log, {
      body: { measured_at: nextTimestamp(), weight_kg: 70.5 },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(201)
      expect(res.body).to.have.property('data')
      expect(res.body.data).to.have.property('id')

      // cleanup
      cy.apiRequestWithSession('DELETE', `${ep.weight_log}/${res.body.data.id}`, {
        failOnStatusCode: false,
      })
    })
  })

  it('GET list → 200 with data array and total', () => {
    cy.apiRequestWithSession('GET', ep.weight_log, {
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data').that.is.an('array')
      expect(res.body).to.have.property('total').that.is.a('number')
    })
  })

  it('PATCH /:id notes → 200 updated; DELETE → 204', () => {
    cy.apiRequestWithSession('POST', ep.weight_log, {
      body: { measured_at: nextTimestamp(), weight_kg: 71.0 },
      failOnStatusCode: false,
    }).then((postRes) => {
      expect(postRes.status).to.eq(201)
      const id = postRes.body.data.id

      // PATCH
      cy.apiRequestWithSession('PATCH', `${ep.weight_log}/${id}`, {
        body: { notes: 'after race' },
        failOnStatusCode: false,
      }).then((patchRes) => {
        expect(patchRes.status).to.eq(200)
        expect(patchRes.body).to.have.property('data')
        expect(patchRes.body.data.notes).to.eq('after race')

        // DELETE
        cy.apiRequestWithSession('DELETE', `${ep.weight_log}/${id}`, {
          failOnStatusCode: false,
        }).then((delRes) => {
          expect(delRes.status).to.eq(204)
        })
      })
    })
  })
})

// Block D — Auth Guards (no session setup)

describe('Manual API — Auth Guards (unauthenticated, no session)', () => {
  beforeEach(() => {
    // Ensure no auth cookies from other describe blocks carry over
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('POST /activities without auth → 401 with error field', () => {
    cy.request({
      method: 'POST',
      url: ep.activities,
      headers: { 'Content-Type': 'application/json' },
      body: activityBody(),
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error')
    })
  })

  it('GET /activities without auth → 401 with error field', () => {
    cy.request({
      method: 'GET',
      url: ep.activities,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error')
    })
  })

  it('POST /health/subjective without auth → 401 with error field', () => {
    cy.request({
      method: 'POST',
      url: ep.subjective_health,
      headers: { 'Content-Type': 'application/json' },
      body: { log_date: '2020-01-01', mood: 'ok' },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error')
    })
  })

  it('POST /health/weight without auth → 401 with error field', () => {
    cy.request({
      method: 'POST',
      url: ep.weight_log,
      headers: { 'Content-Type': 'application/json' },
      body: { measured_at: new Date().toISOString(), weight_kg: 70 },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error')
    })
  })
})
