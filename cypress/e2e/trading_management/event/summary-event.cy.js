import { faker } from "@faker-js/faker";

describe("Event Summary API and Database Comparison", () => {
    describe("Event Summary API", () => {
        beforeEach(() => {
            cy.clearCookies();
            cy.clearLocalStorage();
            cy.setupApiAuthCookies();
        });

        describe("Authentication & Authorization", () => {
            it("should return 307 redirect when user is not authenticated", () => {
                cy.clearApiAuth();
                cy.GetEventSummaryNoAuth().then((response) => {
                    expect(response.status).to.eq(307);

                    const location = response.headers.location || response.body;
                    expect(String(location)).to.include("/login");
                });
            });

            it("should return 200 when user is authenticated", () => {
                cy.GetEventSummary().then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body.success).to.be.true;
                    expect(response.body.event).to.exist;
                });
            });
        });

        describe("Response Structure", () => {
            it("should return correct response structure", () => {
                cy.GetEventSummary().then((response) => {
                    expect(response.body).to.have.property("success");
                    expect(response.body).to.have.property("event");
                    expect(response.body.success).to.be.true;
                });
            });

            it("should return all required data fields", () => {
                cy.GetEventSummary().then((response) => {
                    const data = response.body.event;

                    expect(data).to.have.all.keys(
                        "totalEvents",
                        "totalBullish",
                        "totalBearish",
                        "totalFavorite",
                    );
                });
            });

            it("should return correct data types for all fields", () => {
                cy.GetEventSummary().then((response) => {
                    const data = response.body.event;

                    expect(data.totalEvents).to.be.a("number");
                    expect(data.totalBullish).to.be.a("number");
                    expect(data.totalBearish).to.be.a("number");
                    expect(data.totalFavorite).to.be.a("number");
                });
            });

            it("should have non-negative numeric values", () => {
                cy.GetEventSummary().then((response) => {
                    const data = response.body.event;

                    expect(data.totalEvents).to.be.at.least(0);
                    expect(data.totalBullish).to.be.at.least(0);
                    expect(data.totalBearish).to.be.at.least(0);
                    expect(data.totalFavorite).to.be.at.least(0);
                });
            });

            it("should return valid JSON content-type", () => {
                cy.GetEventSummary().then((response) => {
                    expect(response.headers["content-type"]).to.include(
                        "application/json",
                    );
                });
            });
        });

        describe("Business Logic Validation", () => {
            it("summary objects should only contain positive integers", () => {
                cy.GetEventSummary().then((response) => {
                    const data = response.body.event;

                    Object.values(data.totalEvents).forEach((count) => {
                        expect(count).to.be.a("number");
                        expect(count).to.be.at.least(1);
                        expect(Number.isInteger(count)).to.be.true;
                    });

                    Object.values(data.totalBullish).forEach((count) => {
                        expect(count).to.be.a("number");
                        expect(count).to.be.at.least(1);
                        expect(Number.isInteger(count)).to.be.true;
                    });

                    Object.values(data.totalBearish).forEach((count) => {
                        expect(count).to.be.a("number");
                        expect(count).to.be.at.least(1);
                        expect(Number.isInteger(count)).to.be.true;
                    });

                    Object.values(data.totalFavorite).forEach((count) => {
                        expect(count).to.be.a("number");
                        expect(count).to.be.at.least(1);
                        expect(Number.isInteger(count)).to.be.true;
                    });
                });
            });
        });

        describe("Edge Cases & Data Scenarios", () => {
            it("should handle user with no events", () => {
                cy.GetEventSummary().then((response) => {
                    const data = response.body.event;

                    if (data.totalEvents === 0) {
                        expect(data.totalEvents).to.eq(0);
                        expect(data.totalBullish).to.eq(0);
                        expect(data.totalBearish).to.eq(0);
                        expect(data.totalFavorite).to.eq(0);
                    }
                });
            });
        });

        describe("Performance", () => {
            it("should respond within acceptable time (<2s)", () => {
                const startTime = Date.now();

                cy.GetEventSummary().then((response) => {
                    const duration = Date.now() - startTime;

                    expect(response.status).to.eq(200);
                    expect(duration).to.be.lessThan(2000);

                    cy.log(`Response time: ${duration}ms`);
                });
            });

            it("should handle multiple sequential requests", () => {
                cy.GetEventSummary().then((response1) => {
                    expect(response1.status).to.eq(200);

                    cy.GetEventSummary().then((response2) => {
                        expect(response2.status).to.eq(200);

                        cy.GetEventSummary().then((response3) => {
                            expect(response3.status).to.eq(200);

                            expect(response1.body.event).to.have.all.keys(
                                response2.body.event,
                            );
                        });
                    });
                });
            });
        });

        describe("Data Consistency", () => {
            it("should return consistent data across multiple requests", () => {
                let firstData;

                cy.GetEventSummary().then((response) => {
                    firstData = response.body.event;
                });

                cy.GetEventSummary().then((response) => {
                    const secondData = response.body.event;
                    expect(secondData).to.deep.equal(firstData);
                });
            });
        });
    });

    describe("Event Summary API vs Database Comparison", () => {
        beforeEach(() => {
            cy.clearCookies();
            cy.clearLocalStorage();
            cy.setupApiAuthCookies();
        });

        describe("Total Counts Comparison", () => {
            it("API totalEvents should match database count", () => {
                let apiTotal, dbTotal, userId;

                const request = {
                    event_date: faker.date.recent(),
                    impact_direction: faker.animal.snake(),
                    event_description: faker.word.words(25),
                };

                cy.AddEvent(request).then((response) => {
                    expect(response.status).to.eq(201);
                    userId = response.body.event.user_id;
                });

                cy.GetEventSummary().then((response) => {
                    apiTotal = response.body.event.totalEvents;
                    cy.log(`API totalEvents: ${apiTotal}`);
                });

                cy.getEventSummaryFromDb(userId).then((count) => {
                    dbTotal = count.totalEvents;
                    cy.log(`DB totalEvents: ${dbTotal}`);

                    expect(apiTotal).to.eq(dbTotal);
                });
            });

            it("API totalBullish should match database count", () => {
                let apiWins, dbWins, userId;

                const request = {
                    event_date: faker.date.recent(),
                    impact_direction: faker.animal.snake(),
                    event_description: faker.word.words(25),
                };

                cy.AddEvent(request).then((response) => {
                    expect(response.status).to.eq(201);
                    userId = response.body.event.user_id;
                });

                cy.GetEventSummary().then((response) => {
                    apiWins = response.body.event.totalBullish;
                    cy.log(`API totalBullish: ${apiWins}`);
                });

                cy.getEventSummaryFromDb(userId).then((count) => {
                    dbWins = count.totalBullish;
                    cy.log(`DB totalBullish: ${dbWins}`);

                    expect(apiWins).to.eq(dbWins);
                });
            });

            it("API totalBearish should match database count", () => {
                let apiWins, dbWins, userId;

                const request = {
                    event_date: faker.date.recent(),
                    impact_direction: faker.animal.snake(),
                    event_description: faker.word.words(25),
                };

                cy.AddEvent(request).then((response) => {
                    expect(response.status).to.eq(201);
                    userId = response.body.event.user_id;
                });

                cy.GetEventSummary().then((response) => {
                    apiWins = response.body.event.totalBearish;
                    cy.log(`API totalBearish: ${apiWins}`);
                });

                cy.getEventSummaryFromDb(userId).then((count) => {
                    dbWins = count.totalBearish;
                    cy.log(`DB totalBearish: ${dbWins}`);

                    expect(apiWins).to.eq(dbWins);
                });
            });

            it("API totalFavorite should match database count", () => {
                let apiWins, dbWins, userId;

                const request = {
                    event_date: faker.date.recent(),
                    impact_direction: faker.animal.snake(),
                    event_description: faker.word.words(25),
                };

                cy.AddEvent(request).then((response) => {
                    expect(response.status).to.eq(201);
                    userId = response.body.event.user_id;
                });

                cy.GetEventSummary().then((response) => {
                    apiWins = response.body.event.totalFavorite;
                    cy.log(`API totalFavorite: ${apiWins}`);
                });

                cy.getEventSummaryFromDb(userId).then((count) => {
                    dbWins = count.totalFavorite;
                    cy.log(`DB totalFavorite: ${dbWins}`);

                    expect(apiWins).to.eq(dbWins);
                });
            });
        });

        describe("Complete Data Integrity Check", () => {
            it("all API data should perfectly match database source", () => {
                const request = {
                    event_date: faker.date.recent().toISOString().split("T")[0],
                    impact_direction: faker.animal.snake(),
                    event_description: faker.word.words(25),
                };

                cy.AddEvent(request).then((response) => {
                    expect(response.status).to.eq(201);
                });

                cy.GetEventSummary().then((response) => {
                    expect(response.status).to.eq(200);
                    cy.wrap(response.body.event.totalEvents).as("apiTotalEvents");
                    cy.wrap(response.body.event.totalBullish).as("apiTotalBullish");
                    cy.wrap(response.body.event.totalBearish).as("apiTotalBearish");
                    cy.wrap(response.body.event.totalFavorite).as("apiTotalFavorite");
                    cy.log(
                        "API Full Response:",
                        JSON.stringify(response.body.event),
                    );
                });

                cy.getEventSummaryFromDb().then((summary) => {
                    cy.wrap(summary.totalEvents).as("dbTotalEvents");
                    cy.wrap(summary.totalBullish).as("dbTotalBullish");
                    cy.wrap(summary.totalBearish).as("dbTotalBearish");
                    cy.wrap(summary.totalFavorite).as("dbTotalFavorite");
                    cy.log("DB Full Summary:", JSON.stringify(summary));
                });

                cy.then(function () {
                    expect(this.apiTotalEvents, "totalEvents").to.eq(
                        this.dbTotalEvents,
                    );
                    expect(this.apiTotalBullish, "totalBullish").to.eq(
                        this.dbTotalBullish,
                    );
                    expect(this.apiTotalBearish, "totalBearish").to.eq(
                        this.dbTotalBearish,
                    );
                    expect(this.apiTotalFavorite, "totalFavorite").to.eq(
                        this.dbTotalFavorite,
                    );
                    cy.log("✅ All API data matches database source");
                });
            });
        });
    });
});

