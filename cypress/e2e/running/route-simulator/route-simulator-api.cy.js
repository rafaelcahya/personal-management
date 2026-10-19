// API-only spec: no cy.visit, no DOM assertions.
// Covers /api/running/v1/route-simulations (list, create, preview, :id GET/PATCH/DELETE,
// :id/ai-strategy).
//
// ai-strategy: only the free paths (401, 400, 404) are sent. The 200 path calls Claude and is
// never exercised. Validation on create, preview and PATCH is still 422 (owned by #849); the
// assertions follow what the routes return today.
//
// Cross-user ownership of simulations is covered by the user_id filter in the services (reviewed
// in code): the Cypress account cannot read or create another user's simulation. The 404 checks
// below use random UUIDs, and the activity source uses OTHER_USER_ACTIVITY_ID when it is set.

import constants from '../../../fixtures/app-constants.json'

const SIM_LIST = constants.endpoints.running_route_simulations.list
const SIM_DETAIL = constants.endpoints.running_route_simulations.detail
const STREAM_ROWS = 1500
const SEED_NAME = 'cy846'

const buildGpx = (count = 30, { withEle = true } = {}) => {
  const pts = Array.from({ length: count }, (_, i) => {
    const lat = (-6.2 + i * 0.001).toFixed(6)
    return withEle
      ? `<trkpt lat="${lat}" lon="106.800000"><ele>${(50 + i * 0.5).toFixed(1)}</ele></trkpt>`
      : `<trkpt lat="${lat}" lon="106.800000"/>`
  })
  return (
    '<?xml version="1.0" encoding="UTF-8"?><gpx version="1.1" creator="cy846">' +
    `<trk><trkseg>${pts.join('')}</trkseg></trk></gpx>`
  )
}

const paceInput = (overrides = {}) => ({
  source: 'gpx_upload',
  gpx: buildGpx(),
  target_mode: 'pace',
  target_pace_sec_per_km: 360,
  ...overrides,
})

const createInput = (overrides = {}) => ({
  name: `${SEED_NAME} sim ${Date.now()}`,
  ...paceInput(),
  ...overrides,
})

const sortedKeys = (obj) => Object.keys(obj).sort()

const LIST_KEYS = [
  'created_at',
  'id',
  'is_realistic',
  'name',
  'predicted_time_sec',
  'source',
  'target_mode',
  'target_pace_sec_per_km',
  'target_time_sec',
  'total_distance_m',
  'total_elevation_gain_m',
].sort()

const DETAIL_KEYS = [
  ...LIST_KEYS,
  'source_activity_id',
  'total_elevation_loss_m',
  'effort_flat_pace_sec_per_km',
  'suggested_time_sec',
  'elevation_profile',
  'km_splits',
  'ai_strategy',
  'hr_band',
].sort()

const sweepTaggedSimulations = () => {
  cy.setupApiAuthCookies()
  cy.getRouteSimulations({ limit: 100 }).then((res) => {
    if (res.status !== 200) return
    res.body.data
      .filter((s) => s.name?.startsWith(SEED_NAME))
      .forEach((s) => cy.deleteRouteSimulation(s.id))
  })
}

