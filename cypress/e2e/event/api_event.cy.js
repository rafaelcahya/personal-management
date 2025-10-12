import { randomString } from "../../support/common/helper";

describe("Event API", () => {
    it("should successfully add new event", () => {
        const date = new Date().toISOString().replace("Z", "+00:00");
        const text = randomString(4, "text").toUpperCase();
        const uuid = crypto.randomUUID();

        cy.request({
            method: "POST",
            url: "/api/event/create",
            body: {
                event_date: date,
                event_description: text,
                impact_direction: text,
                uuid: uuid,
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property("success", true);

            const apiEvent = response.body.event;

            cy.request({
                method: "GET",
                url: `/api/event/list/${apiEvent.id}`,
                failOnStatusCode: false,
            }).then(() => {
                cy.task("getEventFromDbTask", apiEvent.id).then((dbEvent) => {
                    expect(apiEvent.event_date).to.eq(dbEvent.eventDate);
                    expect(apiEvent.event_description).to.eq(
                        dbEvent.eventDescription
                    );
                    expect(apiEvent.impact_direction).to.eq(
                        dbEvent.impactDirection
                    );
                });
            });
            cy.task("saveEventId", apiEvent.id);
        });
    });

    it("should ensure deleted_at is null after successfully adding a new event", () => {
        const date = new Date().toISOString().replace("Z", "+00:00");
        const text = randomString(4, "text").toUpperCase();
        const uuid = crypto.randomUUID();

        cy.request({
            method: "POST",
            url: "/api/event/create",
            body: {
                event_date: date,
                event_description: text,
                impact_direction: text,
                uuid: uuid,
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property("success", true);

            const apiEvent = response.body.event;

            cy.task("getEventFromDbTask", apiEvent.id).then((dbEvent) => {
                expect(apiEvent.deleted_at).to.eq(dbEvent.deletedAt);
                expect(apiEvent.deleted_at).to.be.null;
            });
        });
    });

    it("should successfully update event", () => {
        const date = new Date().toISOString().replace("Z", "+00:00");
        const text = randomString(4, "text").toUpperCase();
        const uuid = crypto.randomUUID();

        cy.task("getRandomEventId").then((randomId) => {
            cy.request({
                method: "PUT",
                url: `/api/event/update/${randomId}`,
                body: {
                    event_date: date,
                    event_description: text,
                    impact_direction: text,
                    uuid: uuid,
                },
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property("success", true);

                const apiEvent = response.body.event;

                cy.request({
                    method: "GET",
                    url: `/api/event/list/${randomId}`,
                    failOnStatusCode: false,
                }).then(() => {
                    cy.task("getEventFromDbTask", apiEvent.id).then(
                        (dbEvent) => {
                            expect(apiEvent.event_date).to.eq(
                                dbEvent.eventDate
                            );
                            expect(apiEvent.event_description).to.eq(
                                dbEvent.eventDescription
                            );
                            expect(apiEvent.impact_direction).to.eq(
                                dbEvent.impactDirection
                            );
                        }
                    );
                });
            });
        });
    });

    it("should ensure deleted_at is null after successfully updating a event", () => {
        const date = new Date().toISOString().replace("Z", "+00:00");
        const text = randomString(4, "text").toUpperCase();
        const uuid = crypto.randomUUID();

        cy.task("getRandomEventId").then((randomId) => {
            cy.request({
                method: "PUT",
                url: `/api/event/update/${randomId}`,
                body: {
                    event_date: date,
                    event_description: text,
                    impact_direction: text,
                    uuid: uuid,
                },
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(200);

                const apiEvent = response.body.event;

                cy.task("getEventFromDbTask", apiEvent.id).then((dbEvent) => {
                    expect(apiEvent.deleted_at).to.eq(dbEvent.deletedAt);
                    expect(apiEvent.deleted_at).to.be.null;
                });
            });
        });
    });

    it("should successfully delete event", () => {
        cy.task("getRandomEventId").then((randomId) => {
            cy.request({
                method: "DELETE",
                url: `/api/event/delete/${randomId}`,
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property("success", true);

                cy.task("getEventFromDbTask", randomId).then((dbEvent) => {
                    expect(dbEvent).to.be.null;
                });
            });
        });
    });
});
