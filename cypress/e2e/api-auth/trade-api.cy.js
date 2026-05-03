/**
 * API Auth Guard Tests — Trade Module
 * Memastikan semua endpoint menolak akses tanpa session (401)
 *
 * NOTE: /api/trade/v1/options/* adalah public endpoints (lookup data)
 * — tidak perlu auth, ditest terpisah untuk memastikan tetap accessible.
 */

const FAKE_ID = "00000000-0000-0000-0000-000000000000";

// ─── DASHBOARD ───────────────────────────────────────────────────────────────

describe("API Auth Guard — Trade: Dashboard", () => {
    it("GET /api/trade/v1/dashboard/metrics — should return 401", () => {
        cy.apiRequestNoAuth("GET", "/api/trade/v1/dashboard/metrics").then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it("GET /api/trade/v1/dashboard/quick-view — should return 401", () => {
        cy.apiRequestNoAuth("GET", "/api/trade/v1/dashboard/quick-view").then((res) => {
            expect(res.status).to.eq(401);
        });
    });
});

// ─── TRADE ───────────────────────────────────────────────────────────────────

describe("API Auth Guard — Trade: Trade", () => {
    it("GET /api/trade/v1/trade/list — should return 401", () => {
        cy.apiRequestNoAuth("GET", "/api/trade/v1/trade/list").then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it("POST /api/trade/v1/trade/create — should return 401", () => {
        cy.apiRequestNoAuth("POST", "/api/trade/v1/trade/create", {
            body: { stock: "BBCA" },
        }).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it("GET /api/trade/v1/trade/[id] — should return 401", () => {
        cy.apiRequestNoAuth("GET", `/api/trade/v1/trade/${FAKE_ID}`).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it("PUT /api/trade/v1/trade/update/[id] — should return 401", () => {
        cy.apiRequestNoAuth("PUT", `/api/trade/v1/trade/update/${FAKE_ID}`, {
            body: { stock: "BBCA" },
        }).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it("DELETE /api/trade/v1/trade/delete/[id] — should return 401", () => {
        cy.apiRequestNoAuth("DELETE", `/api/trade/v1/trade/delete/${FAKE_ID}`).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it("GET /api/trade/v1/trade/summary — should return 401", () => {
        cy.apiRequestNoAuth("GET", "/api/trade/v1/trade/summary").then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it("GET /api/trade/v1/trade/options/[type] — should return 401", () => {
        cy.apiRequestNoAuth("GET", "/api/trade/v1/trade/options/buy-reason").then((res) => {
            expect(res.status).to.eq(401);
        });
    });
});

// ─── EVENT ───────────────────────────────────────────────────────────────────

describe("API Auth Guard — Trade: Event", () => {
    it("GET /api/trade/v1/event/list — should return 401", () => {
        cy.apiRequestNoAuth("GET", "/api/trade/v1/event/list").then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it("POST /api/trade/v1/event/create — should return 401", () => {
        cy.apiRequestNoAuth("POST", "/api/trade/v1/event/create", {
            body: { name: "test" },
        }).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it("GET /api/trade/v1/event/[id] — should return 401", () => {
        cy.apiRequestNoAuth("GET", `/api/trade/v1/event/${FAKE_ID}`).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it("PUT /api/trade/v1/event/update/[id] — should return 401", () => {
        cy.apiRequestNoAuth("PUT", `/api/trade/v1/event/update/${FAKE_ID}`, {
            body: { name: "test" },
        }).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it("DELETE /api/trade/v1/event/delete/[id] — should return 401", () => {
        cy.apiRequestNoAuth("DELETE", `/api/trade/v1/event/delete/${FAKE_ID}`).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it("PATCH /api/trade/v1/event/favorite/[id] — should return 401", () => {
        cy.apiRequestNoAuth("PATCH", `/api/trade/v1/event/favorite/${FAKE_ID}`).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it("GET /api/trade/v1/event/summary — should return 401", () => {
        cy.apiRequestNoAuth("GET", "/api/trade/v1/event/summary").then((res) => {
            expect(res.status).to.eq(401);
        });
    });
});

// ─── FEE ─────────────────────────────────────────────────────────────────────

describe("API Auth Guard — Trade: Fee", () => {
    it("GET /api/trade/v1/fee/list — should return 401", () => {
        cy.apiRequestNoAuth("GET", "/api/trade/v1/fee/list").then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it("POST /api/trade/v1/fee/create — should return 401", () => {
        cy.apiRequestNoAuth("POST", "/api/trade/v1/fee/create", {
            body: { name: "test" },
        }).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it("GET /api/trade/v1/fee/[id] — should return 401", () => {
        cy.apiRequestNoAuth("GET", `/api/trade/v1/fee/${FAKE_ID}`).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it("PUT /api/trade/v1/fee/update/[id] — should return 401", () => {
        cy.apiRequestNoAuth("PUT", `/api/trade/v1/fee/update/${FAKE_ID}`, {
            body: { name: "test" },
        }).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it("DELETE /api/trade/v1/fee/delete/[id] — should return 401", () => {
        cy.apiRequestNoAuth("DELETE", `/api/trade/v1/fee/delete/${FAKE_ID}`).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it("GET /api/trade/v1/fee/summary — should return 401", () => {
        cy.apiRequestNoAuth("GET", "/api/trade/v1/fee/summary").then((res) => {
            expect(res.status).to.eq(401);
        });
    });
});

// ─── SETTINGS ────────────────────────────────────────────────────────────────

describe("API Auth Guard — Trade: Settings", () => {
    it("GET /api/trade/v1/settings — should return 401", () => {
        cy.apiRequestNoAuth("GET", "/api/trade/v1/settings").then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it("PUT /api/trade/v1/settings/update — should return 401", () => {
        cy.apiRequestNoAuth("PUT", "/api/trade/v1/settings/update", {
            body: { initial_margin: 1000 },
        }).then((res) => {
            expect(res.status).to.eq(401);
        });
    });
});

// ─── OPTIONS (AUTH REQUIRED) ──────────────────────────────────────────────────

describe("API Auth Guard — Trade: Options", () => {
    /**
     * Options routes menggunakan createClient (SSR) yang membutuhkan session.
     * Tabel hanya ter-expose ke authenticated role di Supabase RLS.
     * Semua options routes wajib auth karena hanya dipakai di form yang sudah login.
     */

    it("GET /api/trade/v1/options/buy-reason — should return 401", () => {
        cy.apiRequestNoAuth("GET", "/api/trade/v1/options/buy-reason").then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it("GET /api/trade/v1/options/sell-reason — should return 401", () => {
        cy.apiRequestNoAuth("GET", "/api/trade/v1/options/sell-reason").then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it("GET /api/trade/v1/options/entry-session — should return 401", () => {
        cy.apiRequestNoAuth("GET", "/api/trade/v1/options/entry-session").then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it("GET /api/trade/v1/options/entry-occasion — should return 401", () => {
        cy.apiRequestNoAuth("GET", "/api/trade/v1/options/entry-occasion").then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it("GET /api/trade/v1/options/stock-type — should return 401", () => {
        cy.apiRequestNoAuth("GET", "/api/trade/v1/options/stock-type").then((res) => {
            expect(res.status).to.eq(401);
        });
    });
});
