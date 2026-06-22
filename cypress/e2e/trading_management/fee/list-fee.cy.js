import { faker } from '@faker-js/faker'

// ─── helpers ──────────────────────────────────────────────────────────────────

const newFeeRequest = () => ({
  fee_date: faker.date.recent(),
  fee: faker.string.numeric(5),
  fee_name: faker.animal.snake(),
})

const deleteSeededFees = (ids) => {
  ids.forEach((id) => {
    cy.DeleteFee(id)
  })
}

// ─── list fee ─────────────────────────────────────────────────────────────────

describe('Fee List API', () => {
  let testUserId
  let testFeeIds = []
  let testFeesData = []

  before(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.setupApiAuthCookies()

    Cypress._.times(3, () => {
      cy.AddFee(newFeeRequest()).then((response) => {
        expect(response.body.success).to.be.true
        expect(response.body.fee).to.exist
        expect(response.status).to.eq(201)
        const fee = response.body.fee
        testUserId = fee.user_id
        testFeeIds.push(fee.id)
        testFeesData.push(fee)
      })
    })
  })

  after(() => {
    cy.setupApiAuthCookies()
    deleteSeededFees(testFeeIds)
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('should return 200 with fees list for authenticated user', () => {
    cy.GetListFee({ page: 1, limit: 15 }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.success).to.be.true
      expect(response.body.fees).to.be.an('array')
      expect(response.body.fees.length).to.be.gte(testFeeIds.length)
      testFeeIds.forEach((id) => {
        expect(response.body.fees.some((t) => t.id === id)).to.be.true
      })
    })
  })

  it("should return only authenticated user's fees", () => {
    cy.GetListFee({ page: 1, limit: 15 }).then((response) => {
      response.body.fees.forEach((fee) => {
        expect(fee.user_id).to.eq(testUserId)
      })
    })
  })

  it('should sort fees by fee_date DESC', () => {
    cy.GetListFee({ page: 1, limit: 15 }).then((response) => {
      const fees = response.body.fees
      for (let i = 0; i < fees.length - 1; i++) {
        const date1 = new Date(fees[i].fee_date)
        const date2 = new Date(fees[i + 1].fee_date)
        expect(date1.getTime()).to.gte(date2.getTime())
      }
    })
  })

  it('should return 401 Unauthorized without auth', () => {
    cy.clearCookies()
    cy.GetListFeeNoAuth().then((response) => {
      expect(response.status).to.be.oneOf([401, 307])
      if (response.status === 401) {
        expect(response.body.error).to.eq('Unauthorized')
      }
    })
  })

  it('should return correct response structure', () => {
    cy.GetListFee({ page: 1, limit: 15 }).then((response) => {
      expect(response.body).to.have.all.keys(
        'success',
        'fees',
        'total',
        'page',
        'limit',
        'totalPages'
      )
      expect(response.body.success).to.be.a('boolean')
      expect(response.body.fees).to.be.an('array')
      expect(response.body.total).to.be.a('number').and.to.be.gte(0)
      expect(response.body.page).to.be.a('number').and.to.eq(1)
      expect(response.body.limit).to.be.a('number').and.to.eq(15)
      expect(response.body.totalPages).to.be.a('number').and.to.be.gte(0)

      if (response.body.fees.length > 0) {
        const fee = response.body.fees[0]
        expect(fee).to.have.all.keys([
          'created_at',
          'deleted_at',
          'id',
          'fee',
          'fee_name',
          'fee_date',
          'updated_at',
          'user_id',
          'uuid',
        ])
      }
    })
  })

  it('should respond within 1000ms', () => {
    const start = Date.now()
    cy.GetListFee().then(() => {
      const duration = Date.now() - start
      expect(duration).to.be.lte(1000)
      cy.log(`Response time: ${duration}ms`)
    })
  })
})

// ─── pagination and query params ──────────────────────────────────────────────

describe('Fee List API — pagination and query params', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  // ─── default page size is 15 ──────────────────────────────────────────────

  describe('default page size is 15', () => {
    const seededIds = []

    before(() => {
      cy.setupApiAuthCookies()
      Cypress._.times(16, () => {
        cy.AddFee(newFeeRequest()).then((response) => {
          expect(response.status).to.eq(201)
          seededIds.push(response.body.fee.id)
        })
      })
    })

    after(() => {
      cy.setupApiAuthCookies()
      deleteSeededFees(seededIds)
    })

    it('returns at most 15 fees and totalPages >= 2 when > 15 fees exist', () => {
      cy.GetListFee().then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.fees.length).to.be.lte(15)
        expect(response.body.totalPages).to.be.gte(2)
      })
    })
  })

  // ─── page and limit params ────────────────────────────────────────────────

  describe('page and limit params', () => {
    const seededIds = []

    before(() => {
      cy.setupApiAuthCookies()
      Cypress._.times(6, () => {
        cy.AddFee(newFeeRequest()).then((response) => {
          expect(response.status).to.eq(201)
          seededIds.push(response.body.fee.id)
        })
      })
    })

    after(() => {
      cy.setupApiAuthCookies()
      deleteSeededFees(seededIds)
    })

    it('page=1&limit=5 returns 5 fees on page 1', () => {
      cy.GetListFee({ page: 1, limit: 5 }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.fees.length).to.eq(5)
        expect(response.body.page).to.eq(1)
      })
    })

    it('page=2&limit=5 returns remaining fees on page 2', () => {
      cy.GetListFee({ page: 2, limit: 5 }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.fees.length).to.be.gte(1)
        expect(response.body.page).to.eq(2)
      })
    })
  })

  // ─── invalid params return 400 ────────────────────────────────────────────

  describe('invalid params return 400', () => {
    it('page=0 returns 400', () => {
      cy.GetListFee({ page: 0 }).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
      })
    })

    it('page=-1 returns 400', () => {
      cy.GetListFee({ page: -1 }).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
      })
    })

    it('limit=0 returns 400', () => {
      cy.GetListFee({ limit: 0 }).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
      })
    })

    it('limit=101 returns 400 (max is 100)', () => {
      cy.GetListFee({ limit: 101 }).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
      })
    })
  })
})
