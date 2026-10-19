// API-only spec: no cy.visit, no DOM assertions.
// Covers /api/running/v1/routes (list, create, PATCH/DELETE :id, export/gpx) and the
// validation of /api/map-directions and /api/map-match. OSRM is never reached: only 401 and
// 400 paths are sent, since a valid body calls the public OSRM demo server.

const validRoute = () => ({
  name: 'Cypress Test Route',
  waypoints: [
    [106.8456, -6.2088],
    [106.847, -6.21],
  ],
  encoded_polyline: '_qekA_qekA??',
  distance_m: 200,
})

// GET /routes

describe('Route Builder API — GET list (authenticated)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with a data array', () => {
    cy.getRoutes().then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body.data).to.be.an('array')
    })
  })

  it('each entry has required fields when list is non-empty', () => {
    cy.getRoutes().then((res) => {
      const entries = res.body.data
      if (entries.length === 0) return
      const entry = entries[0]
      expect(entry).to.have.property('id')
      expect(entry).to.have.property('name')
      expect(entry).to.have.property('distance_m').and.be.a('number')
      expect(entry).to.have.property('encoded_polyline')
      expect(entry).to.have.property('created_at')
    })
  })

  it('list entries carry the polyline, not the waypoints, and never a user_id', () => {
    cy.getRoutes().then((res) => {
      const entries = res.body.data
      if (entries.length === 0) return
      expect(entries[0]).to.not.have.property('waypoints')
      expect(entries[0]).to.not.have.property('user_id')
    })
  })
})

