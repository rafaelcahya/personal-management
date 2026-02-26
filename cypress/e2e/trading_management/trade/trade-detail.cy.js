import { faker } from "@faker-js/faker";

describe("Trade Detail API", () => {
    let testTradeId;
    let testUserId;
    let request;
    let responseTrade;

    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.setupApiAuthCookies();

        request = {
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
            expect(response.body.success).to.be.true;
            expect(response.body.trade).to.exist;
            expect(response.status).to.eq(201);

            testUserId = response.body.trade.user_id;
            testTradeId = response.body.trade.id;
            responseTrade = response.body.trade;
        });
    });

    describe("Authentication & Authorization", () => {
        it("should return 401 for unauthenticated requests", () => {
            cy.clearCookies();

            cy.GetTradeDetailNoAuth(testTradeId).then((response) => {
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
            cy.GetTradeDetail(testTradeId).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.success).to.be.true;
                expect(response.body.data).to.exist;
                expect(response.body.data.id).to.eq(testTradeId);
            });
        });
    });

    describe("Parameter Validation", () => {
        it("should return 400 for invalid trade ID (non-numeric)", () => {
            cy.GetTradeDetail("invalid-id").then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.include("Trade ID");
            });
        });

        it("should return 400 for empty trade ID", () => {
            cy.GetTradeDetail().then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.eq("Trade ID is required");
            });
        });

        it("should return 400 for missing trade ID", () => {
            expect(response.status).to.be.oneOf([307, 401]);

            if (response.status === 401) {
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.eq("Unauthorized");
            }

            const location = response.headers.location || response.body;
            expect(String(location)).to.include("/login");
        });

        it("should return 400 for non-integer trade ID", () => {
            cy.GetTradeDetail("123.45").then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.eq(
                    "Trade ID must be an integer",
                );
            });
        });
    });

    describe("Valid Trade Retrieval", () => {
        it("should return correct trade data", () => {
            let apiTrade;

            cy.GetTradeDetail(testTradeId).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.success).to.be.true;
                expect(response.body.data).to.exist;

                apiTrade = response.body.data;

                expect(apiTrade.id).to.eq(testTradeId);
                expect(apiTrade.ticker).to.eq(responseTrade.ticker);
                expect(apiTrade.trade_date).to.eq(responseTrade.trade_date);
                expect(apiTrade.margin).to.eq(responseTrade.margin);
                expect(apiTrade.proceeds).to.eq(responseTrade.proceeds);
                expect(apiTrade.realized_gain).to.eq(
                    responseTrade.realized_gain,
                );
                expect(apiTrade.return_percent).to.eq(
                    responseTrade.return_percent,
                );
                expect(apiTrade.user_id).to.eq(testUserId);
                expect(apiTrade.stock_type_option).to.eq(
                    responseTrade.stock_type_option,
                );
                expect(apiTrade.entry_session_option).to.eq(
                    responseTrade.entry_session_option,
                );
                expect(apiTrade.entry_occasion_option).to.eq(
                    responseTrade.entry_occasion_option,
                );
                expect(apiTrade.buy_reason_option).to.eq(
                    responseTrade.buy_reason_option,
                );
                expect(apiTrade.sell_reason_option).to.eq(
                    responseTrade.sell_reason_option,
                );
                expect(apiTrade.notes).to.eq(responseTrade.notes);
            });
        });

        it("should return all trade fields", () => {
            cy.GetTradeDetail(testTradeId).then((response) => {
                const trade = response.body.data;
                expect(trade).to.have.property("id");
                expect(trade).to.have.property("ticker");
                expect(trade).to.have.property("trade_date");
                expect(trade).to.have.property("margin");
                expect(trade).to.have.property("proceeds");
                expect(trade).to.have.property("user_id");
                expect(trade).to.have.property("created_at");
                expect(trade).to.have.property("updated_at");
                expect(trade).to.have.property("realized_gain");
                expect(trade).to.have.property("return_percent");
                expect(trade).to.have.property("stock_type_option");
                expect(trade).to.have.property("notes");
            });
        });

        it("should return correct response structure", () => {
            cy.GetTradeDetail(testTradeId).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.all.keys("success", "data");
                expect(response.body.success).to.be.true;
                expect(response.body.data).to.be.an("object");
                expect(response.body.data.id).to.be.a("number");
            });
        });

        it("should return JSON content-type", () => {
            cy.GetTradeDetail(testTradeId).then((response) => {
                expect(response.headers["content-type"]).to.include(
                    "application/json",
                );
            });
        });
    });

    describe("Trade Not Found", () => {
        it("should return 404 for non-existent trade ID", () => {
            const fakeId = 999999999;

            cy.GetTradeDetail(fakeId).then((response) => {
                expect(response.status).to.eq(404);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.eq("Trade not found");
                expect(response.body.data).to.not.exist;
            });
        });

        it("should return 404 for trade owned by other user", () => {
            const otherUserTradeId = 72;

            cy.GetTradeDetail(otherUserTradeId).then((response) => {
                expect(response.status).to.eq(404);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.eq("Trade not found");
            });
        });
    });

    describe("Data Integrity", () => {
        it("should match database data exactly", () => {
            let apiTrade, dbTrade;

            cy.GetTradeDetail(testTradeId).then((response) => {
                apiTrade = response.body.data;
            });

            cy.getSingleTradeFromDb(testTradeId.toString()).then((trade) => {
                dbTrade = trade[0];
            });

            cy.then(() => {
                expect(apiTrade.id).to.eq(dbTrade.id);
                expect(apiTrade.ticker).to.eq(dbTrade.ticker);
                expect(apiTrade.margin).to.eq(dbTrade.margin);
                expect(apiTrade.proceeds).to.eq(dbTrade.proceeds);
                expect(apiTrade.user_id).to.eq(dbTrade.user_id);
                expect(apiTrade.created_at).to.eq(dbTrade.created_at);
            });
        });
    });

    describe("Performance", () => {
        it("should respond within 1 second", () => {
            const startTime = Date.now();

            cy.GetTradeDetail(testTradeId).then((response) => {
                const duration = Date.now() - startTime;

                expect(response.status).to.eq(200);
                expect(duration).to.be.lessThan(1000);

                cy.log(`⏱️ Response time: ${duration}ms`);
            });
        });

        it("should handle concurrent requests", () => {
            const requests = Array.from({ length: 5 }, () =>
                cy.GetTradeDetail(testTradeId),
            );

            requests.forEach((request) => {
                request.then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body.data.id).to.eq(testTradeId);
                });
            });
        });
    });

    describe("Caching & Consistency", () => {
        it("should return consistent data across multiple requests", () => {
            const tradeIds = Array.from({ length: 3 }, () =>
                cy.GetTradeDetail(testTradeId),
            );

            let firstTrade;

            tradeIds.forEach((request, index) => {
                request.then((response) => {
                    const trade = response.body.data;

                    if (index === 0) {
                        firstTrade = trade;
                    } else {
                        expect(trade.id).to.eq(firstTrade.id);
                        expect(trade.ticker).to.eq(firstTrade.ticker);
                        expect(trade.margin).to.eq(firstTrade.margin);
                    }
                });
            });
        });
    });
});
