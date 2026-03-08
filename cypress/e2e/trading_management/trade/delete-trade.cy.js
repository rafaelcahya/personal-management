import { faker } from "@faker-js/faker";

describe("Trade Delete API", () => {
    let testTradeId;
    let testUserId;

    before(() => {
        cy.setupApiAuthCookies();
        
        const request = {
            trade_date: faker.date.recent(),
            ticker: faker.word.noun(4).toUpperCase(),
            margin: faker.string.numeric(5),
            proceeds: faker.string.numeric(5),
            return_percent: faker.string.numeric(),
            realized_gain: faker.string.numeric(5),
            stock_type_option: faker.animal.snake(),
            entry_session_option: faker.animal.snake(),
            entry_occasion_option: faker.animal.snake(),
            buy_reason_option: faker.animal.snake(),
            sell_reason_option: faker.animal.snake(),
            notes: faker.word.words(25),
        };

        cy.AddTrade(request).then((response) => {
            expect(response.status).to.eq(201);
            testTradeId = response.body.trade.id;
            testUserId = response.body.trade.user_id;

            cy.log(`✅ Created test trade ID: ${testTradeId}`);
        });
    });

    beforeEach(() => {
        cy.setupApiAuthCookies();
    });

    it("should delete trade successfully (200)", () => {
        cy.DeleteTrade(testTradeId).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.success).to.be.true;
            expect(response.body.message).to.eq("Trade deleted successfully");
        });

        cy.GetTradeDetail(testTradeId).then((detailResponse) => {
            expect(detailResponse.status).to.eq(404);
        });
    });

    it("should return 401 without authentication", () => {
        cy.clearCookies();
        cy.DeleteTradeNoAuth(testTradeId).then((response) => {
            cy.clearCookies();

            const updateData = { notes: "unauth test" };
            cy.UpdateTradeNoAuth(testTradeId, updateData).then((response) => {
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

    it("should return 400 for negative/zero trade ID", () => {
        cy.DeleteTrade("0").then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body.error).to.eq("Invalid trade ID format");
        });
    });

    it("should update trade summary after deletion", () => {
        const request = {
            trade_date: faker.date.recent(),
            ticker: faker.word.noun(4).toUpperCase(),
            margin: faker.string.numeric(5),
            proceeds: faker.string.numeric(5),
            return_percent: faker.string.numeric(),
            realized_gain: faker.string.numeric(5),
            stock_type_option: faker.animal.snake(),
            entry_session_option: faker.animal.snake(),
            entry_occasion_option: faker.animal.snake(),
            buy_reason_option: faker.animal.snake(),
            sell_reason_option: faker.animal.snake(),
            notes: faker.word.words(25),
        };

        cy.AddTrade(request).then((response) => {
            expect(response.status).to.eq(201);
            testTradeId = response.body.trade.id;
            testUserId = response.body.trade.user_id;

            cy.GetTradeSummary().then((beforeDelete) => {
                cy.DeleteTrade(testTradeId).then(() => {
                    cy.wait(1000);
                    cy.GetTradeSummary().then((afterDelete) => {
                        expect(afterDelete.body.data.totalTrades).to.eq(
                            beforeDelete.body.data.totalTrades - 1,
                        );
                    });
                });
            });
        });
    });

    it("should delete within 1s", () => {
        const start = Date.now();
        cy.DeleteTrade(testTradeId).then((response) => {
            const duration = Date.now() - start;
            expect(duration).to.be.lte(1000);
            cy.log(`Delete time: ${duration}ms`);
        });
    });

    it("should return correct success response", () => {
        cy.DeleteTrade(testTradeId).then((response) => {
            expect(response.body).to.have.all.keys("success", "message");
            expect(response.body.success).to.be.true;
            expect(response.body.message).to.eq("Trade deleted successfully");
        });
    });
});
