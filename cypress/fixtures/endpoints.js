export const AUTH_ENDPOINTS = {
  CYPRESS_LOGIN: '/api/auth/v1/cypress-login',
  LOGOUT: '/api/auth/logout',
  LOGOUT_V1: '/api/auth/v1/logout',
  SESSION: '/api/auth/v1/session',
}

export const USER_ENDPOINTS = {
  USER: '/api/user',
  AVATAR: '/api/user/avatar',
  PROFILE_V1: '/api/user/v1/profile',
  UPDATE: '/api/user/v1/update',
}

export const CHAT_ENDPOINTS = {
  CHAT: '/api/chat',
  TRADE_CHAT: '/api/trade-chat',
}

export const INVENTORY_ENDPOINTS = {
  PRODUCT_BASE: '/api/inventory/v1/product',
  PRODUCT_LIST: '/api/inventory/v1/product/list',
  PRODUCT_CREATE: '/api/inventory/v1/product/create',
  PRODUCT_DETAIL: (id) => `/api/inventory/v1/product/${id}`,
  PRODUCT_UPDATE_DETAILS: (id) => `/api/inventory/v1/product/${id}`,
  PRODUCT_DELETE: (id) => `/api/inventory/v1/product/delete/${id}`,
  PRODUCT_FAVORITE: (id) => `/api/inventory/v1/product/${id}/favorite`,
  PRODUCT_ADJUST: (id) => `/api/inventory/v1/product/adjust/${id}`,
  PRODUCT_SUMMARY: '/api/inventory/v1/product/summary',
  PRODUCT_LAST_PRICE: (id) => `/api/inventory/v1/product/${id}/last-price`,
  PRODUCT_RESTOCK_PREDICTIONS: '/api/inventory/v1/product/restock-predictions',

  PRODUCT_STOCK_CREATE: '/api/inventory/v1/product/stock/create',
  PRODUCT_STOCK_HISTORY: (id) => `/api/inventory/v1/product/stock/history/${id}`,

  PRODUCT_BRAND_LIST: '/api/inventory/v1/product-brand/list',
  PRODUCT_BRAND_CREATE: '/api/inventory/v1/product-brand/create',
  PRODUCT_BRAND_DETAIL: (id) => `/api/inventory/v1/product-brand/${id}`,
  PRODUCT_BRAND_UPDATE: (id) => `/api/inventory/v1/product-brand/update/${id}`,
  PRODUCT_BRAND_DELETE: (id) => `/api/inventory/v1/product-brand/delete/${id}`,
  PRODUCT_BRAND_SUMMARY: '/api/inventory/v1/product-brand/summary',

  PRODUCT_NAME_LIST: '/api/inventory/v1/product-name/list',
  PRODUCT_NAME_CREATE: '/api/inventory/v1/product-name/create',
  PRODUCT_NAME_DETAIL: (id) => `/api/inventory/v1/product-name/${id}`,
  PRODUCT_NAME_UPDATE: (id) => `/api/inventory/v1/product-name/update/${id}`,
  PRODUCT_NAME_DELETE: (id) => `/api/inventory/v1/product-name/delete/${id}`,
  PRODUCT_NAME_SUMMARY: '/api/inventory/v1/product-name/summary',

  PRODUCT_HISTORY: '/api/inventory/v1/product-history',
  PRODUCT_HISTORY_LIST: '/api/inventory/v1/product-history/list',
  PRODUCT_HISTORY_DETAIL: (id) => `/api/inventory/v1/product-history/${id}`,
  PRODUCT_HISTORY_UPDATE: (id) => `/api/inventory/v1/product-history/update/${id}`,

  DASHBOARD: '/api/inventory/v1/dashboard',

  BUDGET: '/api/inventory/v1/budget',

  LIST: '/api/inventory/v1/list',
  CREATE: '/api/inventory/v1/create',
  UPDATE: '/api/inventory/v1/update',
  DELETE: '/api/inventory/v1/delete',
  DETAIL: '/api/inventory/v1/detail',
  GET_PRODUCTS: '/api/inventory/v1/get-products',
}

