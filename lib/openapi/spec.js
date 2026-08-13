import { z } from 'zod'

import { productSchema } from '@/schemas/product'
import { productBrandSchema } from '@/schemas/productBrand'
import { productNameSchema } from '@/schemas/productName'
import { editStockEntrySchema } from '@/schemas/productQuantity'
import { tradeSchema } from '@/schemas/trade'
import { tradeSettingsSchema } from '@/schemas/tradeSettings'
import { eventSchema } from '@/schemas/event'
import { feeSchema } from '@/schemas/fee'
import {
  createActivitySchema,
  patchActivitySchema,
  createSubjectiveHealthSchema,
  patchSubjectiveHealthSchema,
  createWeightSchema,
  patchWeightSchema,
} from '@/schemas/runningManualEntry'
import { updateGearSchema } from '@/schemas/runningGear'
import { createRaceLogSchema, updateRaceLogSchema, updateGoalSchema } from '@/schemas/raceLog'
import { createUpcomingRaceSchema, updateUpcomingRaceSchema } from '@/schemas/upcomingRace'
import {
  createNodeSchema,
  updateNodeSchema,
  moveNodeSchema,
  updateUninvestedCashSchema,
  createCashCategorySchema,
  updateCashCategorySchema,
} from '@/schemas/investmentFlow'

function toSchema(zodSchema) {
  const s = z.toJSONSchema(zodSchema, { unrepresentable: 'any' })
  const { $schema: _$schema, ...rest } = s
  return rest
}

const bearer = [{ SupabaseJWT: [] }]

const ok200 = (description = 'Success') => ({
  [200]: {
    description,
    content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } },
  },
  [401]: {
    description: 'Unauthorized',
    content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
  },
})

const ok201 = (description = 'Created') => ({
  [201]: {
    description,
    content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } },
  },
  [400]: {
    description: 'Validation error',
    content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
  },
  [401]: {
    description: 'Unauthorized',
    content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
  },
})

const ok204 = () => ({
  [204]: { description: 'Deleted' },
  [401]: {
    description: 'Unauthorized',
    content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
  },
})

const bodyJson = (zodSchema) => ({
  required: true,
  content: { 'application/json': { schema: toSchema(zodSchema) } },
})

const pathParam = (name, type = 'string') => ({
  name,
  in: 'path',
  required: true,
  schema: { type },
})

