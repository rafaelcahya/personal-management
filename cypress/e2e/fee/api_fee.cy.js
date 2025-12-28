import { randomString } from "../../support/common/helper";

describe("Fee API", () => {
    before(() => {
        cy.task("clearFixtureFile", "feeIds.json");
    });

    it("should successfully add new fee", () => {
        const date = new Date().toISOString().replace("Z", "+00:00");
        const text = randomString(10, "text").toUpperCase();
        const number = randomString(5, "number");
        const uuid = crypto.randomUUID();

        cy.request({
            method: "POST",
            url: "/api/fee/create",
            body: {
                fee_name: text,
                fee_date: date,
                fee: number,
                uuid: uuid,
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property("success", true);

            const apiFee = response.body.fee;

            cy.request({
                method: "GET",
                url: `/api/fee/list/${apiFee.id}`,
                failOnStatusCode: false,
            }).then(() => {
                cy.task("getFeeFromDbTask", apiFee.id).then((dbFee) => {
                    expect(apiFee.fee_name).to.eq(dbFee.feeName);
                    expect(apiFee.fee).to.eq(dbFee.fee);
                    expect(apiFee.fee_date).to.eq(dbFee.feeDate);
                });
                cy.task("saveFeeId", apiFee.id);
            });
        });
    });

    it("should ensure deleted_at is null after successfully adding a new fee", () => {
        const date = new Date().toISOString().replace("Z", "+00:00");
        const text = randomString(10, "text").toUpperCase();
        const number = randomString(5, "number");
        const uuid = crypto.randomUUID();

        cy.request({
            method: "POST",
            url: "/api/fee/create",
            body: {
                fee_name: text,
                fee_date: date,
                fee: number,
                uuid: uuid,
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property("success", true);

            const apiFee = response.body.fee;

            cy.task("getFeeFromDbTask", apiFee.id).then((dbFee) => {
                expect(apiFee.deleted_at).to.eq(dbFee.deletedAt);
                expect(apiFee.deleted_at).to.be.null;
            });
        });
    });

    it("should successfully update fee", () => {
        const date = new Date().toISOString().replace("Z", "+00:00");
        const text = randomString(10, "text").toUpperCase();
        const number = randomString(5, "number");
        const uuid = crypto.randomUUID();

        cy.task("getRandomFeeId").then((randomId) => {
            cy.request({
                method: "PUT",
                url: `/api/fee/update/${randomId}`,
                body: {
                    fee_name: text,
                    fee_date: date,
                    fee: number,
                    uuid: uuid,
                },
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property("success", true);

                const apiFee = response.body.fee;

                cy.request({
                    method: "GET",
                    url: `/api/fee/update/${randomId}`,
                    failOnStatusCode: false,
                }).then(() => {
                    cy.task("getFeeFromDbTask", apiFee.id).then((dbFee) => {
                        expect(apiFee.fee_name).to.eq(dbFee.feeName);
                        expect(apiFee.fee).to.eq(dbFee.fee);
                        expect(apiFee.fee_date).to.eq(dbFee.feeDate);
                    });
                });
            });
        });
    });

    it("should ensure deleted_at is null after successfully updating a fee", () => {
        const date = new Date().toISOString().replace("Z", "+00:00");
        const text = randomString(4, "text").toUpperCase();
        const number = randomString(5, "number");
        const uuid = crypto.randomUUID();

        cy.task("getRandomFeeId").then((randomId) => {
            cy.request({
                method: "PUT",
                url: `/api/fee/update/${randomId}`,
                body: {
                    fee_name: text,
                    fee_date: date,
                    fee: number,
                    uuid: uuid,
                },
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(200);

                const apiFee = response.body.fee;

                cy.task("getFeeFromDbTask", apiFee.id).then((dbFee) => {
                    expect(apiFee.deleted_at).to.eq(dbFee.deletedAt);
                    expect(apiFee.deleted_at).to.be.null;
                });
            });
        });
    });

    it("should successfully delete fee", () => {
        cy.task("getRandomFeeId").then((randomId) => {
            cy.request({
                method: "DELETE",
                url: `/api/fee/delete/${randomId}`,
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property("success", true);

                cy.task("getFeeFromDbTask", randomId).then((dbFee) => {
                    expect(dbFee).to.be.null;
                });
            });
        });
    });
});