describe('Route Simulator API — auth guard', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('GET list returns 401 without a session', () => {
    cy.getRouteSimulationsNoAuth().then((res) => {
      expect(res.status).to.eq(401)
    })
  })

  it('POST create returns 401 without a session', () => {
    cy.postRouteSimulationNoAuth(createInput()).then((res) => {
      expect(res.status).to.eq(401)
    })
  })

  it('POST preview returns 401 without a session', () => {
    cy.previewRouteSimulationNoAuth(paceInput()).then((res) => {
      expect(res.status).to.eq(401)
    })
  })

  it('GET :id returns 401 without a session', () => {
    cy.getRouteSimulationNoAuth(crypto.randomUUID()).then((res) => {
      expect(res.status).to.eq(401)
    })
  })

  it('PATCH :id returns 401 without a session', () => {
    cy.patchRouteSimulationNoAuth(crypto.randomUUID(), { name: 'x' }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })

  it('DELETE :id returns 401 without a session', () => {
    cy.deleteRouteSimulationNoAuth(crypto.randomUUID()).then((res) => {
      expect(res.status).to.eq(401)
    })
  })

  it('POST ai-strategy returns 401 without a session', () => {
    cy.postRouteSimulationStrategyNoAuth(crypto.randomUUID(), {}).then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

describe('Route Simulator API — list validation', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  ;['0', '101', 'abc', '-1', '1.5'].forEach((limit) => {
    it(`returns 400 for limit=${limit}`, () => {
      cy.getRouteSimulations({ limit }).then((res) => {
        expect(res.status).to.eq(400)
        expect(res.body.error).to.eq('Validation failed')
      })
    })
  })

  it('accepts the boundary limits 1 and 100', () => {
    cy.getRouteSimulations({ limit: 1 }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data.length).to.be.at.most(1)
    })
    cy.getRouteSimulations({ limit: 100 }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data.length).to.be.at.most(100)
    })
  })

  it('returns the { data, message } envelope with a default of at most 50 rows', () => {
    cy.getRouteSimulations().then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('message')
      expect(res.body.data).to.be.an('array')
      expect(res.body.data.length).to.be.at.most(50)
    })
  })
})

describe('Route Simulator API — create and preview validation', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  // [label, overrides, field that must carry the error]
  const inputCases = [
    ['gpx_upload without gpx', { gpx: undefined }, 'gpx'],
    ['gpx_upload with a blank gpx', { gpx: '   ' }, 'gpx'],
    ['activity source without activity_id', { source: 'activity', gpx: undefined }, 'activity_id'],
    [
      'activity source with a malformed activity_id',
      { source: 'activity', gpx: undefined, activity_id: 'abc' },
      'activity_id',
    ],
    ['pace mode without a pace', { target_pace_sec_per_km: undefined }, 'target_pace_sec_per_km'],
    ['pace below 150 s/km', { target_pace_sec_per_km: 149 }, 'target_pace_sec_per_km'],
    ['pace above 900 s/km', { target_pace_sec_per_km: 901 }, 'target_pace_sec_per_km'],
    ['non-integer pace', { target_pace_sec_per_km: 360.5 }, 'target_pace_sec_per_km'],
    [
      'time mode without a time',
      { target_mode: 'time', target_pace_sec_per_km: undefined },
      'target_time_sec',
    ],
    [
      'time of 0',
      { target_mode: 'time', target_pace_sec_per_km: undefined, target_time_sec: 0 },
      'target_time_sec',
    ],
    [
      'time above 24 h',
      { target_mode: 'time', target_pace_sec_per_km: undefined, target_time_sec: 86401 },
      'target_time_sec',
    ],
    ['unknown source', { source: 'strava' }, 'source'],
    ['unknown target mode', { target_mode: 'speed' }, 'target_mode'],
  ]

  describe('POST create', () => {
    inputCases.forEach(([label, overrides, field]) => {
      it(`returns 422 for ${label}`, () => {
        cy.postRouteSimulation(createInput(overrides)).then((res) => {
          expect(res.status).to.eq(422)
          expect(res.body.error).to.eq('Validation failed')
          expect(res.body.details.fieldErrors, 'field errors').to.have.property(field)
        })
      })
    })

    it('returns 422 when name is missing', () => {
      cy.postRouteSimulation(createInput({ name: undefined })).then((res) => {
        expect(res.status).to.eq(422)
        expect(res.body.details.fieldErrors).to.have.property('name')
      })
    })

    it('returns 422 when name is blank after trimming', () => {
      cy.postRouteSimulation(createInput({ name: '   ' })).then((res) => {
        expect(res.status).to.eq(422)
      })
    })

    it('returns 422 when name exceeds 100 characters', () => {
      cy.postRouteSimulation(createInput({ name: 'a'.repeat(101) })).then((res) => {
        expect(res.status).to.eq(422)
      })
    })

    it('returns 400 for a malformed JSON body', () => {
      cy.postRouteSimulation('{"name": ', { 'Content-Type': 'application/json' }).then((res) => {
        expect(res.status).to.eq(400)
        expect(res.body).to.have.property('error')
      })
    })
  })

  describe('POST preview', () => {
    inputCases.forEach(([label, overrides, field]) => {
      it(`returns 422 for ${label}`, () => {
        cy.previewRouteSimulation(paceInput(overrides)).then((res) => {
          expect(res.status).to.eq(422)
          expect(res.body.error).to.eq('Validation failed')
          expect(res.body.details.fieldErrors, 'field errors').to.have.property(field)
        })
      })
    })

    it('returns 400 for a malformed JSON body', () => {
      cy.previewRouteSimulation('{"source": ', { 'Content-Type': 'application/json' }).then(
        (res) => {
          expect(res.status).to.eq(400)
        }
      )
    })
  })

  describe('GPX content limits', () => {
    it('returns 422 for a GPX without elevation data', () => {
      cy.previewRouteSimulation(paceInput({ gpx: buildGpx(30, { withEle: false }) })).then(
        (res) => {
          expect(res.status).to.eq(422)
          expect(res.body.error).to.match(/elevation/i)
        }
      )
    })

    it('returns 422 for a GPX with fewer than 2 readable points', () => {
      cy.previewRouteSimulation(paceInput({ gpx: buildGpx(1) })).then((res) => {
        expect(res.status).to.eq(422)
      })
    })

    it('returns 422 for text that is not a GPX', () => {
      cy.previewRouteSimulation(paceInput({ gpx: 'this is not a gpx file' })).then((res) => {
        expect(res.status).to.eq(422)
      })
    })

    it('returns 422 when the GPX has more than 100,000 points', () => {
      // Self-closing points keep the body near 2.4 MB, under the 5 MB body guard.
      const gpx = `<gpx><trk><trkseg>${'<trkpt lat="0" lon="0"/>'.repeat(100001)}</trkseg></trk></gpx>`
      cy.previewRouteSimulation(paceInput({ gpx })).then((res) => {
        expect(res.status).to.eq(422)
        expect(res.body.error).to.match(/too many points/i)
      })
    })

    it('returns 422 when the GPX text is over the 4 MB schema cap', () => {
      const gpx = 'x'.repeat(4_000_001)
      cy.previewRouteSimulation(paceInput({ gpx })).then((res) => {
        expect(res.status).to.eq(422)
        expect(res.body.details.fieldErrors).to.have.property('gpx')
      })
    })
  })
})

