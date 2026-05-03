/**
 * API Auth Guard Tests — Inventory Module
 * Memastikan semua endpoint menolak akses tanpa session (401)
 *
 * CRITICAL FINDING:
 * product-history routes TIDAK memiliki auth check — ditest terpisah
 * dan di-flag sebagai security issue.
 */

const FAKE_ID = "00000000-0000-0000-0000-000000000000";

// ─── PRODUCT ────────────────────────────────────────────────────────────────

describe("API Auth Guard — Inventory: Product", () => {
    it("GET /api/inventory/v1/product/list — should return 401", () => {
        cy.apiRequestNoAuth("GET", "/api/inventory/v1/product/list").then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it("POST /api/inventory/v1/product/create — should return 401", () => {
        cy.apiRequestNoAuth("POST", "/api/inventory/v1/product/create", {
            body: { name: "test" },
        }).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it("GET /api/inventory/v1/product/[id] — should return 401", () => {
        cy.apiRequestNoAuth("GET", `/api/inventory/v1/product/${FAKE_ID}`).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it("DELETE /api/inventory/v1/product/delete/[id] — should return 401", () => {
        cy.apiRequestNoAuth("DELETE", `/api/inventory/v1/product/delete/${FAKE_ID}`).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it("PATCH /api/inventory/v1/product/[id]/favorite — should return 401", () => {
        cy.apiRequestNoAuth("PATCH", `/api/inventory/v1/product/${FAKE_ID}/favorite`).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it("PATCH /api/inventory/v1/product/adjust/[id] — should return 401", () => {
        cy.apiRequestNoAuth("PATCH", `/api/inventory/v1/product/adjust/${FAKE_ID}`).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it("GET /api/inventory/v1/product/summary — should return 401", () => {
        cy.apiRequestNoAuth("GET", "/api/inventory/v1/product/summary").then((res) => {
            expect(res.status).to.eq(401);
        });
    });
});

// ─── PRODUCT STOCK ───────────────────────────────────────────────────────────

describe("API Auth Guard — Inventory: Product Stock", () => {
    it("POST /api/inventory/v1/product/stock/create — should return 401", () => {
        cy.apiRequestNoAuth("POST", "/api/inventory/v1/product/stock/create", {
            body: { productId: FAKE_ID, quantity: 1 },
        }).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it("GET /api/inventory/v1/product/stock/history/[id] — should return 401", () => {
        cy.apiRequestNoAuth("GET", `/api/inventory/v1/product/stock/history/${FAKE_ID}`).then((res) => {
            expect(res.status).to.eq(401);
        });
    });
});

// ─── PRODUCT BRAND ───────────────────────────────────────────────────────────

describe("API Auth Guard — Inventory: Product Brand", () => {
    it("GET /api/inventory/v1/product-brand/list — should return 401", () => {
        cy.apiRequestNoAuth("GET", "/api/inventory/v1/product-brand/list").then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it("POST /api/inventory/v1/product-brand/create — should return 401", () => {
        cy.apiRequestNoAuth("POST", "/api/inventory/v1/product-brand/create", {
            body: { brand: "test" },
        }).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it("GET /api/inventory/v1/product-brand/[id] — should return 401", () => {
        cy.apiRequestNoAuth("GET", `/api/inventory/v1/product-brand/${FAKE_ID}`).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it("PUT /api/inventory/v1/product-brand/update/[id] — should return 401", () => {
        cy.apiRequestNoAuth("PUT", `/api/inventory/v1/product-brand/update/${FAKE_ID}`, {
            body: { brand: "test" },
        }).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it("DELETE /api/inventory/v1/product-brand/delete/[id] — should return 401", () => {
        cy.apiRequestNoAuth("DELETE", `/api/inventory/v1/product-brand/delete/${FAKE_ID}`).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it("GET /api/inventory/v1/product-brand/summary — should return 401", () => {
        cy.apiRequestNoAuth("GET", "/api/inventory/v1/product-brand/summary").then((res) => {
            expect(res.status).to.eq(401);
        });
    });
});

// ─── PRODUCT NAME ────────────────────────────────────────────────────────────

describe("API Auth Guard — Inventory: Product Name", () => {
    it("GET /api/inventory/v1/product-name/list — should return 401", () => {
        cy.apiRequestNoAuth("GET", "/api/inventory/v1/product-name/list").then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it("POST /api/inventory/v1/product-name/create — should return 401", () => {
        cy.apiRequestNoAuth("POST", "/api/inventory/v1/product-name/create", {
            body: { product_name: "test" },
        }).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it("GET /api/inventory/v1/product-name/[id] — should return 401", () => {
        cy.apiRequestNoAuth("GET", `/api/inventory/v1/product-name/${FAKE_ID}`).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it("PUT /api/inventory/v1/product-name/update/[id] — should return 401", () => {
        cy.apiRequestNoAuth("PUT", `/api/inventory/v1/product-name/update/${FAKE_ID}`, {
            body: { product_name: "test" },
        }).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it("DELETE /api/inventory/v1/product-name/delete/[id] — should return 401", () => {
        cy.apiRequestNoAuth("DELETE", `/api/inventory/v1/product-name/delete/${FAKE_ID}`).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it("GET /api/inventory/v1/product-name/summary — should return 401", () => {
        cy.apiRequestNoAuth("GET", "/api/inventory/v1/product-name/summary").then((res) => {
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

    it("GET /api/inventory/v1/product-history/list — should return 401 [MISSING AUTH]", () => {
        cy.apiRequestNoAuth("GET", "/api/inventory/v1/product-history/list").then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it("GET /api/inventory/v1/product-history/[id] — should return 401 [MISSING AUTH]", () => {
        cy.apiRequestNoAuth("GET", `/api/inventory/v1/product-history/${FAKE_ID}`).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it("PATCH /api/inventory/v1/product-history/update/[id] — should return 401 [MISSING AUTH]", () => {
        cy.apiRequestNoAuth("PATCH", `/api/inventory/v1/product-history/update/${FAKE_ID}`, {
            body: { depleted_quantity: 1 },
        }).then((res) => {
            expect(res.status).to.eq(401);
        });
    });
});
