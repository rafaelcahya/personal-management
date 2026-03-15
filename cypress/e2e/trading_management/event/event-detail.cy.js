import { faker } from "@faker-js/faker";

describe("Event Detail API", () => {
    let testEventId;
    let testUserId;
    let request;
    let responseEvent;

    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.setupApiAuthCookies();

        request = {
            event_date: faker.date.recent(),
            impact_direction: faker.animal.snake(),
            event_description: faker.word.words(25),
        };

        cy.AddEvent(request).then((response) => {
            expect(response.body.success).to.be.true;
            expect(response.body.event).to.exist;
            expect(response.status).to.eq(201);

            testUserId = response.body.event.user_id;
            testEventId = response.body.event.id;
            responseEvent = response.body.event;
        });
    });

    describe("Authentication & Authorization", () => {
        it("should return 401 for unauthenticated requests", () => {
            cy.clearCookies();

            cy.GetEventDetailNoAuth(testEventId).then((response) => {
                expect(response.status).to.be.oneOf([307, 401]);

                if (response.status === 401) {
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.eq("Unauthorized");
                }

                const location = response.headers.location || response.body;
                expect(String(location)).to.include("/login");
            });
        });

        it("should return 200 for authenticated user", () => {
            cy.GetEventDetail(testEventId).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.success).to.be.true;
                expect(response.body.event).to.exist;
                expect(response.body.event.id).to.eq(testEventId);
            });
        });
    });

    describe("Parameter Validation", () => {
        it("should return 400 for invalid event ID (non-numeric)", () => {
            cy.GetEventDetail("invalid-id").then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.include("Event ID");
            });
        });

        it("should return 400 for empty event ID", () => {
            cy.GetEventDetail().then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.eq(
                    "Event ID must be a valid number",
                );
            });
        });

        it("should return 400 for non-integer Event ID", () => {
            cy.GetEventDetail("123.45").then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.eq(
                    "Event ID must be an integer",
                );
            });
        });
    });

    describe("Valid Event Retrieval", () => {
        it("should return correct event data", () => {
            let apiEvent;

            cy.GetEventDetail(testEventId).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.success).to.be.true;
                expect(response.body.event).to.exist;

                apiEvent = response.body.event;

                expect(apiEvent.id).to.eq(testEventId);
                expect(apiEvent.event_description).to.eq(
                    responseEvent.event_description,
                );
                expect(apiEvent.event_date).to.eq(responseEvent.event_date);
                expect(apiEvent.impact_direction).to.eq(
                    responseEvent.impact_direction,
                );
            });
        });

        it("should return all event fields", () => {
            cy.GetEventDetail(testEventId).then((response) => {
                const event = response.body.event;
                expect(event).to.have.property("id");
                expect(event).to.have.property("event_description");
                expect(event).to.have.property("event_date");
                expect(event).to.have.property("impact_direction");
            });
        });

        it("should return correct response structure", () => {
            cy.GetEventDetail(testEventId).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.all.keys("success", "event");
                expect(response.body.success).to.be.true;
                expect(response.body.event).to.be.an("object");
                expect(response.body.event.id).to.be.a("number");
            });
        });

        it("should return JSON content-type", () => {
            cy.GetEventDetail(testEventId).then((response) => {
                expect(response.headers["content-type"]).to.include(
                    "application/json",
                );
            });
        });
    });

    describe("Event Not Found", () => {
        it("should return 404 for non-existent event ID", () => {
            const fakeId = 999999999;

            cy.GetEventDetail(fakeId).then((response) => {
                expect(response.status).to.eq(404);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.eq("Event not found");
                expect(response.body.event).to.not.exist;
            });
        });

        it("should return 404 for event owned by other user", () => {
            const otherUserEventId = 72;

            cy.GetEventDetail(otherUserEventId).then((response) => {
                expect(response.status).to.eq(404);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.eq("Event not found");
            });
        });
    });

    describe("Data Integrity", () => {
        it("should match database data exactly", () => {
            let apiEvent, dbEvent;

            cy.GetEventDetail(testEventId).then((response) => {
                apiEvent = response.body.event;
            });

            cy.getSingleEventFromDb(testEventId.toString()).then((event) => {
                dbEvent = event[0];
            });

            cy.then(() => {
                expect(apiEvent.id).to.eq(dbEvent.id);
                expect(apiEvent.event_description).to.eq(
                    dbEvent.event_description,
                );
                expect(apiEvent.event_date).to.eq(dbEvent.event_date);
                expect(apiEvent.impact_direction).to.eq(
                    dbEvent.impact_direction,
                );
                expect(apiEvent.user_id).to.eq(dbEvent.user_id);
                expect(apiEvent.created_at).to.eq(dbEvent.created_at);
            });
        });
    });

    describe("Performance", () => {
        it("should respond within 1 second", () => {
            const startTime = Date.now();

            cy.GetEventDetail(testEventId).then((response) => {
                const duration = Date.now() - startTime;

                expect(response.status).to.eq(200);
                expect(duration).to.be.lessThan(1000);

                cy.log(`⏱️ Response time: ${duration}ms`);
            });
        });

        it("should handle concurrent requests", () => {
            const requests = Array.from({ length: 5 }, () =>
                cy.GetEventDetail(testEventId),
            );

            requests.forEach((request) => {
                request.then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body.event.id).to.eq(testEventId);
                });
            });
        });
    });

    describe("Caching & Consistency", () => {
        it("should return consistent data across multiple requests", () => {
            const eventIds = Array.from({ length: 3 }, () =>
                cy.GetEventDetail(testEventId),
            );

            let firstEvent;

            eventIds.forEach((request, index) => {
                request.then((response) => {
                    const event = response.body.event;

                    if (index === 0) {
                        firstEvent = event;
                    } else {
                        expect(event.id).to.eq(firstEvent.id);
                        expect(event.event_description).to.eq(
                            firstEvent.event_description,
                        );
                        expect(event.event_date).to.eq(firstEvent.event_date);
                        expect(event.impact_direction).to.eq(
                            firstEvent.impact_direction,
                        );
                    }
                });
            });
        });
    });
});
