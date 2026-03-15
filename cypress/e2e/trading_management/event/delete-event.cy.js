import { faker } from "@faker-js/faker";

describe("Event Delete API", () => {
    let testEventId;
    let testUserId;

    before(() => {
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

    it("should delete event successfully (200)", () => {
        cy.DeleteEvent(testEventId).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.success).to.be.true;
            expect(response.body.message).to.eq("Event deleted successfully");
        });

        cy.GetEventDetail(testEventId).then((detailResponse) => {
            expect(detailResponse.status).to.eq(404);
        });
    });

    it("should return 401 without authentication", () => {
        cy.clearCookies();
        cy.DeleteEventNoAuth(testEventId).then((response) => {
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

    it("should return 400 for negative/zero event ID", () => {
        cy.DeleteEvent("0").then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body.error).to.eq("Invalid event ID format");
        });
    });

    it("should update total event summary after deletion", () => {
        const request = {
            event_date: faker.date.recent(),
            impact_direction: faker.animal.snake(),
            event_description: faker.word.words(25),
        };

        cy.AddEvent(request).then((response) => {
            expect(response.status).to.eq(201);
            testEventId = response.body.event.id;
            testUserId = response.body.event.user_id;

            cy.GetEventSummary().then((beforeDelete) => {
                cy.DeleteEvent(testEventId).then(() => {
                    cy.wait(1000);
                    cy.GetEventSummary().then((afterDelete) => {
                        expect(afterDelete.body.event.totalEvents).to.eq(
                            beforeDelete.body.event.totalEvents - 1,
                        );
                    });
                });
            });
        });
    });

    it("should update total bullish summary after deletion", () => {
        const request = {
            event_date: faker.date.recent(),
            impact_direction: "UP",
            event_description: faker.word.words(25),
        };

        cy.AddEvent(request).then((response) => {
            expect(response.status).to.eq(201);
            testEventId = response.body.event.id;
            testUserId = response.body.event.user_id;

            cy.GetEventSummary().then((beforeDelete) => {
                cy.DeleteEvent(testEventId).then(() => {
                    cy.wait(1000);
                    cy.GetEventSummary().then((afterDelete) => {
                        expect(afterDelete.body.event.totalBullish).to.eq(
                            beforeDelete.body.event.totalBullish - 1,
                        );
                    });
                });
            });
        });
    });

    it("should update total bearish summary after deletion", () => {
        const request = {
            event_date: faker.date.recent(),
            impact_direction: "DOWN",
            event_description: faker.word.words(25),
        };

        cy.AddEvent(request).then((response) => {
            expect(response.status).to.eq(201);
            testEventId = response.body.event.id;
            testUserId = response.body.event.user_id;

            cy.GetEventSummary().then((beforeDelete) => {
                cy.DeleteEvent(testEventId).then(() => {
                    cy.wait(1000);
                    cy.GetEventSummary().then((afterDelete) => {
                        expect(afterDelete.body.event.totalBearish).to.eq(
                            beforeDelete.body.event.totalBearish - 1,
                        );
                    });
                });
            });
        });
    });
    
    it("should update total favorite summary after deletion", () => {
        const request = {
            event_date: faker.date.recent().toISOString().split("T")[0],
            impact_direction: "DOWN",
            event_description: faker.word.words(25),
        };

        cy.AddEvent(request).then((addResponse) => {
            expect(addResponse.status).to.eq(201);
            const newEventId = addResponse.body.event.id;

            cy.FavoriteEvent(newEventId, { is_favorite: true }).then(
                (favResponse) => {
                    expect(favResponse.status).to.eq(200);

                    cy.GetEventSummary().then((beforeDelete) => {
                        expect(beforeDelete.status).to.eq(200);
                        const totalFavBefore =
                            beforeDelete.body.event.totalFavorite;
                        const totalBearishBefore =
                            beforeDelete.body.event.totalBearish;
                        cy.log(
                            `📊 Before delete — totalFavorite: ${totalFavBefore}, totalBearish: ${totalBearishBefore}`,
                        );

                        cy.DeleteEvent(newEventId).then((deleteResponse) => {
                            expect(deleteResponse.status).to.eq(200);

                            cy.GetEventSummary().then((afterDelete) => {
                                expect(afterDelete.status).to.eq(200);
                                expect(
                                    afterDelete.body.event.totalFavorite,
                                ).to.eq(totalFavBefore - 1);
                                expect(
                                    afterDelete.body.event.totalBearish,
                                ).to.eq(totalBearishBefore - 1);
                                cy.log(
                                    `✅ totalFavorite: ${totalFavBefore} → ${afterDelete.body.event.totalFavorite}`,
                                );
                                cy.log(
                                    `✅ totalBearish: ${totalBearishBefore} → ${afterDelete.body.event.totalBearish}`,
                                );
                            });
                        });
                    });
                },
            );
        });
    });

    it("should delete within 1s", () => {
        const start = Date.now();
        cy.DeleteEvent(testEventId).then(() => {
            const duration = Date.now() - start;
            expect(duration).to.be.lte(1000);
            cy.log(`Delete time: ${duration}ms`);
        });
    });

    it("should return correct success response", () => {
        cy.DeleteEvent(testEventId).then((response) => {
            expect(response.body).to.have.all.keys("success", "message");
            expect(response.body.success).to.be.true;
            expect(response.body.message).to.eq("Event deleted successfully");
        });
    });
});
