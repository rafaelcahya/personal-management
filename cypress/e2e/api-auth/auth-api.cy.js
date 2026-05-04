/**
 * API Auth Guard Tests — Auth & User & Chat Module
 * Memastikan semua endpoint menolak akses tanpa session (401)
 */

import { AUTH_ENDPOINTS, USER_ENDPOINTS, CHAT_ENDPOINTS } from "../../fixtures/api-endpoints.js";

describe("API Auth Guard — Auth Module", () => {
    it(`POST ${AUTH_ENDPOINTS.LOGOUT} — should return 401 when unauthenticated`, () => {
        cy.apiRequestNoAuth("POST", AUTH_ENDPOINTS.LOGOUT).then((res) => {
            expect(res.status).to.eq(401);
        });
    });
});

describe("API Auth Guard — User Module", () => {
    it(`GET ${USER_ENDPOINTS.USER} — should return 401 when unauthenticated`, () => {
        cy.apiRequestNoAuth("GET", USER_ENDPOINTS.USER).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it(`PUT ${USER_ENDPOINTS.USER} — should return 401 when unauthenticated`, () => {
        cy.apiRequestNoAuth("PUT", USER_ENDPOINTS.USER, {
            body: { username: "test" },
        }).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it(`POST ${USER_ENDPOINTS.AVATAR} — should return 401 when unauthenticated`, () => {
        cy.apiRequestNoAuth("POST", USER_ENDPOINTS.AVATAR).then((res) => {
            expect(res.status).to.eq(401);
        });
    });
});

describe("API Auth Guard — Chat Module", () => {
    it(`POST ${CHAT_ENDPOINTS.CHAT} — should return 401 when unauthenticated`, () => {
        cy.apiRequestNoAuth("POST", CHAT_ENDPOINTS.CHAT, {
            body: { message: "test" },
        }).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it(`POST ${CHAT_ENDPOINTS.TRADE_CHAT} — should return 401 when unauthenticated`, () => {
        cy.apiRequestNoAuth("POST", CHAT_ENDPOINTS.TRADE_CHAT, {
            body: { message: "test" },
        }).then((res) => {
            expect(res.status).to.eq(401);
        });
    });
});
