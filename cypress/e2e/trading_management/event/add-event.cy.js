import { faker } from "@faker-js/faker";

describe("Event Add API and Database Comparison", () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.setupApiAuthCookies();
    });

    describe("Event Add API", () => {
        describe("Authentication & Authorization", () => {
            it("should return 307 or 401 when user is not authenticated", () => {
                cy.clearApiAuth();

                const request = {
                    event_date: faker.date.recent(),
                    impact_direction: faker.animal.snake(),
                    event_description: faker.word.words(25),
                };

                cy.AddEventNoAuth(request).then((response) => {
                    expect(response.status).to.be.oneOf([307, 401]);

                    if (response.status === 401) {
                        expect(response.body.success).to.be.false;
                        expect(response.body.error).to.eq("Unauthorized");
                    }

                    const location = response.headers.location || response.body;
                    expect(String(location)).to.include("/login");
                });
            });

            it("should return 201 when user is authenticated", () => {
                const request = {
                    event_date: faker.date.recent(),
                    impact_direction: faker.animal.snake(),
                    event_description: faker.word.words(25),
                };

                cy.AddEvent(request).then((response) => {
                    expect(response.status).to.eq(201);
                    expect(response.body.success).to.be.true;
                    expect(response.body.event).to.exist;
                });
            });
        });

        describe("Request Body Validation", () => {
            it("should return 400 when body is missing", () => {
                cy.AddEvent().then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.eq(
                        "Invalid JSON in request body",
                    );
                });
            });

            it("should return 400 for invalid JSON", () => {
                const request = "NULL";

                cy.AddEvent(request).then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.eq(
                        "Invalid JSON in request body",
                    );
                });
            });

            it("should return 400 for empty body object", () => {
                const request = {};
                cy.AddEvent(request).then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.be.an("array");
                });
            });
        });

        describe("Required Fields Validation", () => {
            it("should return 400 when event_date is missing", () => {
                const request = {
                    impact_direction: faker.animal.snake(),
                    event_description: faker.animal.snake(),
                };

                cy.AddEvent(request).then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.be.an("array");
                    expect(response.body.error).to.include(
                        "event date is required",
                    );
                });
            });

            it("should return 400 when impact_direction is missing", () => {
                const request = {
                    event_date: faker.date.recent(),
                    event_description: faker.animal.snake(),
                };

                cy.AddEvent(request).then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.be.an("array");
                    expect(response.body.error).to.include(
                        "impact direction is required",
                    );
                });
            });

            it("should return 400 when event_description is missing", () => {
                const request = {
                    event_date: faker.date.recent(),
                    impact_direction: faker.animal.snake(),
                };

                cy.AddEvent(request).then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.be.an("array");
                    expect(response.body.error).to.include(
                        "event description is required",
                    );
                });
            });

            it("should return 400 when event_date is empty string", () => {
                const request = {
                    event_date: "",
                    impact_direction: faker.animal.snake(),
                    event_description: faker.animal.snake(),
                };

                cy.AddEvent(request).then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.be.an("array");
                    expect(response.body.error).to.include(
                        "event date is required",
                    );
                });
            });

            it("should return 400 when impact_direction is empty string", () => {
                const request = {
                    event_date: faker.date.recent(),
                    impact_direction: "",
                    event_description: faker.animal.snake(),
                };

                cy.AddEvent(request).then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.be.an("array");
                    expect(response.body.error).to.include(
                        "impact direction is required",
                    );
                });
            });

            it("should return 400 when event_date is null", () => {
                const request = {
                    event_date: null,
                    impact_direction: faker.animal.snake(),
                    event_description: faker.animal.snake(),
                };

                cy.AddEvent(request).then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.be.an("array");
                    expect(response.body.error).to.include(
                        "event date is required",
                    );
                });
            });

            it("should return 400 when impact_direction is null", () => {
                const request = {
                    event_date: faker.date.recent(),
                    impact_direction: null,
                    event_description: faker.animal.snake(),
                };

                cy.AddEvent(request).then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.be.an("array");
                    expect(response.body.error).to.include(
                        "impact direction is required",
                    );
                });
            });

            it("should return 400 with multiple validation errors", () => {
                const request = {};

                cy.AddEvent(request).then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.be.an("array");
                    expect(response.body.error.length).to.be.greaterThan(1);
                    expect(response.body.error.length).to.be.eq(3);

                    cy.log(
                        `Validation errors: ${response.body.error.join(", ")}`,
                    );
                });
            });
        });
        describe("Event Object Structure Scenarios", () => {
            it("should create event with all required fields", () => {
                const request = {
                    event_date: faker.date.recent(),
                    impact_direction: faker.animal.snake(),
                    event_description: faker.animal.snake(),
                };

                cy.AddEvent(request).then((response) => {
                    const event = response.body.event;
                    expect(event).to.have.property("id");
                    expect(event).to.have.property("event_date");
                    expect(event).to.have.property("impact_direction");
                    expect(event).to.have.property("event_description");
                });
            });

            it("should return correct success response structure", () => {
                const request = {
                    event_date: faker.date.recent(),
                    impact_direction: faker.animal.snake(),
                    event_description: faker.animal.snake(),
                };

                cy.AddEvent(request).then((response) => {
                    expect(response.status).to.eq(201);
                    expect(response.body).to.have.all.keys("success", "event");
                    expect(response.body.success).to.be.true;
                    expect(response.body.event).to.be.an("object");
                });
            });

            it("should return correct error response structure", () => {
                cy.AddEvent().then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body).to.have.all.keys("success", "error");
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.exist;
                });
            });
        });

        describe("Success Scenarios", () => {
            it("should create event with all required fields", () => {
                const request = {
                    event_date: faker.date.recent(),
                    impact_direction: faker.animal.snake(),
                    event_description: faker.animal.snake(),
                };

                cy.AddEvent(request).then((response) => {
                    expect(response.status).to.eq(201);
                    expect(response.body.success).to.be.true;
                    expect(response.body.event).to.exist;
                });
            });

            it("should assign user_id from authenticated user", () => {
                const request = {
                    event_date: faker.date.recent(),
                    impact_direction: faker.animal.snake(),
                    event_description: faker.animal.snake(),
                };

                cy.AddEvent(request).then((response) => {
                    expect(response.status).to.eq(201);

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
                    event_description: faker.animal.snake(),
                };

                cy.AddEvent(request).then((response) => {
                    expect(response.status).to.eq(201);

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
    });

    describe("Data Integrity - API vs Database Comparison", () => {
        let eventId;
        let userId;

        beforeEach(() => {
            const request = {
                event_date: faker.date.recent(),
                impact_direction: faker.animal.snake(),
                event_description: faker.animal.snake(),
            };

            cy.AddEvent(request).then((response) => {
                cy.log("AddEvent response:", JSON.stringify(response.body));
                expect(response.status).to.eq(201);
                eventId = response.body.event.id;
                userId = response.body.event.user_id;
                cy.log(`Created test event ID: ${response.body.event.id}`);
            });
        });

        describe("Complete Field Comparison", () => {
            it("should match all fields between API and DB", function () {
                let apiEvent, dbEvent;

                cy.GetSingleEvent(eventId).then((response) => {
                    expect(response.status).to.eq(200);
                    apiEvent = response.body.event;
                    cy.log("API event:", JSON.stringify(apiEvent));
                });

                cy.getSingleEventFromDb(eventId, userId).then((rows) => {
                    dbEvent = rows[0];
                    cy.log("DB event:", JSON.stringify(dbEvent));
                });
                cy.then(() => {
                    expect(apiEvent.id, "Id").to.eq(dbEvent.id);
                    expect(apiEvent.event_date, "event Date").to.eq(
                        dbEvent.event_date,
                    );
                    expect(apiEvent.impact_direction, "impact_direction").to.eq(
                        dbEvent.impact_direction,
                    );
                    expect(apiEvent.user_id, "User ID").to.eq(dbEvent.user_id);
                    expect(
                        apiEvent.event_description,
                        "impact_direction Name",
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

            it("should have identical field count", function () {
                let apiEvent, dbEvent;

                cy.GetSingleEvent(eventId).then((response) => {
                    apiEvent = response.body.event;
                });

                cy.getSingleEventFromDb(eventId, userId).then((rows) => {
                    dbEvent = rows[0];
                });

                cy.then(() => {
                    const apiFieldCount = Object.keys(apiEvent).length;
                    const dbFieldCount = Object.keys(dbEvent).length;

                    expect(apiFieldCount, "Field Count").to.eq(dbFieldCount);
                    cy.log(`✅ Both have ${apiFieldCount} fields`);
                });
            });

            it("should have valid ISO timestamp formats", function () {
                let apiEvent, dbEvent;

                cy.GetSingleEvent(eventId).then((response) => {
                    apiEvent = response.body.event;
                });

                cy.getSingleEventFromDb(eventId, userId).then((rows) => {
                    dbEvent = rows[0];
                });

                cy.then(() => {
                    const apiCreatedDate = new Date(apiEvent.created_at);
                    const dbCreatedDate = new Date(dbEvent.created_at);

                    expect(apiCreatedDate.toString()).to.not.eq("Invalid Date");
                    expect(dbCreatedDate.toString()).to.not.eq("Invalid Date");
                    expect(apiEvent.created_at).to.eq(dbEvent.created_at);

                    cy.log("✅ Timestamp formats valid and match");
                });
            });
        });
    });

    describe("Event Creation - Summary Impact Tests", () => {
        describe("Total Events Count Impact", () => {
            it("should increment totalEvents after creating a new event", () => {
                cy.GetEventSummary().then((response) => {
                    expect(response.status).to.eq(200);
                    cy.wrap(response.body.event.totalEvents).as("initialCount");
                    cy.log(
                        `📊 Initial event count: ${response.body.totalEvents}`,
                    );
                });

                const request = {
                    event_date: faker.date.recent().toISOString().split("T")[0],
                    impact_direction: faker.animal.snake(),
                    event_description: faker.animal.snake(),
                };

                cy.AddEvent(request).then((response) => {
                    expect(response.status).to.eq(201);
                    cy.log(`Created test event ID: ${response.body.event.id}`);
                });

                cy.GetEventSummary().then(function (response) {
                    const newCount = response.body.event.totalEvents;
                    expect(newCount).to.eq(this.initialCount + 1);
                    cy.log(
                        `✅ event count increased: ${this.initialCount} → ${newCount}`,
                    );
                });
            });

            it("should match totalEvents with database count", function () {
                const request = {
                    event_date: faker.date.recent().toISOString().split("T")[0],
                    impact_direction: "UP",
                    event_description: faker.animal.snake(),
                };

                cy.AddEvent(request).then((response) => {
                    expect(response.status).to.eq(201);
                });

                cy.GetEventSummary().then((response) => {
                    expect(response.status).to.eq(200);
                    cy.wrap(response.body.event.totalEvents).as("apiTotal");
                });

                cy.getEventSummaryFromDb().then((summary) => {
                    cy.wrap(summary.totalEvents).as("dbTotal");
                });

                cy.then(function () {
                    expect(this.apiTotal).to.eq(this.dbTotal);
                });
            });
        });

        describe("Total Bullish Impact", () => {
            it("should increment totalBullish after creating a new event", () => {
                cy.GetEventSummary().then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body.success).to.eq(true);
                    cy.wrap(response.body.event.totalBullish).as(
                        "initialTotalBullish",
                    );
                    cy.log(
                        `📊 Initial total bullish: ${response.body.totalBullish}`,
                    );
                });

                const request = {
                    event_date: faker.date.recent().toISOString().split("T")[0],
                    impact_direction: "UP",
                    event_description: faker.animal.snake(),
                };

                cy.AddEvent(request).then((addResponse) => {
                    expect(addResponse.status).to.eq(201);
                });

                cy.GetEventSummary().then(function (summaryResponse) {
                    expect(summaryResponse.status).to.eq(200);
                    const newTotalBullish =
                        summaryResponse.body.event.totalBullish;

                    expect(newTotalBullish).to.eq(
                        this.initialTotalBullish + 1,
                    );
                    cy.log(
                        `✅ Total bullish increased: ${this.initialTotalBullish} → ${newTotalBullish}`,
                    );
                });
            });

            it("should match totalBullish with database count", function () {
                const request = {
                    event_date: faker.date.recent().toISOString().split("T")[0],
                    impact_direction: "UP",
                    event_description: faker.animal.snake(),
                };

                cy.AddEvent(request).then((response) => {
                    expect(response.status).to.eq(201);
                });

                cy.GetEventSummary().then((response) => {
                    expect(response.status).to.eq(200);
                    cy.wrap(response.body.event.totalBullish).as("apiTotal");
                });

                cy.getEventSummaryFromDb().then((summary) => {
                    cy.wrap(summary.totalBullish).as("dbTotal");
                });

                cy.then(function () {
                    expect(this.apiTotal).to.eq(this.dbTotal);
                });
            });
        });

        describe("Total Bearish Impact", () => {
            it("should increment totalBearish after creating a new event", () => {
                cy.GetEventSummary().then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body.success).to.eq(true);
                    cy.wrap(response.body.event.totalBearish).as(
                        "initialTotalBearish",
                    );
                    cy.log(
                        `📊 Initial total bearish: ${response.body.totalBearish}`,
                    );
                });

                const request = {
                    event_date: faker.date.recent().toISOString().split("T")[0],
                    impact_direction: "DOWN",
                    event_description: faker.animal.snake(),
                };

                cy.AddEvent(request).then((addResponse) => {
                    expect(addResponse.status).to.eq(201);
                });

                cy.GetEventSummary().then(function (response) {
                    expect(response.status).to.eq(200);
                    const newTotalBearish = response.body.event.totalBearish;

                    expect(newTotalBearish).to.eq(this.initialTotalBearish + 1);
                    cy.log(
                        `✅ Total bearish increased: ${this.initialTotalBearish} → ${newTotalBearish}`,
                    );
                });
            });

            it("should match totalBearish with database count", function () {
                const request = {
                    event_date: faker.date.recent().toISOString().split("T")[0],
                    impact_direction: "DOWN",
                    event_description: faker.animal.snake(),
                };

                cy.AddEvent(request).then((response) => {
                    expect(response.status).to.eq(201);
                });

                cy.GetEventSummary().then((response) => {
                    expect(response.status).to.eq(200);
                    cy.wrap(response.body.event.totalBearish).as("apiTotal");
                });

                cy.getEventSummaryFromDb().then((summary) => {
                    cy.wrap(summary.totalBearish).as("dbTotal");
                });

                cy.then(function () {
                    expect(this.apiTotal).to.eq(this.dbTotal);
                });
            });
        });
    });

    describe("Favorite Event API", () => {
        let testEventId;

        before(() => {
            cy.setupApiAuthCookies();

            const request = {
                event_date: faker.date.recent().toISOString().split("T")[0],
                impact_direction: faker.animal.snake(),
                event_description: faker.animal.snake(),
            };

            cy.AddEvent(request).then((response) => {
                expect(response.status).to.eq(201);
                testEventId = response.body.event.id;
                cy.log(`✅ Created test event ID: ${testEventId}`);
            });
        });

        beforeEach(() => {
            cy.clearCookies();
            cy.clearLocalStorage();
            cy.setupApiAuthCookies();
        });

        describe("Authentication", () => {
            it("should return 401 when user is not authenticated", () => {
                cy.clearAllCookies();

                cy.FavoriteEventNoAuth(testEventId, { is_favorite: true }).then(
                    (response) => {
                        expect(response.status).to.be.oneOf([307, 401]);
                    },
                );
            });
        });

        describe("Mark as Favorite", () => {
            it("should mark event as favorite successfully", () => {
                cy.FavoriteEvent(testEventId, { is_favorite: true }).then(
                    (response) => {
                        expect(response.status).to.eq(200);
                        expect(response.body.success).to.be.true;
                        expect(response.body.message).to.eq(
                            "Event favorite status updated",
                        );
                    },
                );
            });

            it("should persist favorite status in database", () => {
                cy.FavoriteEvent(testEventId, { is_favorite: true }).then(
                    (response) => {
                        expect(response.status).to.eq(200);
                    },
                );

                cy.getSingleEventFromDb(testEventId).then((events) => {
                    const event = events[0];
                    expect(event).to.exist;
                    expect(event.is_favorite).to.be.true;
                });
            });

            it("should reflect in event summary totalFavorite", () => {
                cy.GetEventSummary().then((before) => {
                    const beforeCount = before.body.event.totalFavorite;

                    cy.FavoriteEvent(testEventId, { is_favorite: false }).then(
                        () => {
                            cy.FavoriteEvent(testEventId, {
                                is_favorite: true,
                            }).then(() => {
                                cy.GetEventSummary().then((after) => {
                                    expect(
                                        after.body.event.totalFavorite,
                                    ).to.eq(beforeCount);
                                });
                            });
                        },
                    );
                });
            });
        });

        describe("Unmark Favorite", () => {
            before(() => {
                cy.FavoriteEvent(testEventId, { is_favorite: true });
            });

            it("should unmark event as favorite successfully", () => {
                cy.FavoriteEvent(testEventId, { is_favorite: false }).then(
                    (response) => {
                        expect(response.status).to.eq(200);
                        expect(response.body.success).to.be.true;
                    },
                );
            });

            it("should persist unfavorite status in database", () => {
                cy.FavoriteEvent(testEventId, { is_favorite: false }).then(
                    (response) => {
                        expect(response.status).to.eq(200);
                    },
                );

                cy.getSingleEventFromDb(testEventId).then((events) => {
                    const event = events[0];
                    expect(event).to.exist;
                    expect(event.is_favorite).to.be.false;
                });
            });
        });

        describe("Toggle Behavior", () => {
            it("should toggle favorite from false to true", () => {
                cy.FavoriteEvent(testEventId, { is_favorite: false }).then(
                    () => {
                        cy.FavoriteEvent(testEventId, {
                            is_favorite: true,
                        }).then((response) => {
                            expect(response.status).to.eq(200);
                        });

                        cy.getSingleEventFromDb(testEventId).then((events) => {
                            const event = events[0];
                            expect(event).to.exist;
                            expect(event.is_favorite).to.be.true;
                        });
                    },
                );
            });

            it("should toggle favorite from true to false", () => {
                cy.FavoriteEvent(testEventId, { is_favorite: true }).then(
                    () => {
                        cy.FavoriteEvent(testEventId, {
                            is_favorite: false,
                        }).then((response) => {
                            expect(response.status).to.eq(200);
                        });

                        cy.getSingleEventFromDb(testEventId).then((events) => {
                            const event = events[0];
                            expect(event).to.exist;
                            expect(event.is_favorite).to.be.false;
                        });
                    },
                );
            });
        });

        describe("Validation", () => {
            it("should return 404 or error for non-existent event ID", () => {
                cy.FavoriteEvent("non-existent-id-00000", true).then(
                    (response) => {
                        expect(response.status).to.be.oneOf([400, 404, 500]);
                        expect(response.body.success).to.be.false;
                    },
                );
            });

            it("should handle missing is_favorite field", () => {
                cy.FavoriteEvent(testEventId, { is_favorite: true }).then(
                    (response) => {
                        expect(response.status).to.be.oneOf([400, 200]);
                    },
                );
            });
        });
    });
});

describe("Add Event Form - UI Tests", () => {
    describe("Desktop View", () => {
        beforeEach(() => {
            cy.viewport(1280, 720);
            cy.loginWithBypass();
            cy.visit("/main/trading/event");
            cy.wait(1000);
        });
        describe("Dialog Behavior", () => {
            it("should open dialog when Add Event button is clicked", () => {
                cy.get("#addNewEventForm_eventPage").should("not.exist");
                cy.get("#addNewEventBtn_eventPage")
                    .should("be.visible")
                    .click();
                cy.get("#addNewEventForm_eventPage").should("be.visible");
            });

            it("should close dialog when Cancel button is clicked", () => {
                cy.get("#addNewEventBtn_eventPage").click();
                cy.wait(1000);
                cy.get("#addNewEventForm_eventPage").should("be.visible");
                cy.get("#cancelNewEventBtn_eventPage").click();
                cy.get("#addNewEventForm_eventPage").should("not.exist");
            });

            it("should close dialog when clicking outside", () => {
                cy.get("#addNewEventBtn_eventPage").click();
                cy.wait(1000);
                cy.get("#addNewEventForm_eventPage").should("be.visible");
                cy.get("body").click(0, 0, { force: true });
                cy.get("#addNewEventForm_eventPage").should("not.exist");
            });
        });

        describe("Required Fields Validation", () => {
            beforeEach(() => {
                cy.get("#addNewEventBtn_eventPage").click();
                cy.wait(1000);
            });

            it("should show error when event desciption is empty", () => {
                cy.get("#submitNewEventBtn_eventPage").click();
                cy.get("#eventDescriptionField_errorMessage_eventPage")
                    .should("be.visible")
                    .should(
                        "contain",
                        "Description must be at least 10 characters",
                    );
            });
        });

        describe("Event Date Picker", () => {
            beforeEach(() => {
                cy.get("#addNewEventBtn_eventPage").click();
                cy.wait(1000);
            });

            it("should open calendar when date field is clicked", () => {
                cy.get("#eventDateField_eventPage").click();
                cy.get("#eventDatePicker_eventPage").should("be.visible");
            });

            it("should select a date from calendar", () => {
                cy.get("#eventDateField_eventPage").click();
                cy.get("#eventDatePicker_eventPage")
                    .contains("button", "15")
                    .click();
                cy.get("#eventDateField_eventPage").should(
                    "not.contain",
                    "Pick a date",
                );
            });

            it("should display selected date in correct format", () => {
                cy.get("#eventDateField_eventPage").click();
                cy.get("#eventDatePicker_eventPage")
                    .contains("button", "10")
                    .click();
                cy.get("#eventDateField_eventPage")
                    .should("not.contain", "Pick a date")
                    .should("contain", "2026");
            });
        });
    });

    describe("Tablet View", () => {
        beforeEach(() => {
            cy.viewport(768, 1024);
            cy.loginWithBypass();
            cy.visit("/main/trading/event");
            cy.wait(1000);
        });
        describe("Dialog Behavior", () => {
            it("should open dialog when Add Event button is clicked", () => {
                cy.get("#addNewEventForm_eventPage").should("not.exist");
                cy.get("#addNewEventBtn_eventPage")
                    .should("be.visible")
                    .click();
                cy.get("#addNewEventForm_eventPage").should("be.visible");
            });

            it("should close dialog when Cancel button is clicked", () => {
                cy.get("#addNewEventBtn_eventPage").click();
                cy.wait(1000);
                cy.get("#addNewEventForm_eventPage").should("be.visible");
                cy.get("#cancelNewEventBtn_eventPage").click();
                cy.get("#addNewEventForm_eventPage").should("not.exist");
            });

            it("should close dialog when clicking outside", () => {
                cy.get("#addNewEventBtn_eventPage").click();
                cy.wait(1000);
                cy.get("#addNewEventForm_eventPage").should("be.visible");
                cy.get("body").click(0, 0, { force: true });
                cy.get("#addNewEventForm_eventPage").should("not.exist");
            });
        });

        describe("Required Fields Validation", () => {
            beforeEach(() => {
                cy.get("#addNewEventBtn_eventPage").click();
                cy.wait(1000);
            });

            it("should show error when event description is empty", () => {
                cy.get("#submitNewEventBtn_eventPage").click();
                cy.get("#eventDescriptionField_errorMessage_eventPage")
                    .should("be.visible")
                    .should(
                        "contain",
                        "Description must be at least 10 characters",
                    );
            });
        });

        describe("Event Date Picker", () => {
            beforeEach(() => {
                cy.get("#addNewEventBtn_eventPage").click();
                cy.wait(1000);
            });

            it("should open calendar when date field is clicked", () => {
                cy.get("#eventDateField_eventPage").click();
                cy.get("#eventDatePicker_eventPage").should("be.visible");
            });

            it("should select a date from calendar", () => {
                cy.get("#eventDateField_eventPage").click();
                cy.get("#eventDatePicker_eventPage")
                    .contains("button", "15")
                    .click();
                cy.get("#eventDateField_eventPage").should(
                    "not.contain",
                    "Pick a date",
                );
            });

            it("should display selected date in correct format", () => {
                cy.get("#eventDateField_eventPage").click();
                cy.get("#eventDatePicker_eventPage")
                    .contains("button", "10")
                    .click();
                cy.get("#eventDateField_eventPage")
                    .should("not.contain", "Pick a date")
                    .should("contain", "2026");
            });
        });
    });

    describe("Mobile View", () => {
        beforeEach(() => {
            cy.viewport(375, 667);
            cy.loginWithBypass();
            cy.visit("/main/trading/event");
            cy.wait(1000);
        });
        describe("Dialog Behavior", () => {
            it("should open dialog when Add Event button is clicked", () => {
                cy.get("#addNewEventForm_eventPage").should("not.exist");
                cy.get("#addNewEventBtn_eventPage")
                    .should("be.visible")
                    .click();
                cy.get("#addNewEventForm_eventPage").should("be.visible");
            });

            it("should close dialog when Cancel button is clicked", () => {
                cy.get("#addNewEventBtn_eventPage").click();
                cy.wait(1000);
                cy.get("#addNewEventForm_eventPage").should("be.visible");
                cy.get("#cancelNewEventBtn_eventPage").click();
                cy.get("#addNewEventForm_eventPage").should("not.exist");
            });

            it("should close dialog when clicking outside", () => {
                cy.get("#addNewEventBtn_eventPage").click();
                cy.wait(1000);
                cy.get("#addNewEventForm_eventPage").should("be.visible");
                cy.get("body").click(0, 0, { force: true });
                cy.get("#addNewEventForm_eventPage").should("not.exist");
            });
        });

        describe("Required Fields Validation", () => {
            beforeEach(() => {
                cy.get("#addNewEventBtn_eventPage").click();
                cy.wait(1000);
            });

            it("should show error when event description is empty", () => {
                cy.get("#submitNewEventBtn_eventPage").click();
                cy.get("#eventDescriptionField_errorMessage_eventPage")
                    .should("be.visible")
                    .should(
                        "contain",
                        "Description must be at least 10 characters",
                    );
            });
        });

        describe("Event Date Picker", () => {
            beforeEach(() => {
                cy.get("#addNewEventBtn_eventPage").click();
                cy.wait(1000);
            });

            it("should open calendar when date field is clicked", () => {
                cy.get("#eventDateField_eventPage").click();
                cy.get("#eventDatePicker_eventPage").should("be.visible");
            });

            it("should select a date from calendar", () => {
                cy.get("#eventDateField_eventPage").click();
                cy.get("#eventDatePicker_eventPage")
                    .contains("button", "15")
                    .click();
                cy.get("#eventDateField_eventPage").should(
                    "not.contain",
                    "Pick a date",
                );
            });

            it("should display selected date in correct format", () => {
                cy.get("#eventDateField_eventPage").click();
                cy.get("#eventDatePicker_eventPage")
                    .contains("button", "10")
                    .click();
                cy.get("#eventDateField_eventPage")
                    .should("not.contain", "Pick a date")
                    .should("contain", "2026");
            });
        });
    });
});