describe('Route Simulator API — lifecycle, shapes and Run Mode contract', () => {
  let paceSim
  let previewData
  let timeSim

  before(() => {
    sweepTaggedSimulations()
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  after(() => {
    sweepTaggedSimulations()
  })

  it('preview returns 200 without saving and without ids', () => {
    cy.previewRouteSimulation(paceInput()).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('message')
      previewData = res.body.data
      expect(previewData.id).to.eq(null)
      expect(previewData.name).to.eq(null)
      expect(previewData.created_at).to.eq(null)
      expect(previewData.ai_strategy).to.eq(null)
      expect(previewData.has_threshold_pace).to.be.a('boolean')
      expect(previewData).to.not.have.property('user_id')
    })
  })

  it('create returns 201 with the same keys as preview (plus has_threshold_pace on preview)', () => {
    cy.postRouteSimulation(createInput()).then((res) => {
      expect(res.status).to.eq(201)
      expect(res.body.message).to.eq('Simulation saved')
      paceSim = res.body.data
      expect(paceSim.id).to.be.a('string')
      expect(paceSim.created_at).to.be.a('string')
      expect(paceSim).to.not.have.property('user_id')
      const previewKeys = sortedKeys(previewData).filter((k) => k !== 'has_threshold_pace')
      const createKeys = sortedKeys(paceSim).filter((k) => k !== 'has_threshold_pace')
      expect(createKeys).to.deep.eq(previewKeys)
      DETAIL_KEYS.forEach((k) => expect(paceSim, k).to.have.property(k))
    })
  })

  it('preview and create compute the same numbers for the same input', () => {
    ;[
      'total_distance_m',
      'total_elevation_gain_m',
      'total_elevation_loss_m',
      'predicted_time_sec',
      'target_time_sec',
      'is_realistic',
    ].forEach((k) => expect(paceSim[k], k).to.deep.eq(previewData[k]))
    expect(paceSim.km_splits).to.have.length(previewData.km_splits.length)
  })

  it('returns numbers as numbers and fills target_time_sec in pace mode', () => {
    expect(paceSim.total_distance_m).to.be.a('number').and.to.be.greaterThan(0)
    expect(paceSim.total_elevation_gain_m).to.be.a('number')
    expect(paceSim.total_elevation_loss_m).to.be.a('number')
    expect(paceSim.predicted_time_sec).to.be.a('number')
    expect(paceSim.target_pace_sec_per_km).to.eq(360)
    expect(paceSim.target_time_sec).to.be.a('number').and.to.eq(paceSim.predicted_time_sec)
    expect(paceSim.is_realistic).to.be.a('boolean')
    expect(paceSim.elevation_profile).to.be.an('array').and.not.be.empty
    expect(paceSim.km_splits).to.be.an('array').and.not.be.empty
    Object.values(paceSim.km_splits[0]).forEach((v) => expect(v).to.not.be.a('string'))
    expect(paceSim.source).to.eq('gpx_upload')
    expect(paceSim.source_activity_id).to.eq(null)
    expect(paceSim.ai_strategy).to.eq(null)
  })

  it('time mode keeps the entered target_time_sec and a null pace', () => {
    cy.postRouteSimulation(
      createInput({
        name: `${SEED_NAME} time sim`,
        target_mode: 'time',
        target_pace_sec_per_km: undefined,
        target_time_sec: 1500,
      })
    ).then((res) => {
      expect(res.status).to.eq(201)
      timeSim = res.body.data
      expect(timeSim.target_mode).to.eq('time')
      expect(timeSim.target_time_sec).to.eq(1500)
      expect(timeSim.target_pace_sec_per_km).to.eq(null)
    })
  })

  it('list returns the summary shape with numeric fields and no user_id', () => {
    cy.getRouteSimulations().then((res) => {
      expect(res.status).to.eq(200)
      const row = res.body.data.find((s) => s.id === paceSim.id)
      expect(row, 'created simulation is listed').to.exist
      expect(sortedKeys(row)).to.deep.eq(LIST_KEYS)
      expect(row).to.not.have.property('km_splits')
      expect(row).to.not.have.property('user_id')
      expect(row.target_time_sec).to.be.a('number').and.to.eq(row.predicted_time_sec)
      expect(row.total_distance_m).to.be.a('number')
      expect(row.total_elevation_gain_m).to.be.a('number')
      expect(row.target_pace_sec_per_km).to.eq(360)

      const timeRow = res.body.data.find((s) => s.id === timeSim.id)
      expect(timeRow.target_time_sec).to.eq(1500)
      expect(timeRow.target_pace_sec_per_km).to.eq(null)
    })
  })

  it('list is newest first and respects limit', () => {
    cy.getRouteSimulations({ limit: 1 }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data).to.have.length(1)
    })
    cy.getRouteSimulations().then((res) => {
      const dates = res.body.data.map((s) => new Date(s.created_at).getTime())
      const sorted = [...dates].sort((a, b) => b - a)
      expect(dates).to.deep.eq(sorted)
    })
  })

  it('detail returns the full shape with numbers, km_splits and no user_id', () => {
    cy.getRouteSimulation(paceSim.id).then((res) => {
      expect(res.status).to.eq(200)
      const d = res.body.data
      expect(sortedKeys(d)).to.deep.eq(DETAIL_KEYS)
      expect(d).to.not.have.property('user_id')
      expect(d.id).to.eq(paceSim.id)
      expect(d.total_distance_m).to.be.a('number').and.to.eq(paceSim.total_distance_m)
      expect(d.target_time_sec).to.be.a('number').and.to.eq(d.predicted_time_sec)
      expect(d.km_splits).to.be.an('array').and.not.be.empty
      expect(d.elevation_profile).to.be.an('array').and.not.be.empty
      expect(d.hr_band).to.eq(null)
    })
  })

  it('PATCH renames, trims the name and returns the list shape', () => {
    cy.patchRouteSimulation(paceSim.id, { name: `  ${SEED_NAME} renamed  ` }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.message).to.eq('Renamed')
      expect(res.body.data.name).to.eq(`${SEED_NAME} renamed`)
      expect(sortedKeys(res.body.data)).to.deep.eq(LIST_KEYS)
      expect(res.body.data).to.not.have.property('user_id')
    })
    cy.getRouteSimulation(paceSim.id).then((res) => {
      expect(res.body.data.name).to.eq(`${SEED_NAME} renamed`)
    })
  })

  it('DELETE returns 200, then the simulation is gone (GET 404, DELETE 404)', () => {
    cy.deleteRouteSimulation(timeSim.id).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.message).to.eq('Deleted')
    })
    cy.getRouteSimulation(timeSim.id).then((res) => {
      expect(res.status).to.eq(404)
    })
    cy.deleteRouteSimulation(timeSim.id).then((res) => {
      expect(res.status).to.eq(404)
    })
  })

  describe('Bearer spot check', () => {
    let token

    before(() => {
      cy.getBearerSession().then((s) => {
        token = s.access_token
      })
    })

    it('list: valid Bearer is 200 with the same keys as the cookie session', () => {
      cy.apiRequestBearer('GET', SIM_LIST, { token }).then((bearerRes) => {
        expect(bearerRes.status).to.eq(200)
        expect(bearerRes.headers['content-type']).to.include('application/json')
        cy.setupApiAuthCookies()
        cy.getRouteSimulations().then((cookieRes) => {
          expect(cookieRes.status).to.eq(200)
          expect(sortedKeys(bearerRes.body)).to.deep.eq(sortedKeys(cookieRes.body))
          const b = bearerRes.body.data.find((s) => s.id === paceSim.id)
          expect(sortedKeys(b)).to.deep.eq(LIST_KEYS)
        })
      })
    })

    it('detail: valid Bearer is 200 with the same keys as the cookie session', () => {
      cy.apiRequestBearer('GET', SIM_DETAIL.replace(':id', paceSim.id), {
        token,
      }).then((bearerRes) => {
        expect(bearerRes.status).to.eq(200)
        cy.setupApiAuthCookies()
        cy.getRouteSimulation(paceSim.id).then((cookieRes) => {
          expect(sortedKeys(bearerRes.body.data)).to.deep.eq(sortedKeys(cookieRes.body.data))
          expect(bearerRes.body.data.total_distance_m).to.be.a('number')
        })
      })
    })

    it('list and detail: no token is 401', () => {
      cy.apiRequestBearer('GET', SIM_LIST).then((res) => {
        expect(res.status).to.eq(401)
      })
      cy.apiRequestBearer('GET', SIM_DETAIL.replace(':id', paceSim.id)).then((res) => {
        expect(res.status).to.eq(401)
      })
    })
  })
})

