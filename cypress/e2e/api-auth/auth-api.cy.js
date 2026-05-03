/**
 * API Auth Guard Tests — Auth & User & Chat Module
 * Memastikan semua endpoint menolak akses tanpa session (401)
 */

describe("API Auth Guard — Auth Module", () => {
    it("POST /api/auth/logout — should return 401 when unauthenticated", () => {
        cy.apiRequestNoAuth("POST", "/api/auth/logout").then((res) => {
            expect(res.status).to.eq(401);
        });
    });
});

describe("API Auth Guard — User Module", () => {
    it("GET /api/user — should return 401 when unauthenticated", () => {
        cy.apiRequestNoAuth("GET", "/api/user").then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it("PUT /api/user — should return 401 when unauthenticated", () => {
        cy.apiRequestNoAuth("PUT", "/api/user", {
            body: { username: "test" },
        }).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it("POST /api/user/avatar — should return 401 when unauthenticated", () => {
        cy.apiRequestNoAuth("POST", "/api/user/avatar").then((res) => {
            expect(res.status).to.eq(401);
        });
    });
});

describe("API Auth Guard — Chat Module", () => {
    it("POST /api/chat — should return 401 when unauthenticated", () => {
        cy.apiRequestNoAuth("POST", "/api/chat", {
            body: { message: "test" },
        }).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it("POST /api/trade-chat — should return 401 when unauthenticated", () => {
        cy.apiRequestNoAuth("POST", "/api/trade-chat", {
            body: { message: "test" },
        }).then((res) => {
            expect(res.status).to.eq(401);
        });
    });
});