describe('Route Builder API — GET list (unauthenticated)', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('returns 401 without a session', () => {
    cy.getRoutesNoAuth().then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

// POST /routes

describe('Route Builder API — POST save (authenticated)', () => {
  const createdIds = []

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  after(() => {
    cy.setupApiAuthCookies()
    createdIds.forEach((id) => cy.deleteRoute(id))
  })

  it('creates a route and returns 201 with the saved record', () => {
    cy.postRoute(validRoute()).then((res) => {
      expect(res.status).to.eq(201)
      const route = res.body.data
      expect(route).to.have.property('id')
      expect(route.name).to.eq('Cypress Test Route')
      expect(route.distance_m).to.eq(200)
      expect(route.encoded_polyline).to.eq('_qekA_qekA??')
      createdIds.push(route.id)
    })
  })

  it('returns 422 when name is missing', () => {
    const { name, ...body } = validRoute()
    cy.postRoute(body).then((res) => {
      expect(res.status).to.eq(422)
    })
  })

  it('returns 422 when name is an empty string', () => {
    cy.postRoute({ ...validRoute(), name: '' }).then((res) => {
      expect(res.status).to.eq(422)
    })
  })

  it('returns 422 when waypoints has fewer than 2 points', () => {
    cy.postRoute({ ...validRoute(), waypoints: [[-6.2088, 106.8456]] }).then((res) => {
      expect(res.status).to.eq(422)
    })
  })

  it('returns 422 when encoded_polyline is missing', () => {
    const { encoded_polyline, ...body } = validRoute()
    cy.postRoute(body).then((res) => {
      expect(res.status).to.eq(422)
    })
  })

  it('returns 422 when distance_m is 0', () => {
    cy.postRoute({ ...validRoute(), distance_m: 0 }).then((res) => {
      expect(res.status).to.eq(422)
    })
  })

  it('returns 422 when name exceeds 100 characters', () => {
    cy.postRoute({ ...validRoute(), name: 'a'.repeat(101) }).then((res) => {
      expect(res.status).to.eq(422)
    })
  })
})

describe('Route Builder API — POST save (unauthenticated)', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('returns 401 without a session', () => {
    cy.postRouteNoAuth(validRoute()).then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

// PATCH /routes/:id

describe('Route Builder API — PATCH rename (authenticated)', () => {
  let routeId

  before(() => {
    cy.setupApiAuthCookies()
    cy.postRoute(validRoute()).then((res) => {
      if (res.status === 201) routeId = res.body.data.id
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  after(() => {
    if (routeId) {
      cy.setupApiAuthCookies()
      cy.deleteRoute(routeId)
    }
  })

  it('returns 200 with the updated name', function () {
    if (!routeId) this.skip()
    cy.patchRoute(routeId, { name: 'Renamed Cypress Route' }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data.name).to.eq('Renamed Cypress Route')
    })
  })

  it('returns 400 when name is an empty string', function () {
    if (!routeId) this.skip()
    cy.patchRoute(routeId, { name: '' }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })

  it('returns 400 when name is missing', function () {
    if (!routeId) this.skip()
    cy.patchRoute(routeId, {}).then((res) => {
      expect(res.status).to.eq(400)
    })
  })

  it('returns 400 when name exceeds 100 characters', function () {
    if (!routeId) this.skip()
    cy.patchRoute(routeId, { name: 'a'.repeat(101) }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })

  it('returns 404 for an unknown or not-owned id', () => {
    cy.patchRoute(crypto.randomUUID(), { name: 'Should not update' }).then((res) => {
      expect(res.status).to.eq(404)
      expect(res.body).to.have.property('error')
    })
  })

  it('returns 400 for a malformed id', () => {
    cy.patchRoute('not-a-uuid', { name: 'x' }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })

  it('returns 400 for a malformed JSON body', function () {
    if (!routeId) this.skip()
    cy.patchRoute(routeId, '{"name": ', { 'Content-Type': 'application/json' }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })

  it('trims the name and answers with message Renamed', function () {
    if (!routeId) this.skip()
    cy.patchRoute(routeId, { name: '  Trimmed Cypress Route  ' }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.message).to.eq('Renamed')
      expect(res.body.data.name).to.eq('Trimmed Cypress Route')
    })
  })
})

describe('Route Builder API — PATCH rename (unauthenticated)', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('returns 401 without a session', () => {
    cy.patchRouteNoAuth(crypto.randomUUID(), { name: 'Unauth rename' }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

// DELETE /routes/:id

describe('Route Builder API — DELETE (authenticated)', () => {
  let routeId

  before(() => {
    cy.setupApiAuthCookies()
    cy.postRoute(validRoute()).then((res) => {
      if (res.status === 201) routeId = res.body.data.id
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with a confirmation message on successful delete', function () {
    if (!routeId) this.skip()
    cy.deleteRoute(routeId).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('message')
      routeId = null
    })
  })

  it('returns 404 for an unknown or not-owned id', () => {
    cy.deleteRoute(crypto.randomUUID()).then((res) => {
      expect(res.status).to.eq(404)
    })
  })

  it('returns 404 when the route was already deleted', () => {
    cy.postRoute(validRoute()).then((created) => {
      expect(created.status).to.eq(201)
      cy.deleteRoute(created.body.data.id).then((first) => {
        expect(first.status).to.eq(200)
      })
      cy.deleteRoute(created.body.data.id).then((second) => {
        expect(second.status).to.eq(404)
      })
    })
  })

  it('returns 400 for a malformed id', () => {
    cy.deleteRoute('not-a-uuid').then((res) => {
      expect(res.status).to.eq(400)
    })
  })
})

describe('Route Builder API — DELETE (unauthenticated)', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('returns 401 without a session', () => {
    cy.deleteRouteNoAuth(crypto.randomUUID()).then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

// GET /routes/:id/export/gpx

describe('Route Builder API — export GPX', () => {
  const ROUTE_NAME = 'cy846 <Tom & "Jerry"> route'
  let routeId

  before(() => {
    cy.setupApiAuthCookies()
    cy.postRoute({ ...validRoute(), name: ROUTE_NAME }).then((res) => {
      expect(res.status).to.eq(201)
      routeId = res.body.data.id
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  after(() => {
    cy.setupApiAuthCookies()
    if (routeId) cy.deleteRoute(routeId)
  })

  it('returns a GPX file with the right content type and a safe filename', () => {
    cy.exportRouteGpx(routeId).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.headers['content-type']).to.include('application/gpx+xml')
      const disposition = res.headers['content-disposition']
      expect(disposition).to.match(/^attachment; filename="[^"<>&]+\.gpx"$/)
      expect(disposition).to.include('cy846')
    })
  })

  it('writes one trkpt per waypoint, no <ele> tag, and escapes the name', () => {
    cy.exportRouteGpx(routeId).then((res) => {
      const xml = res.body
      expect(xml).to.be.a('string')
      expect(xml.startsWith('<?xml')).to.eq(true)
      expect(xml.match(/<trkpt /g)).to.have.length(2)
      expect(xml).to.not.include('<ele>')
      expect(xml).to.include('<name>cy846 &lt;Tom &amp; &quot;Jerry&quot;&gt; route</name>')
      expect(xml).to.not.include('<Tom')
      expect(xml).to.include('lat="-6.2088" lon="106.8456"')
    })
  })

  it('returns 404 for an unknown or not-owned id', () => {
    cy.exportRouteGpx(crypto.randomUUID()).then((res) => {
      expect(res.status).to.eq(404)
    })
  })

  it("returns 404 for another user's route (read-only check)", function () {
    cy.getOtherUserRouteIdsFromDb().then(({ routeId: otherId }) => {
      if (!otherId) {
        cy.log('no route owned by another user, skipping')
        this.skip()
      }
      cy.exportRouteGpx(otherId).then((res) => {
        expect(res.status).to.eq(404)
      })
    })
  })

  it('returns 400 for a malformed id', () => {
    cy.exportRouteGpx('not-a-uuid').then((res) => {
      expect(res.status).to.eq(400)
    })
  })

  it('returns 401 without a session', () => {
    cy.clearCookies()
    cy.exportRouteGpxNoAuth(crypto.randomUUID()).then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

// POST /map-directions and /map-match (validation only; a valid body would call OSRM)

const point = (i) => [106.8 + i * 0.001, -6.2 + i * 0.001]
const points = (n) => Array.from({ length: n }, (_, i) => point(i))

describe('Route Builder API — map-directions validation', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 401 without a session', () => {
    cy.clearCookies()
    cy.postMapDirectionsNoAuth({ waypoints: points(2) }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })

  it('returns 400 for a missing waypoints field', () => {
    cy.postMapDirections({}).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body.error).to.eq('Validation failed')
    })
  })

  it('returns 400 for a single waypoint', () => {
    cy.postMapDirections({ waypoints: points(1) }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })

  it('returns 400 for more than 500 waypoints', () => {
    cy.postMapDirections({ waypoints: points(501) }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })

  it('returns 400 for out-of-range coordinates', () => {
    cy.postMapDirections({
      waypoints: [
        [200, 0],
        [0, 95],
      ],
    }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })

  it('returns 400 for a malformed JSON body', () => {
    cy.postMapDirections('{"waypoints": ', { 'Content-Type': 'application/json' }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })
})

describe('Route Builder API — map-match validation', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 401 without a session', () => {
    cy.clearCookies()
    cy.postMapMatchNoAuth({ coordinates: points(2) }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })

  it('returns 400 for a missing coordinates field', () => {
    cy.postMapMatch({}).then((res) => {
      expect(res.status).to.eq(400)
    })
  })

  it('returns 400 for a single coordinate', () => {
    cy.postMapMatch({ coordinates: points(1) }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })

  it('returns 400 for more than 500 coordinates', () => {
    cy.postMapMatch({ coordinates: points(501) }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })

  it('returns 400 for a malformed JSON body', () => {
    cy.postMapMatch('{"coordinates": ', { 'Content-Type': 'application/json' }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })
})
