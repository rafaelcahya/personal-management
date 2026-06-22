// API spec — Onboarding menu.
//   POST /api/running/v1/onboarding/biometric
//   POST /api/running/v1/onboarding/complete

// ─── biometric ────────────────────────────────────────────────────────────────

describe('Onboarding API — POST /api/running/v1/onboarding/biometric', () => {
  before(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.setupApiAuthCookies()
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with valid biometric payload', () => {
    cy.postOnboardingBiometric({
      birth_date: '1994-06-15',
      height_cm: 172,
      weight_kg: 68,
      resting_hr_baseline: 58,
      max_hr: 188,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('message', 'Biometric data saved')
      expect(res.body).to.have.property('data')
    })
  })

  it('returns 200 with empty body (all biometric fields optional in schema)', () => {
    cy.postOnboardingBiometric({}).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('message', 'Biometric data saved')
    })
  })

  it('returns 401 when unauthenticated', () => {
    cy.clearCookies()
    cy.postOnboardingBiometricNoAuth({
      birth_date: '1994-06-15',
      height_cm: 172,
      weight_kg: 68,
    }).then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body.error).to.eq('Unauthorized')
    })
  })

  // ─── validation (schema: height_cm min 50, max 300) ──────────────────────

  it('returns 400 when height_cm is below schema minimum (49)', () => {
    cy.postOnboardingBiometric({
      birth_date: '1994-06-15',
      height_cm: 49,
      weight_kg: 68,
      resting_hr_baseline: 58,
      max_hr: 188,
    }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body.error).to.eq('Validation failed')
    })
  })

  it('returns 400 when height_cm is above schema maximum (301)', () => {
    cy.postOnboardingBiometric({
      birth_date: '1994-06-15',
      height_cm: 301,
      weight_kg: 68,
      resting_hr_baseline: 58,
      max_hr: 188,
    }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body.error).to.eq('Validation failed')
    })
  })

  it('returns 400 when weight_kg is below schema minimum (19)', () => {
    cy.postOnboardingBiometric({
      birth_date: '1994-06-15',
      height_cm: 172,
      weight_kg: 19,
      resting_hr_baseline: 58,
      max_hr: 188,
    }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body.error).to.eq('Validation failed')
    })
  })

  it('returns 400 when max_hr is below schema minimum (59)', () => {
    cy.postOnboardingBiometric({
      birth_date: '1994-06-15',
      height_cm: 172,
      weight_kg: 68,
      resting_hr_baseline: 58,
      max_hr: 59,
    }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body.error).to.eq('Validation failed')
    })
  })

  it('returns 400 when birth_date is not YYYY-MM-DD format', () => {
    cy.postOnboardingBiometric({
      birth_date: '15/06/1994',
      height_cm: 172,
      weight_kg: 68,
      resting_hr_baseline: 58,
    }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body.error).to.eq('Validation failed')
    })
  })
})

// ─── complete ─────────────────────────────────────────────────────────────────

describe('Onboarding API — POST /api/running/v1/onboarding/complete', () => {
  before(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.setupApiAuthCookies()
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with empty body (goal payload is optional)', () => {
    cy.postOnboardingComplete({}).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('message', 'Onboarding complete')
      expect(res.body).to.have.property('data')
    })
  })

  it('returns 200 with valid goal payload (race type)', () => {
    cy.postOnboardingComplete({
      goal_type: 'race',
      target_date: '2027-04-15',
      target_distance_m: 42195,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('message', 'Onboarding complete')
    })
  })

  it('returns 200 when goal_type is present but target_date is omitted', () => {
    cy.postOnboardingComplete({
      goal_type: 'race',
      target_distance_m: 10000,
    }).then((res) => {
      expect(res.status).to.eq(200)
    })
  })

  it('returns 401 when unauthenticated', () => {
    cy.clearCookies()
    cy.postOnboardingCompleteNoAuth().then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body.error).to.eq('Unauthorized')
    })
  })
})
