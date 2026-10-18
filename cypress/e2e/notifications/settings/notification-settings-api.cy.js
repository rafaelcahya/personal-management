// API-only spec: notification section on the Settings page (#856)
//   GET/POST /api/notifications/v1/push-subscriptions       — devices + status, register a device
//   DELETE   /api/notifications/v1/push-subscriptions/[id]  — remove one device
//   POST     /api/notifications/v1/push-subscriptions/test  — test push to one of my devices
//   GET/PATCH /api/notifications/v1/preferences             — push on/off per notification type
// Real push delivery can't be asserted from Cypress (no real browser subscription), so the
// success path of the test push isn't covered here — use the button on a real device.
// The "notify()" case drives the Inventory low-stock path and checks the in-app row is written
// even though the registered (fake) device can't receive the push.

import { faker } from '@faker-js/faker'

const fcm = (name) =>
  `https://fcm.googleapis.com/fcm/send/cypress-${name}-${faker.string.alphanumeric(8)}`
const subscription = (endpoint) => ({
  subscription: { endpoint, keys: { p256dh: 'fake-p256dh-key', auth: 'fake-auth-key' } },
})

const NOTIFICATION_TYPES = [
  'post_activity',
  'weekly_review',
  'friday_prep',
  'anomaly',
  'race_reminder',
  'product_update',
  'low_stock',
  'pr_achieved',
  'gear_mileage',
  'strava_disconnected',
  'restock_reminder',
  'event_analysis_ready',
  'weekly_summary',
  'session_ended',
]

// ─── auth guard ───────────────────────────────────────────────────────────────

describe('Notification settings API — auth guard', () => {
  beforeEach(() => {
    cy.clearAllCookies()
    cy.clearAllLocalStorage()
  })

  it('GET push-subscriptions returns 401 when unauthenticated', () => {
    cy.getPushStatusNoAuth().then((res) => expect(res.status).to.eq(401))
  })

  it('POST push-subscriptions returns 401 when unauthenticated', () => {
    cy.postPushDeviceNoAuth(subscription(fcm('noauth'))).then((res) =>
      expect(res.status).to.eq(401)
    )
  })

  it('DELETE push-subscriptions/[id] returns 401 when unauthenticated', () => {
    cy.deletePushDeviceNoAuth('00000000-0000-4000-8000-000000000000').then((res) =>
      expect(res.status).to.eq(401)
    )
  })

  it('POST push-subscriptions/test returns 401 when unauthenticated', () => {
    cy.postPushTestNoAuth({ endpoint: fcm('noauth') }).then((res) => expect(res.status).to.eq(401))
  })

  it('GET preferences returns 401 when unauthenticated', () => {
    cy.getNotificationPreferencesNoAuth().then((res) => expect(res.status).to.eq(401))
  })

  it('PATCH preferences returns 401 when unauthenticated', () => {
    cy.patchNotificationPreferenceNoAuth({ type: 'low_stock', push_enabled: false }).then((res) =>
      expect(res.status).to.eq(401)
    )
  })
})

// ─── devices ──────────────────────────────────────────────────────────────────

describe('Push devices API', () => {
  const created = []

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  after(() => {
    cy.setupApiAuthCookies()
    created.forEach((id) => cy.deletePushDevice(id))
  })

  it('GET returns user_id, devices, last_success, last_failure — and never the keys', () => {
    cy.getPushStatus().then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data).to.have.all.keys(
        'user_id',
        'devices',
        'last_success',
        'last_failure',
        'expired_endpoint_hashes'
      )
      expect(res.body.data.expired_endpoint_hashes).to.be.an('array')
      expect(res.body.data.devices).to.be.an('array')
      res.body.data.devices.forEach((d) => {
        expect(d).to.not.have.any.keys('p256dh', 'auth')
      })
    })
  })

  it('POST registers a device and GET lists it', () => {
    const endpoint = fcm('one')
    cy.postPushDevice(subscription(endpoint)).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data).to.have.property('id')
      expect(res.body.data).to.have.property('endpoint', endpoint)
      created.push(res.body.data.id)
    })
    cy.getPushStatus().then((res) => {
      expect(res.body.data.devices.map((d) => d.endpoint)).to.include(endpoint)
    })
  })

  it('POST with the same endpoint again refreshes the device instead of duplicating it', () => {
    const endpoint = fcm('same')
    cy.postPushDevice(subscription(endpoint)).then((first) => {
      created.push(first.body.data.id)
      cy.postPushDevice(subscription(endpoint)).then((second) => {
        expect(second.status).to.eq(200)
        expect(second.body.data.id).to.eq(first.body.data.id)
      })
    })
  })

  it('a second device does not remove the first', () => {
    const a = fcm('first')
    const b = fcm('second')
    cy.postPushDevice(subscription(a)).then((res) => created.push(res.body.data.id))
    cy.postPushDevice(subscription(b)).then((res) => created.push(res.body.data.id))
    cy.getPushStatus().then((res) => {
      const endpoints = res.body.data.devices.map((d) => d.endpoint)
      expect(endpoints).to.include.members([a, b])
    })
  })

  it('POST with an endpoint on a host that is not a push service → 400', () => {
    cy.postPushDevice(subscription('https://internal.example.com/hook')).then((res) => {
      expect(res.status).to.eq(400)
    })
  })

  it('POST over plain http → 400', () => {
    cy.postPushDevice(subscription('http://fcm.googleapis.com/fcm/send/x')).then((res) => {
      expect(res.status).to.eq(400)
    })
  })

  it('POST without keys → 400', () => {
    cy.postPushDevice({ subscription: { endpoint: fcm('nokeys') } }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body).to.have.property('error')
    })
  })

  it('POST without a subscription → 400', () => {
    cy.postPushDevice({}).then((res) => expect(res.status).to.eq(400))
  })

  it('DELETE removes only that device', () => {
    const keep = fcm('keep')
    const drop = fcm('drop')
    cy.postPushDevice(subscription(keep)).then((res) => created.push(res.body.data.id))
    cy.postPushDevice(subscription(drop)).then((res) => {
      cy.deletePushDevice(res.body.data.id).then((del) => {
        expect(del.status).to.eq(200)
      })
    })
    cy.getPushStatus().then((res) => {
      const endpoints = res.body.data.devices.map((d) => d.endpoint)
      expect(endpoints).to.include(keep)
      expect(endpoints).to.not.include(drop)
    })
  })

  it('DELETE with an id that is not a uuid → 400', () => {
    cy.deletePushDevice('not-a-uuid').then((res) => expect(res.status).to.eq(400))
  })

  it('DELETE with an unknown id → 404', () => {
    cy.deletePushDevice('00000000-0000-4000-8000-000000000000').then((res) => {
      expect(res.status).to.eq(404)
    })
  })
})

