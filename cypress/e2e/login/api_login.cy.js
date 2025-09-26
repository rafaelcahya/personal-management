import { randomString } from "../../support/common/helper";

let userData;

describe("Auth API - Login", () => {
    beforeEach(() => {
        cy.fixture("user").then((user) => {
            userData = user;
        });
    });

    it("should login successfully with valid credentials", () => {
        cy.request({
            method: "POST",
            url: "/api/auth/login",
            body: {
                username: userData.username,
                password: userData.password,
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property("success", true);
        });
    });

    it("should login successfully and match API response with DB", () => {
        cy.request({
            method: "POST",
            url: "/api/auth/login",
            body: {
                username: userData.username,
                password: userData.password,
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(200);

            const apiUser = response.body.user;

            cy.task("getUserFromDbTask", apiUser.id).then((dbUser) => {
                expect(apiUser.username).to.eq(dbUser.username);
                expect(apiUser.email).to.eq(dbUser.email);
                expect(apiUser.nickname).to.eq(dbUser.nickname);
            });
        });
    });

    it("should not login with invalid credentials and return message in response API", () => {
        cy.request({
            method: "POST",
            url: "/api/auth/login",
            body: {
                username: randomString(),
                password: randomString(),
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(401);
            expect(response.body).to.have.property("error", "User not found");
        });
    });
});
