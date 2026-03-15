import { faker } from "@faker-js/faker";

describe("Event Update API", () => {
    let testEventId;
    let testUserId;

    before(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.setupApiAuthCookies();

        const request = {
            event_date: faker.date.recent(),
            impact_direction: faker.animal.snake(),
            event_description: faker.word.words(25),
        };

        cy.AddEvent(request).then((response) => {
            expect(response.status).to.eq(201);
            testEventId = response.body.event.id;
            testUserId = response.body.event.user_id;

            cy.log(`✅ Created test event ID: ${testEventId}`);
        });
    });

    beforeEach(() => {
        cy.setupApiAuthCookies();
    });

    describe("Authentication & Authorization", () => {
        it("should update event successfully (200)", () => {
            const request = {
                event_date: faker.date.recent().toISOString().split("T")[0],
                impact_direction: faker.animal.snake(),
                event_description: faker.word.words(25),
            };

            cy.UpdateEvent(testEventId, request).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.success).to.be.true;
                expect(response.body.event).to.exist;
            });
        });

        it("should return 401 without authentication", () => {
            cy.clearCookies();

            const updateData = { notes: "unauth test" };
            cy.UpdateEventNoAuth(testEventId, updateData).then((response) => {
                expect(response.status).to.be.oneOf([307, 401]);

                if (response.status === 401) {
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.eq("Unauthorized");
                }

                const location = response.headers.location || response.body;
                expect(String(location)).to.include("/login");
            });
        });
    });

    describe("Event Object Structure Scenarios", () => {
        it("should update event with all required fields", () => {
            const request = {
                event_date: faker.date.recent(),
                impact_direction: faker.animal.snake(),
                event_description: faker.word.words(25),
            };

            cy.UpdateEvent(testEventId, request).then((response) => {
                const event = response.body.event;
                expect(event).to.have.property("id");
                expect(event).to.have.property("event_date");
                expect(event).to.have.property("impact_direction");
                expect(event).to.have.property("event_description");
                expect(event).to.have.property("user_id");
                expect(event).to.have.property("created_at");
                expect(event).to.have.property("updated_at");
                expect(event).to.have.property("deleted_at");
            });
        });

        it("should return complete updated event object", () => {
            const request = {
                event_date: faker.date.recent(),
                impact_direction: faker.animal.snake(),
                event_description: faker.word.words(25),
            };

            cy.UpdateEvent(testEventId, request).then((response) => {
                const event = response.body.event;
                expect(event).to.have.all.keys([
                    "created_at",
                    "deleted_at",
                    "event_date",
                    "event_description",
                    "id",
                    "impact_direction",
                    "updated_at",
                    "user_id",
                    "is_favorite",
                ]);
            });
        });

        it("should return correct success response structure", () => {
            const request = {
                event_date: faker.date.recent(),
                impact_direction: faker.animal.snake(),
                event_description: faker.word.words(25),
            };

            cy.UpdateEvent(testEventId, request).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.all.keys("success", "event");
                expect(response.body.success).to.be.true;
                expect(response.body.event).to.be.an("object");
            });
        });

        it("should return correct error response structure", () => {
            cy.UpdateEvent().then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body).to.have.all.keys("success", "error");
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.exist;
            });
        });
    });

    describe("Success Scenario", () => {
        it("should update event successfully (200)", () => {
            const today = new Date().toISOString().split("T")[0];

            const request = {
                event_date: today,
                impact_direction: faker.animal.snake(),
                event_description: faker.word.words(25),
            };

            cy.UpdateEvent(testEventId, request).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.success).to.be.true;

                const exactFields = [
                    "event_date",
                    "impact_direction",
                    "event_description",
                ];

                exactFields.forEach((field) => {
                    if (field === "event_date") {
                        expect(response.body.event[field]).to.include(
                            request[field],
                        );
                    } else {
                        expect(response.body.event[field]).to.eq(
                            request[field],
                        );
                    }
                });

                cy.log("✅ All fields updated:", JSON.stringify(request));
            });
        });

        it("should assign user_id from authenticated user", () => {
            const request = {
                event_date: faker.date.recent(),
                impact_direction: faker.animal.snake(),
                event_description: faker.word.words(25),
            };

            cy.UpdateEvent(testEventId, request).then((response) => {
                expect(response.status).to.eq(200);

                const event = response.body.event;
                expect(event.user_id).to.exist;
                expect(event.user_id).to.be.a("string");
                expect(event.user_id.length).to.be.greaterThan(0);

                cy.log(`✅ User ID assigned: ${event.user_id}`);
            });
        });

        it("should generate timestamps (created_at, updated_at)", () => {
            const request = {
                event_date: faker.date.recent(),
                impact_direction: faker.animal.snake(),
                event_description: faker.word.words(25),
            };

            cy.UpdateEvent(testEventId, request).then((response) => {
                expect(response.status).to.eq(200);

                const event = response.body.event;
                expect(event.created_at).to.exist;
                expect(event.updated_at).to.exist;

                expect(new Date(event.created_at).toString()).to.not.eq(
                    "Invalid Date",
                );

                cy.log("✅ Timestamps generated correctly");
            });
        });
    });

    describe("Data Integrity - API vs Database Comparison", () => {
        beforeEach(function () {
            const request = {
                event_date: faker.date.recent().toISOString().split("T")[0],
                impact_direction: faker.animal.snake(),
                event_description: faker.word.words(25),
            };

            cy.UpdateEvent(testEventId, request).then((response) => {
                expect(response.status).to.eq(200);
                cy.wrap(response.body.event).as("eventData");
            });
        });

        describe("Complete Field Comparison", () => {
            it("should match all fields between API and DB", function () {
                const eventId = this.eventData.id;

                cy.GetSingleEvent(eventId).then((response) => {
                    expect(response.status).to.eq(200);
                    const apiEvent = response.body.event;
                    cy.log("API event:", JSON.stringify(apiEvent));

                    cy.getSingleEventFromDb(eventId).then((rows) => {
                        const dbEvent = rows[0];
                        cy.log("DB event:", JSON.stringify(dbEvent));

                        expect(apiEvent.id, "ID").to.eq(dbEvent.id);
                        expect(apiEvent.event_date, "Event Date").to.eq(
                            dbEvent.event_date,
                        );
                        expect(
                            apiEvent.impact_direction,
                            "Impact Direction",
                        ).to.eq(dbEvent.impact_direction);
                        expect(apiEvent.user_id, "User ID").to.eq(
                            dbEvent.user_id,
                        );
                        expect(
                            apiEvent.event_description,
                            "Event Description",
                        ).to.eq(dbEvent.event_description);
                        expect(apiEvent.created_at, "Created At").to.eq(
                            dbEvent.created_at,
                        );
                        expect(apiEvent.updated_at, "Updated At").to.eq(
                            dbEvent.updated_at,
                        );
                        expect(apiEvent.deleted_at, "Deleted At").to.eq(
                            dbEvent.deleted_at,
                        );

                        cy.log("✅ All fields match between API and DB");
                    });
                });
            });

            it("should have identical field count", function () {
                const eventId = this.eventData.id;

                cy.GetSingleEvent(eventId).then((response) => {
                    const apiEvent = response.body.event;

                    cy.getSingleEventFromDb(eventId).then((rows) => {
                        const dbEvent = rows[0];

                        const apiFieldCount = Object.keys(apiEvent).length;
                        const dbFieldCount = Object.keys(dbEvent).length;

                        expect(apiFieldCount, "Field Count").to.eq(
                            dbFieldCount,
                        );
                        cy.log(`✅ Both have ${apiFieldCount} fields`);
                    });
                });
            });

            it("should have valid ISO timestamp formats", function () {
                const eventId = this.eventData.id;

                cy.GetSingleEvent(eventId).then((response) => {
                    const apiEvent = response.body.event;

                    cy.getSingleEventFromDb(eventId).then((rows) => {
                        const dbEvent = rows[0];

                        expect(
                            new Date(apiEvent.created_at).toString(),
                        ).to.not.eq("Invalid Date");
                        expect(
                            new Date(dbEvent.created_at).toString(),
                        ).to.not.eq("Invalid Date");
                        expect(apiEvent.created_at).to.eq(dbEvent.created_at);

                        cy.log("✅ Timestamp formats valid and match");
                    });
                });
            });
        });
    });

    describe("Event Update - Summary Impact Tests", () => {
        describe("Total Bearish Impact", () => {
            it("should increment totalBearish when event updated to DOWN", function () {
                cy.AddEvent({
                    event_date: faker.date.recent().toISOString().split("T")[0],
                    impact_direction: "UP",
                    event_description: faker.word.words(5),
                }).then((response) => {
                    expect(response.status).to.eq(201);
                    cy.wrap(response.body.event).as("eventData");
                });

                cy.GetEventSummary().then((response) => {
                    expect(response.status).to.eq(200);
                    cy.wrap(response.body.event.totalBearish).as(
                        "initialBearish",
                    );
                    cy.log(
                        `📊 Initial totalBearish: ${response.body.event.totalBearish}`,
                    );
                });

                cy.get("@eventData").then((eventData) => {
                    cy.UpdateEvent(eventData.id, {
                        event_date: faker.date
                            .recent()
                            .toISOString()
                            .split("T")[0],
                        impact_direction: "DOWN",
                        event_description: faker.word.words(5),
                    }).then((response) => {
                        expect(response.status).to.eq(200);
                        expect(response.body.event.impact_direction).to.eq(
                            "DOWN",
                        );
                    });
                });

                cy.GetEventSummary().then(function (response) {
                    expect(response.status).to.eq(200);
                    const newBearish = response.body.event.totalBearish;
                    expect(newBearish).to.eq(this.initialBearish + 1);
                    cy.log(
                        `✅ totalBearish: ${this.initialBearish} → ${newBearish}`,
                    );
                });
            });
        });

        describe("Total Bullish Impact", () => {
            it("should increment totalBullish when event updated to UP", function () {
                cy.AddEvent({
                    event_date: faker.date.recent().toISOString().split("T")[0],
                    impact_direction: "DOWN",
                    event_description: faker.word.words(5),
                }).then((response) => {
                    expect(response.status).to.eq(201);
                    cy.wrap(response.body.event).as("eventData");
                });

                cy.GetEventSummary().then((response) => {
                    expect(response.status).to.eq(200);
                    cy.wrap(response.body.event.totalBullish).as(
                        "initialBullish",
                    );
                    cy.log(
                        `📊 Initial totalBullish: ${response.body.event.totalBullish}`,
                    );
                });

                cy.get("@eventData").then((eventData) => {
                    cy.UpdateEvent(eventData.id, {
                        event_date: faker.date
                            .recent()
                            .toISOString()
                            .split("T")[0],
                        impact_direction: "UP",
                        event_description: faker.word.words(5),
                    }).then((response) => {
                        expect(response.status).to.eq(200);
                        expect(response.body.event.impact_direction).to.eq(
                            "UP",
                        );
                    });
                });

                cy.GetEventSummary().then(function (response) {
                    expect(response.status).to.eq(200);
                    const newBullish = response.body.event.totalBullish;
                    expect(newBullish).to.eq(this.initialBullish + 1);
                    cy.log(
                        `✅ totalBullish: ${this.initialBullish} → ${newBullish}`,
                    );
                });
            });
        });

        describe("Total Favorite Impact", () => {
            it("should increment totalFavorite when event marked as favorite", function () {
                cy.AddEvent({
                    event_date: faker.date.recent().toISOString().split("T")[0],
                    impact_direction: faker.animal.snake(),
                    event_description: faker.word.words(5),
                }).then((response) => {
                    expect(response.status).to.eq(201);
                    cy.wrap(response.body.event).as("eventData");
                });

                cy.GetEventSummary().then((response) => {
                    expect(response.status).to.eq(200);
                    cy.wrap(response.body.event.totalFavorite).as(
                        "initialFavorite",
                    );
                    cy.log(
                        `📊 Initial totalFavorite: ${response.body.event.totalFavorite}`,
                    );
                });

                cy.get("@eventData").then((eventData) => {
                    cy.FavoriteEvent(eventData.id, { is_favorite: true }).then(
                        (response) => {
                            expect(response.status).to.eq(200);
                        },
                    );
                });

                cy.GetEventSummary().then(function (response) {
                    expect(response.status).to.eq(200);
                    const newFavorite = response.body.event.totalFavorite;
                    expect(newFavorite).to.eq(this.initialFavorite + 1);
                    cy.log(
                        `✅ totalFavorite: ${this.initialFavorite} → ${newFavorite}`,
                    );
                });
            });
        });
    });

    describe("Request Body Validation", () => {
        it("should return 400 when body is missing", () => {
            cy.UpdateEvent(testEventId).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.eq(
                    "Invalid JSON in request body",
                );
            });
        });

        it("should return 400 for invalid JSON", () => {
            const request = "NULL";

            cy.UpdateEvent(testEventId, request).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.eq(
                    "Invalid JSON in request body",
                );
            });
        });

        it("should return 400 for invalid event ID format", () => {
            cy.UpdateEvent("abc", {}).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
            });
        });

        it("should return 400 for empty body object", () => {
            const request = {};
            cy.UpdateEvent(testEventId, request).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.be.an("array");
            });
        });
    });

    describe("Update Event Performance", () => {
        it("should update within 2s", () => {
            const start = Date.now();
            cy.UpdateEvent(testEventId, { notes: "perf test" }).then(
                (response) => {
                    const duration = Date.now() - start;
                    expect(duration).to.be.lte(2000);
                    cy.log(`Update time: ${duration}ms`);
                },
            );
        });
    });
});