// ─── IDOR ─────────────────────────────────────────────────────────────────────

describe('Push devices API — another user’s device', () => {
  const foreignEndpoint = fcm('foreign')
  let foreignId
  let foreignOwnerId

  before(() => {
    cy.setupApiAuthCookies()
    cy.getTestUserId().then((userId) => {
      cy.task('getOtherUserId', { userId }).then((otherId) => {
        if (!otherId) throw new Error('Need a second user in rt_users for the IDOR test')
        cy.task('seedPushDevice', { userId: otherId, endpoint: foreignEndpoint }).then((row) => {
          foreignId = row.id
          foreignOwnerId = row.user_id
        })
      })
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  after(() => {
    cy.task('deletePushDeviceByEndpoint', { endpoint: foreignEndpoint })
  })

  it('DELETE on their device id → 404 and the device is still there', () => {
    cy.deletePushDevice(foreignId).then((res) => expect(res.status).to.eq(404))
    cy.task('getPushDevice', { endpoint: foreignEndpoint }).then((row) => {
      expect(row).to.not.eq(null)
    })
  })

  it('their device is not in my list', () => {
    cy.getPushStatus().then((res) => {
      expect(res.body.data.devices.map((d) => d.id)).to.not.include(foreignId)
    })
  })

  it('test push to their endpoint → 404', () => {
    cy.postPushTest({ endpoint: foreignEndpoint }).then((res) => expect(res.status).to.eq(404))
  })

  it('registering their endpoint with different keys → 409 and the device stays theirs', () => {
    cy.postPushDevice(subscription(foreignEndpoint)).then((res) => {
      expect(res.status).to.eq(409)
      expect(res.body).to.not.have.property('data')
    })
    cy.task('getPushDevice', { endpoint: foreignEndpoint }).then((row) => {
      expect(row.user_id).to.eq(foreignOwnerId)
    })
  })

  it('registering it with the same keys (same browser, new sign-in) moves it to me', () => {
    cy.postPushDevice({
      subscription: {
        endpoint: foreignEndpoint,
        keys: { p256dh: 'cypress-fake-p256dh-key', auth: 'cypress-fake-auth-key' },
      },
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data.user_id).to.not.eq(foreignOwnerId)
    })
  })
})

// ─── test push ────────────────────────────────────────────────────────────────

describe('Push test API', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('missing endpoint → 400', () => {
    cy.postPushTest({}).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body).to.have.property('error')
    })
  })

  it('endpoint that is not a URL → 400', () => {
    cy.postPushTest({ endpoint: 'not-a-url' }).then((res) => expect(res.status).to.eq(400))
  })

  it('endpoint on a host that is not a push service → 400', () => {
    cy.postPushTest({ endpoint: 'https://internal.example.com/fcm/send/x' }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body.message).to.match(/push service/i)
    })
  })

  it('endpoint that is not one of my devices → 404', () => {
    cy.postPushTest({ endpoint: fcm('unregistered') }).then((res) => expect(res.status).to.eq(404))
  })
})

// ─── preferences ──────────────────────────────────────────────────────────────