export const TRADE_ENDPOINTS = {
  DASHBOARD_METRICS: '/api/trade/v1/dashboard/metrics',
  DASHBOARD_QUICK_VIEW: '/api/trade/v1/dashboard/quick-view',

  TRADE_LIST: '/api/trade/v1/trade/list',
  TRADE_CREATE: '/api/trade/v1/trade/create',
  TRADE_DETAIL: (id) => `/api/trade/v1/trade/${id}`,
  TRADE_UPDATE: (id) => `/api/trade/v1/trade/update/${id}`,
  TRADE_DELETE: (id) => `/api/trade/v1/trade/delete/${id}`,
  TRADE_SUMMARY: '/api/trade/v1/trade/summary',
  TRADE_OPTIONS: (type) => `/api/trade/v1/trade/options/${type}`,

  EVENT_LIST: '/api/trade/v1/event/list',
  EVENT_CREATE: '/api/trade/v1/event/create',
  EVENT_DETAIL: (id) => `/api/trade/v1/event/${id}`,
  EVENT_UPDATE: (id) => `/api/trade/v1/event/update/${id}`,
  EVENT_DELETE: (id) => `/api/trade/v1/event/delete/${id}`,
  EVENT_FAVORITE: (id) => `/api/trade/v1/event/favorite/${id}`,
  EVENT_SUMMARY: '/api/trade/v1/event/summary',

  FEE_LIST: '/api/trade/v1/fee/list',
  FEE_CREATE: '/api/trade/v1/fee/create',
  FEE_DETAIL: (id) => `/api/trade/v1/fee/${id}`,
  FEE_UPDATE: (id) => `/api/trade/v1/fee/update/${id}`,
  FEE_DELETE: (id) => `/api/trade/v1/fee/delete/${id}`,
  FEE_SUMMARY: '/api/trade/v1/fee/summary',

  SETTINGS: '/api/trade/v1/settings',
  SETTINGS_UPDATE: '/api/trade/v1/settings/update',

  OPTIONS_BUY_REASON: '/api/trade/v1/options/buy-reason',
  OPTIONS_SELL_REASON: '/api/trade/v1/options/sell-reason',
  OPTIONS_ENTRY_SESSION: '/api/trade/v1/options/entry-session',
  OPTIONS_ENTRY_OCCASION: '/api/trade/v1/options/entry-occasion',
  OPTIONS_STOCK_TYPE: '/api/trade/v1/options/stock-type',

  LIST: '/api/trading/v1/list',
  EXECUTE: '/api/trading/v1/execute',
  CANCEL: '/api/trading/v1/cancel',
  DETAIL: '/api/trading/v1/detail',
  GET_TRADES: '/api/trade/v1/get-trades',
}

export const RUNNING_ENDPOINTS = {
  ONBOARDING_BIOMETRIC: '/api/running/v1/onboarding/biometric',
  ONBOARDING_COMPLETE: '/api/running/v1/onboarding/complete',

  SYNC_STRAVA: '/api/running/v1/sync/strava',
  SYNC_STATUS: '/api/running/v1/sync/status',
  STRAVA_CALLBACK: '/api/running/v1/auth/strava/callback',
  STRAVA_SYNC: '/api/running/v1/auth/strava/sync',

  ACTIVITIES: '/api/running/v1/activities',
  SUBJECTIVE_HEALTH: '/api/running/v1/health/subjective',
  WEIGHT_LOG: '/api/running/v1/health/weight',

  DASHBOARD: '/api/running/v1/dashboard',
  PERFORMANCE_TRENDS: '/api/running/v1/performance-trends',
  CALENDAR: '/api/running/v1/calendar',

  GEAR_LIST: '/api/running/v1/gear',
  GEAR_UPDATE: '/api/running/v1/gear',

  RACE_LOG_LIST: '/api/running/v1/race-log',
  RACE_LOG_CREATE: '/api/running/v1/race-log',
  RACE_LOG_UPDATE: '/api/running/v1/race-log',
  RACE_LOG_DELETE: '/api/running/v1/race-log',
  RACE_LOG_DETAIL: '/api/running/v1/race-log',

  GOALS_UPDATE: '/api/running/v1/goals',

  ACTIVITY_STREAMS: '/api/running/v1/activities',

  AI_INSIGHTS_LIST: '/api/running/v1/ai/insights',
  AI_INSIGHTS_GENERATE: '/api/running/v1/ai/insights/generate',
  AI_INSIGHTS_DAILY: '/api/running/v1/ai/insights/daily',
  AI_INSIGHTS_FOLLOWUP: '/api/running/v1/ai/insights/followup',
  AI_INSIGHTS_ACK: (id) => `/api/running/v1/ai/insights/${id}/ack`,

  STRAVA_RE_ENRICH: '/api/running/v1/auth/strava/re-enrich',
  STRAVA_RE_ENRICH_METRICS: '/api/running/v1/auth/strava/re-enrich-metrics',

  UPCOMING_RACES: '/api/running/v1/upcoming-races',
  UPCOMING_RACE_DETAIL: '/api/running/v1/upcoming-races',

  STRAVA_STATUS: '/api/running/v1/user/strava-status',
  SYNC_WEBHOOK: '/api/running/v1/sync/webhook',

  USER_PROFILE: '/api/running/v1/user/profile',
  TARGET_EFFORT: '/api/running/v1/analytics/target-effort',
}