describe("Event List Summary - UI Tests", () => {
    beforeEach(() => {
        cy.loginWithBypass();
        cy.visit("/main/landing");
        cy.visit("/main/trading/event");
        cy.wait(1000);
    });

    describe("Mobile Interaction (375x667)", () => {
        beforeEach(() => {
            cy.viewport(375, 667);
        });

        it("should hide desktop view and show collapsible on mobile", () => {
            cy.get("#eventListSummaryDesktop_eventPage").should("not.be.visible");
            cy.get("#eventSummaryCollapsible_eventPage").should("be.visible");
        });

        it("should display collapsed summary header by default", () => {
            cy.get("#eventSummaryCollapsibleDefault_eventPage").should(
                "be.visible",
            );
            cy.get("#eventSummaryCollapsibleContent_eventPage").should(
                "not.be.visible",
            );
        });

        it("should expand when trigger is clicked", () => {
            cy.get("#eventSummaryCollapsibleContent_eventPage").should(
                "not.be.visible",
            );

            cy.get("#eventSummaryCollapsibleTrigger_eventPage").click();
            cy.wait(300);

            cy.get("#eventSummaryCollapsibleContent_eventPage").should(
                "be.visible",
            );
            cy.get("#totalEventsSummary_eventPage_mobileView").should(
                "be.visible",
            );
            cy.get("#totalBullishSummary_eventPage_mobileView").should(
                "be.visible",
            );
            cy.get("#totalBearishSummary_eventPage_mobileView").should(
                "be.visible",
            );
            cy.get("#totalFavoriteSummary_eventPage_mobileView").should(
                "be.visible",
            );
        });

        it("should collapse when trigger is clicked again", () => {
            cy.get("#eventSummaryCollapsibleTrigger_eventPage").click();
            cy.wait(300);
            cy.get("#eventSummaryCollapsibleContent_eventPage").should(
                "be.visible",
            );

            cy.get("#eventSummaryCollapsibleTrigger_eventPage").click();
            cy.wait(300);
            cy.get("#eventSummaryCollapsibleContent_eventPage").should(
                "not.be.visible",
            );
        });
    });

    describe("Tablet Interaction (768x1024)", () => {
        beforeEach(() => {
            cy.viewport(768, 1024);
        });

        it("should show desktop grid view on tablet", () => {
            cy.get("#eventListSummaryDesktop_eventPage").should("be.visible");
            cy.get("#eventSummaryCollapsible_eventPage").should("not.be.visible");
        });

        it("should display all 2 summary cards in grid", () => {
            cy.get("#totalEventsSummary_eventPage_desktopView").should(
                "be.visible",
            );
            cy.get("#totalBullishSummary_eventPage_desktopView").should(
                "be.visible",
            );
            cy.get("#totalBearishSummary_eventPage_desktopView").should(
                "be.visible",
            );
            cy.get("#totalFavoriteSummary_eventPage_desktopView").should(
                "be.visible",
            );
        });
    });

    describe("Desktop Interaction (1280x720)", () => {
        beforeEach(() => {
            cy.viewport(1280, 720);
        });

        it("should show desktop grid view", () => {
            cy.get("#eventListSummaryDesktop_eventPage").should("be.visible");
            cy.get("#eventSummaryCollapsible_eventPage").should("not.be.visible");
        });

        it("should display all 2 summary cards", () => {
            cy.get("#totalEventsSummary_eventPage_desktopView").should(
                "be.visible",
            );
            cy.get("#totalBullishSummary_eventPage_desktopView").should(
                "be.visible",
            );
            cy.get("#totalBearishSummary_eventPage_desktopView").should(
                "be.visible",
            );
            cy.get("#totalFavoriteSummary_eventPage_desktopView").should(
                "be.visible",
            );
        });
    });
});