describe('Notification preferences API', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  after(() => {
    cy.setupApiAuthCookies()
    cy.patchNotificationPreference({ type: 'product_update', push_enabled: true })
  })

  it('GET lists every notification type with a boolean push_enabled', () => {
    cy.getNotificationPreferences().then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data.map((p) => p.type)).to.have.members(NOTIFICATION_TYPES)
      res.body.data.forEach((p) => {
        expect(p).to.have.all.keys('type', 'module', 'title', 'description', 'push_enabled')
        expect(p.push_enabled).to.be.a('boolean')
      })
    })
  })

  it('PATCH turns a type off and GET reflects it', () => {
    cy.patchNotificationPreference({ type: 'product_update', push_enabled: false }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data).to.deep.eq({ type: 'product_update', push_enabled: false })
    })
    cy.getNotificationPreferences().then((res) => {
      expect(res.body.data.find((p) => p.type === 'product_update').push_enabled).to.eq(false)
    })
  })

  it('PATCH turns it back on', () => {
    cy.patchNotificationPreference({ type: 'product_update', push_enabled: true }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data.push_enabled).to.eq(true)
    })
  })

  it('GET groups the new types under their modules', () => {
    cy.getNotificationPreferences().then((res) => {
      const moduleOf = (type) => res.body.data.find((p) => p.type === type).module
      expect(moduleOf('strava_disconnected')).to.eq('Running')
      expect(moduleOf('restock_reminder')).to.eq('Inventory')
      expect(moduleOf('event_analysis_ready')).to.eq('Trading')
      expect(moduleOf('weekly_summary')).to.eq('Home')
      expect(moduleOf('session_ended')).to.eq('Account')
    })
  })

  it('PATCH accepts every new type (including the browser-only session_ended) and restores it', () => {
    ;[
      'strava_disconnected',
      'restock_reminder',
      'event_analysis_ready',
      'weekly_summary',
      'session_ended',
    ].forEach((type) => {
      cy.patchNotificationPreference({ type, push_enabled: false }).then((res) => {
        expect(res.status, type).to.eq(200)
        expect(res.body.data).to.deep.eq({ type, push_enabled: false })
      })
      cy.patchNotificationPreference({ type, push_enabled: true }).then((res) =>
        expect(res.status, type).to.eq(200)
      )
    })
  })

  it('PATCH with an unknown type → 400', () => {
    cy.patchNotificationPreference({ type: 'nope', push_enabled: true }).then((res) =>
      expect(res.status).to.eq(400)
    )
  })

  it('PATCH with a non-boolean push_enabled → 400', () => {
    cy.patchNotificationPreference({ type: 'low_stock', push_enabled: 'yes' }).then((res) =>
      expect(res.status).to.eq(400)
    )
  })
})

// ─── notify(): the in-app row survives a push that can't be delivered ─────────

describe('notify() — low stock writes the in-app notification even when push fails', () => {
  const deviceEndpoint = fcm('notify')
  let productId
  let brandId
  let nameId
  let stockEntryId
  let notificationId

  before(() => {
    cy.setupApiAuthCookies()
    cy.postPushDevice(subscription(deviceEndpoint))

    cy.AddProductBrand({
      brand: 'TestBrand-' + faker.string.alphanumeric(10),
      brand_status: 'active',
      note: faker.word.words(3),
    }).then((brandRes) => {
      brandId = brandRes.body.productBrand.id
      cy.AddProductName({
        product_name: 'TestProduct-' + faker.string.alphanumeric(10),
        product_name_status: 'active',
      }).then((nameRes) => {
        nameId = nameRes.body.productName.id
        cy.AddProduct({
          product_id: nameRes.body.productName.id,
          brand_id: brandRes.body.productBrand.id,
          type: faker.word.noun(),
          usage_quantity: 0,
          note: faker.word.words(3),
          product_image: '',
        }).then((productRes) => {
          productId = productRes.body.product.id
        })
      })
    })
  })

  after(() => {
    cy.task('deletePushDeviceByEndpoint', { endpoint: deviceEndpoint })
    if (notificationId) cy.task('deleteNotification', { id: notificationId })
    // Remove the inventory rows this case created, children first.
    cy.setupApiAuthCookies()
    if (stockEntryId) cy.DeleteProductStock(stockEntryId)
    if (productId) cy.DeleteProduct(productId)
    if (nameId) cy.DeleteProductName(nameId)
    if (brandId) cy.DeleteProductBrand(brandId)
  })

  it('crossing below the low-stock threshold creates a low_stock notification', () => {
    cy.setupApiAuthCookies()
    cy.CreateProductStock({
      product_list_id: productId,
      quantity_added: 10,
      price: 1000,
      purchase_date: new Date().toISOString(),
      note: 'start',
    }).then((created) => {
      expect(created.status).to.eq(201)
      stockEntryId = created.body.data.id
      cy.UpdateProductStock(created.body.data.id, {
        quantity_added: 2,
        price: 1000,
        purchase_date: new Date().toISOString(),
        note: 'down',
      }).then((updated) => {
        expect(updated.status).to.eq(200)
      })
    })

    cy.getNotifications({ limit: 20 }).then((res) => {
      const row = res.body.data.items.find(
        (n) => n.type === 'low_stock' && String(n.data?.productId) === String(productId)
      )
      expect(row, 'low_stock notification for the product').to.exist
      notificationId = row.id
    })
  })
})
