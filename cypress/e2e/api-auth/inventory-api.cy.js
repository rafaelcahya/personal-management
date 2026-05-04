/**
 * API Auth Guard Tests — Inventory Module
 * Memastikan semua endpoint menolak akses tanpa session (401)
 *
 * CRITICAL FINDING:
 * product-history routes TIDAK memiliki auth check — ditest terpisah
 * dan di-flag sebagai security issue.
 */

import { INVENTORY_ENDPOINTS } from "../../fixtures/api-endpoints.js";

const FAKE_ID = "00000000-0000-0000-0000-000000000000";

// ─── PRODUCT ────────────────────────────────────────────────────────────────

describe("API Auth Guard — Inventory: Product", () => {
    it(`GET ${INVENTORY_ENDPOINTS.PRODUCT_LIST} — should return 401`, () => {
        cy.apiRequestNoAuth("GET", INVENTORY_ENDPOINTS.PRODUCT_LIST).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it(`POST ${INVENTORY_ENDPOINTS.PRODUCT_CREATE} — should return 401`, () => {
        cy.apiRequestNoAuth("POST", INVENTORY_ENDPOINTS.PRODUCT_CREATE, {
            body: { name: "test" },
        }).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it(`GET /api/inventory/v1/product/[id] — should return 401`, () => {
        cy.apiRequestNoAuth("GET", INVENTORY_ENDPOINTS.PRODUCT_DETAIL(FAKE_ID)).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it(`DELETE /api/inventory/v1/product/delete/[id] — should return 401`, () => {
        cy.apiRequestNoAuth("DELETE", INVENTORY_ENDPOINTS.PRODUCT_DELETE(FAKE_ID)).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it(`PATCH /api/inventory/v1/product/[id]/favorite — should return 401`, () => {
        cy.apiRequestNoAuth("PATCH", INVENTORY_ENDPOINTS.PRODUCT_FAVORITE(FAKE_ID)).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it(`PATCH /api/inventory/v1/product/adjust/[id] — should return 401`, () => {
        cy.apiRequestNoAuth("PATCH", INVENTORY_ENDPOINTS.PRODUCT_ADJUST(FAKE_ID)).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it(`GET ${INVENTORY_ENDPOINTS.PRODUCT_SUMMARY} — should return 401`, () => {
        cy.apiRequestNoAuth("GET", INVENTORY_ENDPOINTS.PRODUCT_SUMMARY).then((res) => {
            expect(res.status).to.eq(401);
        });
    });
});

// ─── PRODUCT STOCK ───────────────────────────────────────────────────────────

describe("API Auth Guard — Inventory: Product Stock", () => {
    it(`POST ${INVENTORY_ENDPOINTS.PRODUCT_STOCK_CREATE} — should return 401`, () => {
        cy.apiRequestNoAuth("POST", INVENTORY_ENDPOINTS.PRODUCT_STOCK_CREATE, {
            body: { productId: FAKE_ID, quantity: 1 },
        }).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it(`GET /api/inventory/v1/product/stock/history/[id] — should return 401`, () => {
        cy.apiRequestNoAuth("GET", INVENTORY_ENDPOINTS.PRODUCT_STOCK_HISTORY(FAKE_ID)).then((res) => {
            expect(res.status).to.eq(401);
        });
    });
});

// ─── PRODUCT BRAND ───────────────────────────────────────────────────────────

describe("API Auth Guard — Inventory: Product Brand", () => {
    it(`GET ${INVENTORY_ENDPOINTS.PRODUCT_BRAND_LIST} — should return 401`, () => {
        cy.apiRequestNoAuth("GET", INVENTORY_ENDPOINTS.PRODUCT_BRAND_LIST).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it(`POST ${INVENTORY_ENDPOINTS.PRODUCT_BRAND_CREATE} — should return 401`, () => {
        cy.apiRequestNoAuth("POST", INVENTORY_ENDPOINTS.PRODUCT_BRAND_CREATE, {
            body: { brand: "test" },
        }).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it(`GET /api/inventory/v1/product-brand/[id] — should return 401`, () => {
        cy.apiRequestNoAuth("GET", INVENTORY_ENDPOINTS.PRODUCT_BRAND_DETAIL(FAKE_ID)).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it(`PUT /api/inventory/v1/product-brand/update/[id] — should return 401`, () => {
        cy.apiRequestNoAuth("PUT", INVENTORY_ENDPOINTS.PRODUCT_BRAND_UPDATE(FAKE_ID), {
            body: { brand: "test" },
        }).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it(`DELETE /api/inventory/v1/product-brand/delete/[id] — should return 401`, () => {
        cy.apiRequestNoAuth("DELETE", INVENTORY_ENDPOINTS.PRODUCT_BRAND_DELETE(FAKE_ID)).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it(`GET ${INVENTORY_ENDPOINTS.PRODUCT_BRAND_SUMMARY} — should return 401`, () => {
        cy.apiRequestNoAuth("GET", INVENTORY_ENDPOINTS.PRODUCT_BRAND_SUMMARY).then((res) => {
            expect(res.status).to.eq(401);
        });
    });
});

// ─── PRODUCT NAME ────────────────────────────────────────────────────────────

describe("API Auth Guard — Inventory: Product Name", () => {
    it(`GET ${INVENTORY_ENDPOINTS.PRODUCT_NAME_LIST} — should return 401`, () => {
        cy.apiRequestNoAuth("GET", INVENTORY_ENDPOINTS.PRODUCT_NAME_LIST).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it(`POST ${INVENTORY_ENDPOINTS.PRODUCT_NAME_CREATE} — should return 401`, () => {
        cy.apiRequestNoAuth("POST", INVENTORY_ENDPOINTS.PRODUCT_NAME_CREATE, {
            body: { product_name: "test" },
        }).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it(`GET /api/inventory/v1/product-name/[id] — should return 401`, () => {
        cy.apiRequestNoAuth("GET", INVENTORY_ENDPOINTS.PRODUCT_NAME_DETAIL(FAKE_ID)).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it(`PUT /api/inventory/v1/product-name/update/[id] — should return 401`, () => {
        cy.apiRequestNoAuth("PUT", INVENTORY_ENDPOINTS.PRODUCT_NAME_UPDATE(FAKE_ID), {
            body: { product_name: "test" },
        }).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it(`DELETE /api/inventory/v1/product-name/delete/[id] — should return 401`, () => {
        cy.apiRequestNoAuth("DELETE", INVENTORY_ENDPOINTS.PRODUCT_NAME_DELETE(FAKE_ID)).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it(`GET ${INVENTORY_ENDPOINTS.PRODUCT_NAME_SUMMARY} — should return 401`, () => {
        cy.apiRequestNoAuth("GET", INVENTORY_ENDPOINTS.PRODUCT_NAME_SUMMARY).then((res) => {
            expect(res.status).to.eq(401);
        });
    });
});

// ─── PRODUCT HISTORY — SECURITY ISSUE ────────────────────────────────────────

describe("API Auth Guard — Inventory: Product History [SECURITY]", () => {
    /**
     * CRITICAL: Routes berikut TIDAK memiliki auth check di kode.
     * Test ini diharapkan FAIL sampai backend menambahkan auth guard.
     * Jika test ini PASS berarti ada celah keamanan — data history
     * bisa diakses tanpa login.
     */

    it(`GET ${INVENTORY_ENDPOINTS.PRODUCT_HISTORY_LIST} — should return 401 [MISSING AUTH]`, () => {
        cy.apiRequestNoAuth("GET", INVENTORY_ENDPOINTS.PRODUCT_HISTORY_LIST).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it(`GET /api/inventory/v1/product-history/[id] — should return 401 [MISSING AUTH]`, () => {
        cy.apiRequestNoAuth("GET", INVENTORY_ENDPOINTS.PRODUCT_HISTORY_DETAIL(FAKE_ID)).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it(`PATCH /api/inventory/v1/product-history/update/[id] — should return 401 [MISSING AUTH]`, () => {
        cy.apiRequestNoAuth("PATCH", INVENTORY_ENDPOINTS.PRODUCT_HISTORY_UPDATE(FAKE_ID), {
            body: { depleted_quantity: 1 },
        }).then((res) => {
            expect(res.status).to.eq(401);
        });
    });
});