describe('Route Simulator API — [id] errors and IDOR', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it("GET returns 404 for another user's simulation (read-only check)", function () {
    cy.getOtherUserRouteIdsFromDb().then(({ simulationId: otherId }) => {
      if (!otherId) {
        cy.log('no simulation owned by another user, skipping')
        this.skip()
      }
      cy.getRouteSimulation(otherId).then((res) => {
        expect(res.status).to.eq(404)
        expect(res.body).to.not.have.property('data')
      })
    })
  })

  it('GET returns 404 for an unknown or not-owned id', () => {
    cy.getRouteSimulation(crypto.randomUUID()).then((res) => {
      expect(res.status).to.eq(404)
      expect(res.body).to.not.have.property('data')
    })
  })

  it('PATCH returns 404 for an unknown or not-owned id', () => {
    cy.patchRouteSimulation(crypto.randomUUID(), { name: 'nope' }).then((res) => {
      expect(res.status).to.eq(404)
    })
  })

  it('DELETE returns 404 for an unknown or not-owned id', () => {
    cy.deleteRouteSimulation(crypto.randomUUID()).then((res) => {
      expect(res.status).to.eq(404)
    })
  })

  it('GET, PATCH and DELETE return 400 for a malformed id', () => {
    cy.getRouteSimulation('not-a-uuid').then((res) => expect(res.status).to.eq(400))
    cy.patchRouteSimulation('not-a-uuid', { name: 'x' }).then((res) =>
      expect(res.status).to.eq(400)
    )
    cy.deleteRouteSimulation('not-a-uuid').then((res) => expect(res.status).to.eq(400))
  })

  it('PATCH returns 400 for a malformed JSON body', () => {
    cy.patchRouteSimulation(crypto.randomUUID(), '{"name": ', {
      'Content-Type': 'application/json',
    }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })

  it('PATCH returns 422 for an empty name (validation is still 422, tracked in #849)', () => {
    cy.patchRouteSimulation(crypto.randomUUID(), { name: '' }).then((res) => {
      expect(res.status).to.eq(422)
    })
  })

  it('ai-strategy returns 404 for an unknown or not-owned id (no AI call)', () => {
    cy.postRouteSimulationStrategy(crypto.randomUUID(), {}).then((res) => {
      expect(res.status).to.eq(404)
    })
  })

  it('ai-strategy returns 400 for a malformed id', () => {
    cy.postRouteSimulationStrategy('not-a-uuid', {}).then((res) => {
      expect(res.status).to.eq(400)
    })
  })

  it('ai-strategy returns 400 for a malformed JSON body or a bad regenerate flag', () => {
    cy.postRouteSimulationStrategy(crypto.randomUUID(), '{"regenerate": ', {
      'Content-Type': 'application/json',
    }).then((res) => {
      expect(res.status).to.eq(400)
    })
    cy.postRouteSimulationStrategy(crypto.randomUUID(), { regenerate: 'yes' }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })

  it('create from an activity id that does not exist returns 404', () => {
    cy.postRouteSimulation(
      createInput({ source: 'activity', gpx: undefined, activity_id: crypto.randomUUID() })
    ).then((res) => {
      expect(res.status).to.eq(404)
    })
  })

  it("create and preview from another user's activity return 404", function () {
    const otherId = Cypress.env('OTHER_USER_ACTIVITY_ID')
    if (!otherId) {
      cy.log('OTHER_USER_ACTIVITY_ID not set, skipping')
      this.skip()
    }
    const input = { source: 'activity', gpx: undefined, activity_id: otherId }
    cy.postRouteSimulation(createInput(input)).then((res) => {
      expect(res.status).to.eq(404)
    })
    cy.previewRouteSimulation(paceInput(input)).then((res) => {
      expect(res.status).to.eq(404)
    })
  })
})

describe('Route Simulator API — long activity stream (CB-1)', () => {
  let seeded
  let simId

  before(() => {
    sweepTaggedSimulations()
    cy.deleteStreamActivityFromDb()
    cy.seedStreamActivityInDb(STREAM_ROWS).then((result) => {
      seeded = result
      expect(result.rowCount).to.eq(STREAM_ROWS)
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  after(() => {
    sweepTaggedSimulations()
    cy.deleteStreamActivityFromDb().then((result) => {
      expect(result.deleted).to.eq(1)
    })
  })

  const activityInput = () => ({
    source: 'activity',
    activity_id: seeded.activityId,
    target_mode: 'pace',
    target_pace_sec_per_km: 360,
  })

  it('preview covers the whole stream, not the first 1000 rows', () => {
    cy.previewRouteSimulation(activityInput()).then((res) => {
      expect(res.status).to.eq(200)
      // 1000 rows would end at 9,990 m; 1500 rows end at 14,990 m.
      expect(res.body.data.total_distance_m).to.be.greaterThan(14000)
      expect(res.body.data.total_distance_m).to.be.closeTo(seeded.distance_m, 100)
    })
  })

  it('create saves the whole distance and km_splits for every full kilometre', () => {
    cy.postRouteSimulation(createInput({ ...activityInput(), gpx: undefined })).then((res) => {
      expect(res.status).to.eq(201)
      simId = res.body.data.id
      expect(res.body.data.source).to.eq('activity')
      expect(res.body.data.source_activity_id).to.eq(seeded.activityId)
      expect(res.body.data.total_distance_m).to.be.closeTo(seeded.distance_m, 100)
      expect(res.body.data.km_splits.length).to.be.at.least(Math.floor(seeded.distance_m / 1000))
    })
  })

  it('detail still reports the whole distance, and delete cleans the simulation up', () => {
    cy.getRouteSimulation(simId).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data.total_distance_m).to.be.closeTo(seeded.distance_m, 100)
    })
    cy.deleteRouteSimulation(simId).then((res) => {
      expect(res.status).to.eq(200)
    })
  })
})
