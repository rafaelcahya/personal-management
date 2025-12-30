import { randomString } from "../../support/common/helper";

describe("Event API", () => {
    before(() => {
        cy.task("clearFixtureFile", "eventIds.json");
    });

    describe("Create", () => {
        it("should successfully add new event", () => {
            const testData = {
                date: new Date().toISOString().replace("Z", "+00:00"),
                text: randomString(4, "text").toUpperCase(),
            };

            const request = {
                event_description: testData.text,
                impact_direction: testData.text,
                event_date: testData.date,
            };

            cy.AddNewEvent(request).then((response) => {
                expect(response.status).to.eq(200);

                cy.wrap(response.body.event).as("apiEvent");
                cy.wrap(response.body.event.id).as("eventId");

                cy.get("@eventId").then((id) => {
                    cy.task("getEventFromDbTask", id).then((dbEvent) => {
                        cy.get("@apiEvent").then((apiEvent) => {
                            expect(apiEvent.event_description).to.eq(
                                dbEvent.eventDescription
                            );
                            expect(apiEvent.impact_direction).to.eq(
                                dbEvent.impactDirection
                            );
                            expect(apiEvent.event_date).to.eq(
                                dbEvent.eventDate
                            );
                        });
                    });
                });
                cy.task("saveEventId", response.body.event.id);
            });
        });

        it("should ensure deleted_at is null after successfully adding a new event", () => {
            const request = {
                event_description: "",
                impact_direction: "",
                event_date: "",
            };

            cy.AddNewEvent(request).then((response) => {
                expect(response.status).to.eq(400);

                cy.wrap(response.body.event).as("apiEvent");

                const requiredErrors = [
                    "event description is required",
                    "impact direction is required",
                    "event date is required",
                ];

                requiredErrors.forEach((error) => {
                    expect(response.body.error).to.include(error);
                });
            });
        });

        it("should fail to add new event with invalid JSON", () => {
            cy.AddNewEvent().then((response) => {
                expect(response.status).to.eq(400);

                cy.wrap(response.body.event).as("apiEvent");

                expect(response.body.error).to.include(
                    "Invalid JSON in request body"
                );
            });
        });

        it("should ensure deleted_at is null after successfully adding a new event", () => {
            const testData = {
                date: new Date().toISOString().replace("Z", "+00:00"),
                text: randomString(10, "text").toUpperCase(),
                number: randomString(5, "number"),
            };

            const request = {
                event_description: testData.text,
                impact_direction: testData.text,
                event_date: testData.date,
            };

            cy.AddNewEvent(request).then((response) => {
                expect(response.status).to.eq(200);

                cy.wrap(response.body.event.id).as("eventId");

                cy.get("@eventId").then((id) => {
                    cy.task("getEventFromDbTask", id).then((dbEvent) => {
                        expect(response.body.event.deleted_at).to.eq(
                            dbEvent.deletedAt
                        );
                        expect(response.body.event.deleted_at).to.be.null;
                    });
                });

                cy.task("saveEventId", response.body.event.id);
            });
        });
    });

    describe("Update", () => {
        it("should successfully update event", () => {
            const testData = {
                date: new Date().toISOString().replace("Z", "+00:00"),
                text: randomString(10, "text").toUpperCase(),
                number: randomString(5, "number"),
            };

            const request = {
                event_description: testData.text,
                impact_direction: testData.text,
                event_date: testData.date,
            };

            cy.task("getRandomEventId")
                .then((id) => cy.UpdateEvent(id, request))
                .then((response) => {
                    expect(response.status).to.eq(200);

                    const apiEvent = response.body.event;
                    cy.wrap(apiEvent).as("apiEvent");
                    cy.wrap(apiEvent.id).as("eventId");
                })
                .then(() => {
                    cy.get("@eventId").then((eventId) => {
                        return cy.task("getEventFromDbTask", eventId);
                    });
                })
                .then((dbEvent) => {
                    cy.get("@apiEvent").then((apiEvent) => {
                        expect(apiEvent.event_description).to.eq(
                            dbEvent.eventDescription
                        );
                        expect(apiEvent.impact_direction).to.eq(
                            dbEvent.impactDirection
                        );
                        expect(apiEvent.event_date).to.eq(dbEvent.eventDate);
                    });
                });
        });

        it("should fail to update event with missing required fields", () => {
            const request = {
                event_description: "",
                impact_direction: "",
                event_date: "",
            };

            cy.task("getRandomEventId").then((randomId) => {
                cy.UpdateEvent(randomId, request).then((response) => {
                    expect(response.status).to.eq(400);

                    cy.wrap(response.body.event).as("apiEvent");

                    const requiredErrors = [
                        "event description is required",
                        "impact direction is required",
                        "event date is required",
                    ];

                    requiredErrors.forEach((error) => {
                        expect(response.body.error).to.include(error);
                    });
                });
            });
        });

        it("should fail to update event with invalid JSON", () => {
            cy.task("getRandomEventId")
                .then((id) => cy.UpdateEvent(id))
                .then((response) => {
                    expect(response.status).to.eq(400);
                    cy.wrap(response.body.event).as("apiEvent");

                    expect(response.body.error).to.include(
                        "Invalid JSON in request body"
                    );
                });
        });

        it("should fail to update event with invalid Id", () => {
            cy.UpdateEvent("qwe123").then((response) => {
                expect(response.status).to.eq(400);

                cy.wrap(response.body.event).as("apiEvent");

                expect(response.body.error).to.include(
                    "Invalid event ID provided"
                );
            });
        });

        it("should ensure deleted_at is null after successfully updating a event", () => {
            const testData = {
                date: new Date().toISOString().replace("Z", "+00:00"),
                text: randomString(10, "text").toUpperCase(),
                number: randomString(5, "number"),
            };

            const request = {
                event_description: testData.text,
                impact_direction: testData.text,
                event_date: testData.date,
            };

            let apiEvent;

            cy.task("getRandomEventId")
                .then((id) => cy.UpdateEvent(id, request))
                .then((response) => {
                    expect(response.status).to.eq(200);
                    apiEvent = response.body.event;
                    return cy.task("getEventFromDbTask", apiEvent.id)
                })
                .then((dbEvent) => {
                    expect(apiEvent.deleted_at).to.eq(dbEvent.deletedAt);
                    expect(apiEvent.deleted_at).to.be.null;
                });
        });

        it("should fail to update event with invalid ID", () => {
            const text = randomString(4, "text").toUpperCase();
            const invalidId = text;

            cy.UpdateEvent(invalidId).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body).to.have.property(
                    "error",
                    "Invalid event ID provided"
                );
            });
        });

        it("should fail to update event with invalid JSON", () => {
            cy.task("getRandomEventId").then((randomId) => {
                cy.UpdateEvent(randomId).then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body.error).to.include(
                        "Invalid JSON in request body"
                    );
                });
            });
        });
    });

    describe("Delete", () => {
        it("should successfully delete event", () => {
            const testData = {
                date: new Date().toISOString().replace("Z", "+00:00"),
                text: randomString(10, "text").toUpperCase(),
                number: randomString(5, "number"),
            };

            const request = {
                event_description: testData.text,
                impact_direction: testData.text,
                event_date: testData.date,
            };

            cy.AddNewEvent(request)
                .then((response) => {
                    cy.wrap(response.body.event.id).as("eventIdToDelete");
                })
                .then(() => {
                    cy.get("@eventIdToDelete").then((id) => {
                        cy.DeleteEvent(id).then((deleteResponse) => {
                            expect(deleteResponse.status).to.eq(200);
                            cy.task("getEventFromDbTask", id).then(
                                (dbEvent) => {
                                    expect(dbEvent).to.be.null;
                                }
                            );
                        });
                    });
                });
        });

        it("should fail with invalid ID", () => {
            cy.DeleteEvent("abc").then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.error).to.eq("Invalid event ID provided");
            });
        });
    });
});
