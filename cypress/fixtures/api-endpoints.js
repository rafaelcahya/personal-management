/**
 * API Endpoints — Single Source of Truth
 * Semua endpoint string didefinisikan di sini.
 * Import konstanta ini di test files, jangan hardcode endpoint langsung.
 */

export const AUTH_ENDPOINTS = {
    LOGOUT: "/api/auth/logout",
};

export const USER_ENDPOINTS = {
    USER: "/api/user",
    AVATAR: "/api/user/avatar",
};

export const CHAT_ENDPOINTS = {
    CHAT: "/api/chat",
    TRADE_CHAT: "/api/trade-chat",
};

export const TRADE_ENDPOINTS = {
    // Dashboard
    DASHBOARD_METRICS: "/api/trade/v1/dashboard/metrics",
    DASHBOARD_QUICK_VIEW: "/api/trade/v1/dashboard/quick-view",

    // Trade
    TRADE_LIST: "/api/trade/v1/trade/list",
    TRADE_CREATE: "/api/trade/v1/trade/create",
    TRADE_DETAIL: (id) => `/api/trade/v1/trade/${id}`,
    TRADE_UPDATE: (id) => `/api/trade/v1/trade/update/${id}`,
    TRADE_DELETE: (id) => `/api/trade/v1/trade/delete/${id}`,
    TRADE_SUMMARY: "/api/trade/v1/trade/summary",
    TRADE_OPTIONS: (type) => `/api/trade/v1/trade/options/${type}`,

    // Event
    EVENT_LIST: "/api/trade/v1/event/list",
    EVENT_CREATE: "/api/trade/v1/event/create",
    EVENT_DETAIL: (id) => `/api/trade/v1/event/${id}`,
    EVENT_UPDATE: (id) => `/api/trade/v1/event/update/${id}`,
    EVENT_DELETE: (id) => `/api/trade/v1/event/delete/${id}`,
    EVENT_FAVORITE: (id) => `/api/trade/v1/event/favorite/${id}`,
    EVENT_SUMMARY: "/api/trade/v1/event/summary",

    // Fee
    FEE_LIST: "/api/trade/v1/fee/list",
    FEE_CREATE: "/api/trade/v1/fee/create",
    FEE_DETAIL: (id) => `/api/trade/v1/fee/${id}`,
    FEE_UPDATE: (id) => `/api/trade/v1/fee/update/${id}`,
    FEE_DELETE: (id) => `/api/trade/v1/fee/delete/${id}`,
    FEE_SUMMARY: "/api/trade/v1/fee/summary",

    // Settings
    SETTINGS: "/api/trade/v1/settings",
    SETTINGS_UPDATE: "/api/trade/v1/settings/update",

    // Options
    OPTIONS_BUY_REASON: "/api/trade/v1/options/buy-reason",
    OPTIONS_SELL_REASON: "/api/trade/v1/options/sell-reason",
    OPTIONS_ENTRY_SESSION: "/api/trade/v1/options/entry-session",
    OPTIONS_ENTRY_OCCASION: "/api/trade/v1/options/entry-occasion",
    OPTIONS_STOCK_TYPE: "/api/trade/v1/options/stock-type",
};

export const INVENTORY_ENDPOINTS = {
    // Product
    PRODUCT_LIST: "/api/inventory/v1/product/list",
    PRODUCT_CREATE: "/api/inventory/v1/product/create",
    PRODUCT_DETAIL: (id) => `/api/inventory/v1/product/${id}`,
    PRODUCT_DELETE: (id) => `/api/inventory/v1/product/delete/${id}`,
    PRODUCT_FAVORITE: (id) => `/api/inventory/v1/product/${id}/favorite`,
    PRODUCT_ADJUST: (id) => `/api/inventory/v1/product/adjust/${id}`,
    PRODUCT_SUMMARY: "/api/inventory/v1/product/summary",

    // Product Stock
    PRODUCT_STOCK_CREATE: "/api/inventory/v1/product/stock/create",
    PRODUCT_STOCK_HISTORY: (id) => `/api/inventory/v1/product/stock/history/${id}`,

    // Product Brand
    PRODUCT_BRAND_LIST: "/api/inventory/v1/product-brand/list",
    PRODUCT_BRAND_CREATE: "/api/inventory/v1/product-brand/create",
    PRODUCT_BRAND_DETAIL: (id) => `/api/inventory/v1/product-brand/${id}`,
    PRODUCT_BRAND_UPDATE: (id) => `/api/inventory/v1/product-brand/update/${id}`,
    PRODUCT_BRAND_DELETE: (id) => `/api/inventory/v1/product-brand/delete/${id}`,
    PRODUCT_BRAND_SUMMARY: "/api/inventory/v1/product-brand/summary",

    // Product Name
    PRODUCT_NAME_LIST: "/api/inventory/v1/product-name/list",
    PRODUCT_NAME_CREATE: "/api/inventory/v1/product-name/create",
    PRODUCT_NAME_DETAIL: (id) => `/api/inventory/v1/product-name/${id}`,
    PRODUCT_NAME_UPDATE: (id) => `/api/inventory/v1/product-name/update/${id}`,
    PRODUCT_NAME_DELETE: (id) => `/api/inventory/v1/product-name/delete/${id}`,
    PRODUCT_NAME_SUMMARY: "/api/inventory/v1/product-name/summary",

    // Product History
    PRODUCT_HISTORY_LIST: "/api/inventory/v1/product-history/list",
    PRODUCT_HISTORY_DETAIL: (id) => `/api/inventory/v1/product-history/${id}`,
    PRODUCT_HISTORY_UPDATE: (id) => `/api/inventory/v1/product-history/update/${id}`,
};