export function buildSpec() {
  return {
    openapi: '3.1.0',
    info: {
      title: 'Personal Management API',
      version: '1.30.0',
      description:
        'REST API for the Personal Management app — Inventory, Stock Trading, Running Tracker, and Investment Flow modules. All endpoints require a valid Supabase session cookie (set automatically by the browser after login).',
    },
    servers: [{ url: '', description: 'Same-origin (current host)' }],
    tags: [
      { name: 'Inventory', description: 'Product inventory and stock management' },
      { name: 'Trade', description: 'Stock trading — trades, events, fees, settings' },
      { name: 'Running', description: 'Running tracker — activities, health, analytics, AI coach' },
      { name: 'Investment Flow', description: 'Investment flow tree and uninvested cash tracking' },
    ],
    components: {
      securitySchemes: {
        SupabaseJWT: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Supabase session JWT (cookie set automatically by browser after login)',
        },
      },
      schemas: {
        SuccessResponse: {
          type: 'object',
          properties: { success: { type: 'boolean', enum: [true] } },
          required: ['success'],
        },
        ErrorResponse: {
          type: 'object',
          properties: { success: { type: 'boolean', enum: [false] }, error: { type: 'string' } },
          required: ['success', 'error'],
        },
        Product: toSchema(productSchema),
        ProductBrand: toSchema(productBrandSchema),
        ProductName: toSchema(productNameSchema),
        StockEntry: toSchema(editStockEntrySchema),
        Trade: toSchema(tradeSchema),
        TradeSettings: toSchema(tradeSettingsSchema),
        TradeEvent: toSchema(eventSchema),
        TradeFee: toSchema(feeSchema),
        Activity: toSchema(createActivitySchema),
        SubjectiveHealth: toSchema(createSubjectiveHealthSchema),
        WeightLog: toSchema(createWeightSchema),
        UpcomingRace: toSchema(createUpcomingRaceSchema),
        RaceLog: toSchema(createRaceLogSchema),
        InvestmentNode: toSchema(createNodeSchema),
        UninvestedCash: toSchema(updateUninvestedCashSchema),
      },
    },
    paths: {
      // ── INVENTORY ──────────────────────────────────────────────
      '/api/inventory/v1/dashboard': {
        get: {
          tags: ['Inventory'],
          summary: 'Get inventory dashboard summary',
          security: bearer,
          responses: ok200('Dashboard data'),
        },
      },
      '/api/inventory/v1/product/summary': {
        get: {
          tags: ['Inventory'],
          summary: 'List all products with stock summary',
          security: bearer,
          responses: ok200('Product list'),
        },
      },
      '/api/inventory/v1/product/restock-predictions': {
        get: {
          tags: ['Inventory'],
          summary: 'Get AI restock predictions for low-stock products',
          security: bearer,
          responses: ok200('Restock predictions'),
        },
      },
      '/api/inventory/v1/product/{id}': {
        get: {
          tags: ['Inventory'],
          summary: 'Get product by ID',
          security: bearer,
          parameters: [pathParam('id')],
          responses: {
            ...ok200('Product detail'),
            404: {
              description: 'Not found',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
        put: {
          tags: ['Inventory'],
          summary: 'Update a product',
          security: bearer,
          parameters: [pathParam('id')],
          requestBody: bodyJson(productSchema.partial()),
          responses: {
            ...ok200('Product updated'),
            400: {
              description: 'Validation error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
            404: {
              description: 'Not found',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
      },
      '/api/inventory/v1/product/create': {
        post: {
          tags: ['Inventory'],
          summary: 'Create a new product',
          security: bearer,
          requestBody: bodyJson(productSchema),
          responses: ok201('Product created'),
        },
      },
      '/api/inventory/v1/product/delete/{id}': {
        delete: {
          tags: ['Inventory'],
          summary: 'Delete a product',
          security: bearer,
          parameters: [pathParam('id')],
          responses: {
            ...ok204(),
            404: {
              description: 'Not found',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
      },
      '/api/inventory/v1/product/{id}/favorite': {
        patch: {
          tags: ['Inventory'],
          summary: 'Toggle product favorite status',
          security: bearer,
          parameters: [pathParam('id')],
          responses: ok200('Favorite toggled'),
        },
      },
      '/api/inventory/v1/product/{id}/last-price': {
        get: {
          tags: ['Inventory'],
          summary: 'Get last purchase price for a product',
          security: bearer,
          parameters: [pathParam('id')],
          responses: ok200('Last price'),
        },
      },
      '/api/inventory/v1/product/stock/create': {
        post: {
          tags: ['Inventory'],
          summary: 'Add a stock entry (restock) for a product',
          security: bearer,
          requestBody: bodyJson(editStockEntrySchema),
          responses: ok201('Stock entry created'),
        },
      },
      '/api/inventory/v1/product/stock/history/{id}': {
        get: {
          tags: ['Inventory'],
          summary: 'Get stock history for a product',
          security: bearer,
          parameters: [pathParam('id')],
          responses: ok200('Stock history'),
        },
      },
      '/api/inventory/v1/product/adjust/{id}': {
        patch: {
          tags: ['Inventory'],
          summary: 'Adjust (consume) stock for a product',
          security: bearer,
          parameters: [pathParam('id')],
          requestBody: bodyJson(z.object({ quantity: z.number().int().positive() })),
          responses: {
            ...ok200('Stock adjusted'),
            400: {
              description: 'Validation error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
      },
      '/api/inventory/v1/product-history/list': {
        get: {
          tags: ['Inventory'],
          summary: 'List product usage history',
          security: bearer,
          responses: ok200('History entries'),
        },
      },
      '/api/inventory/v1/product-brand/{id}': {
        get: {
          tags: ['Inventory'],
          summary: 'Get product brand by ID',
          security: bearer,
          parameters: [pathParam('id')],
          responses: ok200('Brand detail'),
        },
      },
      '/api/inventory/v1/product-brand/create': {
        post: {
          tags: ['Inventory'],
          summary: 'Create a product brand',
          security: bearer,
          requestBody: bodyJson(productBrandSchema),
          responses: ok201('Brand created'),
        },
      },
      '/api/inventory/v1/product-brand/update/{id}': {
        put: {
          tags: ['Inventory'],
          summary: 'Update a product brand',
          security: bearer,
          parameters: [pathParam('id')],
          requestBody: bodyJson(productBrandSchema.partial()),
          responses: {
            ...ok200('Brand updated'),
            400: {
              description: 'Validation error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
      },
      '/api/inventory/v1/product-brand/delete/{id}': {
        delete: {
          tags: ['Inventory'],
          summary: 'Delete a product brand',
          security: bearer,
          parameters: [pathParam('id')],
          responses: ok204(),
        },
      },
      '/api/inventory/v1/product-name/{id}': {
        get: {
          tags: ['Inventory'],
          summary: 'Get product name by ID',
          security: bearer,
          parameters: [pathParam('id')],
          responses: ok200('Product name detail'),
        },
      },
      '/api/inventory/v1/product-name/create': {
        post: {
          tags: ['Inventory'],
          summary: 'Create a product name',
          security: bearer,
          requestBody: bodyJson(productNameSchema),
          responses: ok201('Product name created'),
        },
      },
      '/api/inventory/v1/product-name/update/{id}': {
        put: {
          tags: ['Inventory'],
          summary: 'Update a product name',
          security: bearer,
          parameters: [pathParam('id')],
          requestBody: bodyJson(productNameSchema.partial()),
          responses: {
            ...ok200('Product name updated'),
            400: {
              description: 'Validation error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
      },
      '/api/inventory/v1/product-name/delete/{id}': {
        delete: {
          tags: ['Inventory'],
          summary: 'Delete a product name',
          security: bearer,
          parameters: [pathParam('id')],
          responses: ok204(),
        },
      },

      // ── TRADE ──────────────────────────────────────────────────
      '/api/trade/v1/dashboard/metrics': {
        get: {
          tags: ['Trade'],
          summary: 'Get trade dashboard metrics (P&L, win rate, etc.)',
          security: bearer,
          parameters: [
            { name: 'year', in: 'query', schema: { type: 'integer' } },
            { name: 'month', in: 'query', schema: { type: 'integer' } },
          ],
          responses: ok200('Dashboard metrics'),
        },
      },
      '/api/trade/v1/dashboard/quick-view': {
        get: {
          tags: ['Trade'],
          summary: 'Get dashboard quick-view (recent trades)',
          security: bearer,
          responses: ok200('Quick view data'),
        },
      },
      '/api/trade/v1/trade/{id}': {
        get: {
          tags: ['Trade'],
          summary: 'Get trade by ID',
          security: bearer,
          parameters: [pathParam('id', 'integer')],
          responses: {
            ...ok200('Trade detail'),
            404: {
              description: 'Not found',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
      },
      '/api/trade/v1/trade/update/{id}': {
        put: {
          tags: ['Trade'],
          summary: 'Update a trade',
          security: bearer,
          parameters: [pathParam('id', 'integer')],
          requestBody: bodyJson(tradeSchema.partial()),
          responses: {
            ...ok200('Trade updated'),
            400: {
              description: 'Validation error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
            404: {
              description: 'Not found',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
      },
      '/api/trade/v1/trade/delete/{id}': {
        delete: {
          tags: ['Trade'],
          summary: 'Delete a trade',
          security: bearer,
          parameters: [pathParam('id', 'integer')],
          responses: {
            ...ok204(),
            404: {
              description: 'Not found',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
      },
      '/api/trade/v1/trade/options/{type}': {
        get: {
          tags: ['Trade'],
          summary: 'Get dropdown options for a trade field',
          security: bearer,
          parameters: [
            {
              name: 'type',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                enum: [
                  'stock-type',
                  'entry-session',
                  'entry-occasion',
                  'buy-reason',
                  'sell-reason',
                ],
              },
            },
          ],
          responses: ok200('Option list'),
        },
      },
      '/api/trade/v1/settings': {
        get: {
          tags: ['Trade'],
          summary: 'Get trade calculator settings',
          security: bearer,
          responses: ok200('Settings'),
        },
      },
      '/api/trade/v1/settings/update': {
        put: {
          tags: ['Trade'],
          summary: 'Update trade calculator settings',
          security: bearer,
          requestBody: bodyJson(tradeSettingsSchema),
          responses: {
            ...ok200('Settings updated'),
            400: {
              description: 'Validation error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
      },
      '/api/trade/v1/event/summary': {
        get: {
          tags: ['Trade'],
          summary: 'Get event list with pagination and filters',
          security: bearer,
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 15 } },
            {
              name: 'filter',
              in: 'query',
              schema: { type: 'string', enum: ['bullish', 'bearish', 'upcoming', 'past'] },
            },
            { name: 'search', in: 'query', schema: { type: 'string' } },
          ],
          responses: ok200('Event list'),
        },
      },
      '/api/trade/v1/event/{id}': {
        get: {
          tags: ['Trade'],
          summary: 'Get market event by ID',
          security: bearer,
          parameters: [pathParam('id', 'integer')],
          responses: {
            ...ok200('Event detail'),
            404: {
              description: 'Not found',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
      },
      '/api/trade/v1/event/create': {
        post: {
          tags: ['Trade'],
          summary: 'Create a market event',
          security: bearer,
          requestBody: bodyJson(eventSchema),
          responses: ok201('Event created'),
        },
      },
      '/api/trade/v1/event/update/{id}': {
        put: {
          tags: ['Trade'],
          summary: 'Update a market event',
          security: bearer,
          parameters: [pathParam('id', 'integer')],
          requestBody: bodyJson(eventSchema.partial()),
          responses: {
            ...ok200('Event updated'),
            400: {
              description: 'Validation error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
      },
      '/api/trade/v1/event/delete/{id}': {
        delete: {
          tags: ['Trade'],
          summary: 'Delete a market event',
          security: bearer,
          parameters: [pathParam('id', 'integer')],
          responses: ok204(),
        },
      },
      '/api/trade/v1/fee/summary': {
        get: {
          tags: ['Trade'],
          summary: 'Get fee list with pagination',
          security: bearer,
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 15 } },
          ],
          responses: ok200('Fee list'),
        },
      },
      '/api/trade/v1/fee/{id}': {
        get: {
          tags: ['Trade'],
          summary: 'Get fee by ID',
          security: bearer,
          parameters: [pathParam('id', 'integer')],
          responses: ok200('Fee detail'),
        },
      },
      '/api/trade/v1/fee/create': {
        post: {
          tags: ['Trade'],
          summary: 'Create a trade fee record',
          security: bearer,
          requestBody: bodyJson(feeSchema),
          responses: ok201('Fee created'),
        },
      },
      '/api/trade/v1/fee/update/{id}': {
        put: {
          tags: ['Trade'],
          summary: 'Update a fee record',
          security: bearer,
          parameters: [pathParam('id', 'integer')],
          requestBody: bodyJson(feeSchema.partial()),
          responses: {
            ...ok200('Fee updated'),
            400: {
              description: 'Validation error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
      },
      '/api/trade/v1/fee/delete/{id}': {
        delete: {
          tags: ['Trade'],
          summary: 'Delete a fee record',
          security: bearer,
          parameters: [pathParam('id', 'integer')],
          responses: ok204(),
        },
      },

      // ── RUNNING ────────────────────────────────────────────────
      '/api/running/v1/dashboard': {
        get: {
          tags: ['Running'],
          summary: 'Get running dashboard summary',
          security: bearer,
          responses: ok200('Dashboard data'),
        },
      },
      '/api/running/v1/activities': {
        get: {
          tags: ['Running'],
          summary: 'List running activities',
          security: bearer,
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
            { name: 'type', in: 'query', schema: { type: 'string' } },
          ],
          responses: ok200('Activity list'),
        },
        post: {
          tags: ['Running'],
          summary: 'Create a manual activity entry',
          security: bearer,
          requestBody: bodyJson(createActivitySchema),
          responses: ok201('Activity created'),
        },
        patch: {
          tags: ['Running'],
          summary: 'Update activity notes, type, or RPE',
          security: bearer,
          requestBody: bodyJson(patchActivitySchema),
          responses: {
            ...ok200('Activity updated'),
            400: {
              description: 'Validation error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
      },
      '/api/running/v1/activities/{id}/streams': {
        get: {
          tags: ['Running'],
          summary: 'Get GPS/HR streams for an activity',
          security: bearer,
          parameters: [pathParam('id')],
          responses: {
            ...ok200('Activity streams'),
            404: {
              description: 'Not found',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
      },
      '/api/running/v1/activities/types': {
        get: {
          tags: ['Running'],
          summary: 'Get available activity type options',
          security: bearer,
          responses: ok200('Activity types'),
        },
      },
      '/api/running/v1/gear': {
        get: {
          tags: ['Running'],
          summary: 'List running gear (shoes)',
          security: bearer,
          responses: ok200('Gear list'),
        },
        patch: {
          tags: ['Running'],
          summary: 'Update gear category or retirement km',
          security: bearer,
          requestBody: bodyJson(updateGearSchema),
          responses: {
            ...ok200('Gear updated'),
            400: {
              description: 'Validation error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
      },
      '/api/running/v1/goals/{id}': {
        put: {
          tags: ['Running'],
          summary: 'Update a running goal',
          security: bearer,
          parameters: [pathParam('id')],
          requestBody: bodyJson(updateGoalSchema),
          responses: {
            ...ok200('Goal updated'),
            400: {
              description: 'Validation error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
      },
      '/api/running/v1/upcoming-races': {
        get: {
          tags: ['Running'],
          summary: 'List upcoming races',
          security: bearer,
          responses: ok200('Upcoming races'),
        },
        post: {
          tags: ['Running'],
          summary: 'Create an upcoming race goal',
          security: bearer,
          requestBody: bodyJson(createUpcomingRaceSchema),
          responses: ok201('Race created'),
        },
      },
      '/api/running/v1/upcoming-races/{id}': {
        patch: {
          tags: ['Running'],
          summary: 'Update an upcoming race',
          security: bearer,
          parameters: [pathParam('id')],
          requestBody: bodyJson(updateUpcomingRaceSchema),
          responses: {
            ...ok200('Race updated'),
            400: {
              description: 'Validation error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
        delete: {
          tags: ['Running'],
          summary: 'Delete an upcoming race',
          security: bearer,
          parameters: [pathParam('id')],
          responses: ok204(),
        },
      },
      '/api/running/v1/race-log/{id}': {
        get: {
          tags: ['Running'],
          summary: 'Get race log entry by ID',
          security: bearer,
          parameters: [pathParam('id')],
          responses: ok200('Race log detail'),
        },
        post: {
          tags: ['Running'],
          summary: 'Create a race log entry',
          security: bearer,
          parameters: [pathParam('id')],
          requestBody: bodyJson(createRaceLogSchema),
          responses: ok201('Race log created'),
        },
        patch: {
          tags: ['Running'],
          summary: 'Update a race log entry',
          security: bearer,
          parameters: [pathParam('id')],
          requestBody: bodyJson(updateRaceLogSchema),
          responses: {
            ...ok200('Race log updated'),
            400: {
              description: 'Validation error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
      },
      '/api/running/v1/health/subjective': {
        get: {
          tags: ['Running'],
          summary: 'List subjective health logs',
          security: bearer,
          responses: ok200('Health logs'),
        },
        post: {
          tags: ['Running'],
          summary: 'Create a subjective health log entry',
          security: bearer,
          requestBody: bodyJson(createSubjectiveHealthSchema),
          responses: ok201('Health log created'),
        },
      },
      '/api/running/v1/health/subjective/{id}': {
        patch: {
          tags: ['Running'],
          summary: 'Update a subjective health log entry',
          security: bearer,
          parameters: [pathParam('id')],
          requestBody: bodyJson(patchSubjectiveHealthSchema),
          responses: {
            ...ok200('Health log updated'),
            400: {
              description: 'Validation error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
      },
      '/api/running/v1/health/weight': {
        get: {
          tags: ['Running'],
          summary: 'List weight measurement logs',
          security: bearer,
          responses: ok200('Weight logs'),
        },
        post: {
          tags: ['Running'],
          summary: 'Create a weight log entry',
          security: bearer,
          requestBody: bodyJson(createWeightSchema),
          responses: ok201('Weight log created'),
        },
      },
      '/api/running/v1/health/weight/{id}': {
        patch: {
          tags: ['Running'],
          summary: 'Update a weight log entry',
          security: bearer,
          parameters: [pathParam('id')],
          requestBody: bodyJson(patchWeightSchema),
          responses: {
            ...ok200('Weight log updated'),
            400: {
              description: 'Validation error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
      },
      '/api/running/v1/performance-trends': {
        get: {
          tags: ['Running'],
          summary: 'Get performance trend data (pace, HR, VO2max over time)',
          security: bearer,
          responses: ok200('Performance trends'),
        },
      },
      '/api/running/v1/analytics/personal-bests': {
        get: {
          tags: ['Running'],
          summary: 'Get personal best times per distance',
          security: bearer,
          responses: ok200('Personal bests'),
        },
      },
      '/api/running/v1/analytics/pmc': {
        get: {
          tags: ['Running'],
          summary: 'Get Performance Management Chart (CTL/ATL/TSB)',
          security: bearer,
          responses: ok200('PMC data'),
        },
      },
      '/api/running/v1/analytics/endurance-score': {
        get: {
          tags: ['Running'],
          summary: 'Get endurance score over time',
          security: bearer,
          responses: ok200('Endurance score'),
        },
      },
      '/api/running/v1/analytics/calorie-trend': {
        get: {
          tags: ['Running'],
          summary: 'Get calorie burn trend',
          security: bearer,
          responses: ok200('Calorie trend'),
        },
      },
      '/api/running/v1/ai/insights': {
        get: {
          tags: ['Running'],
          summary: 'List AI-generated training insights',
          security: bearer,
          responses: ok200('Insights list'),
        },
      },
      '/api/running/v1/ai/insights/generate': {
        post: {
          tags: ['Running'],
          summary: 'Generate new AI training insights',
          security: bearer,
          responses: ok200('Insights generated'),
        },
      },
      '/api/running/v1/ai/injury-coach': {
        post: {
          tags: ['Running'],
          summary: 'Ask the AI injury coach a question',
          security: bearer,
          requestBody: bodyJson(z.object({ message: z.string().min(1) })),
          responses: ok200('Coach response'),
        },
      },
      '/api/running/v1/sync/strava': {
        post: {
          tags: ['Running'],
          summary: 'Trigger a full Strava activity sync',
          security: bearer,
          responses: ok200('Sync triggered'),
        },
      },
      '/api/running/v1/sync/status': {
        get: {
          tags: ['Running'],
          summary: 'Get current Strava sync status',
          security: bearer,
          responses: ok200('Sync status'),
        },
      },

      // ── INVESTMENT FLOW ────────────────────────────────────────
      '/api/investment-flow/v1': {
        get: {
          tags: ['Investment Flow'],
          summary: 'Get all investment nodes + uninvested cash',
          security: bearer,
          responses: ok200('Investment flow data'),
        },
        post: {
          tags: ['Investment Flow'],
          summary: 'Create an investment flow node',
          security: bearer,
          requestBody: bodyJson(createNodeSchema),
          responses: {
            ...ok201('Node created'),
            422: {
              description: 'Business rule violation',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
        put: {
          tags: ['Investment Flow'],
          summary: 'Update an investment flow node',
          security: bearer,
          requestBody: bodyJson(updateNodeSchema),
          responses: {
            ...ok200('Node updated'),
            400: {
              description: 'Validation error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
            422: {
              description: 'Business rule violation',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
        delete: {
          tags: ['Investment Flow'],
          summary: 'Delete a node and its subtree (query: ?id=uuid)',
          security: bearer,
          parameters: [
            { name: 'id', in: 'query', required: true, schema: { type: 'string', format: 'uuid' } },
          ],
          responses: {
            ...ok204(),
            400: {
              description: 'Validation error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
            404: {
              description: 'Not found',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
      },
      '/api/investment-flow/v1/move': {
        post: {
          tags: ['Investment Flow'],
          summary: 'Move a node to a new parent',
          security: bearer,
          requestBody: bodyJson(moveNodeSchema),
          responses: {
            ...ok200('Node moved'),
            400: {
              description: 'Validation error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
      },
      '/api/investment-flow/v1/uninvested-cash': {
        get: {
          tags: ['Investment Flow'],
          summary: 'Get uninvested cash amount',
          security: bearer,
          responses: ok200('Uninvested cash'),
        },
        put: {
          tags: ['Investment Flow'],
          summary: 'Update uninvested cash amount',
          security: bearer,
          requestBody: bodyJson(updateUninvestedCashSchema),
          responses: {
            ...ok200('Cash updated'),
            400: {
              description: 'Validation error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
      },
      '/api/investment-flow/v1/uninvested-cash/categories': {
        get: {
          tags: ['Investment Flow'],
          summary: 'List cash categories',
          security: bearer,
          responses: ok200('Cash categories'),
        },
        post: {
          tags: ['Investment Flow'],
          summary: 'Create a cash category',
          security: bearer,
          requestBody: bodyJson(createCashCategorySchema),
          responses: ok201('Category created'),
        },
      },
      '/api/investment-flow/v1/uninvested-cash/categories/{id}': {
        put: {
          tags: ['Investment Flow'],
          summary: 'Update a cash category',
          security: bearer,
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          ],
          requestBody: bodyJson(updateCashCategorySchema),
          responses: {
            ...ok200('Category updated'),
            400: {
              description: 'Validation error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
        delete: {
          tags: ['Investment Flow'],
          summary: 'Delete a cash category',
          security: bearer,
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          ],
          responses: ok204(),
        },
      },
    },
  }
}
