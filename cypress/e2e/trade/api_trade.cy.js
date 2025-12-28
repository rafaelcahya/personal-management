import { randomString } from "../../support/common/helper";

describe("Trade API", () => {
    before(() => {
        cy.task("clearFixtureFile", "tradeIds.json");
    });

    it("should successfully add new trade", () => {
        const date = new Date().toISOString().split('T')[0];
        const text = randomString(4, "text").toUpperCase();
        const number = randomString(5, "number");
        const uuid = crypto.randomUUID();

        cy.request({
            method: "POST",
            url: "/api/trade/create",
            body: {
                trade_date: date,
                ticker: text,
                margin: number,
                proceeds: number,
                return_percent: number,
                realized_gain: number,
                entry_session_option: text,
                entry_occasion_option: text,
                buy_reason_option: text,
                sell_reason_option: text,
                stock_type_option: text,
                notes: "created by automation at" + date,
                uuid: uuid,
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property("success", true);

            const apiTrade = response.body.trade;

            cy.request({
                method: "GET",
                url: `/api/trade/list/${apiTrade.id}`,
                failOnStatusCode: false,
            }).then(() => {
                cy.task("getTradeFromDbTask", apiTrade.id).then((dbUser) => {
                    expect(apiTrade.trade_date).to.eq(dbUser.tradeDate);
                    expect(apiTrade.ticker).to.eq(dbUser.ticker);
                    expect(apiTrade.margin).to.eq(dbUser.margin);
                    expect(apiTrade.proceeds).to.eq(dbUser.proceeds);
                    expect(apiTrade.return_percent).to.eq(dbUser.returnPercent);
                    expect(apiTrade.realized_gain).to.eq(dbUser.realizedGain);
                    expect(apiTrade.entry_session_option).to.eq(
                        dbUser.entrySessionOption
                    );
                    expect(apiTrade.entry_occasion_option).to.eq(
                        dbUser.entryOccasionOption
                    );
                    expect(apiTrade.entry_occasion_option).to.eq(
                        dbUser.entryOccasionOption
                    );
                    expect(apiTrade.buy_reason_option).to.eq(
                        dbUser.buyReasonOption
                    );
                    expect(apiTrade.sell_reason_option).to.eq(
                        dbUser.sellReasonOption
                    );
                    expect(apiTrade.stock_type_option).to.eq(
                        dbUser.stockTypeOption
                    );
                    expect(apiTrade.notes).to.eq(dbUser.notes);
                });
            });
            cy.task("saveTradeId", apiTrade.id);
        });
    });

    it("should ensure deleted_at is null after successfully adding a new trade", () => {
        const date = new Date().toISOString().split('T')[0];
        const text = randomString(4, "text").toUpperCase();
        const number = randomString(5, "number");
        const uuid = crypto.randomUUID();

        cy.request({
            method: "POST",
            url: "/api/trade/create",
            body: {
                deleted_at: date,
                trade_date: date,
                ticker: text,
                margin: number,
                proceeds: number,
                return_percent: number,
                realized_gain: number,
                entry_session_option: text,
                entry_occasion_option: text,
                buy_reason_option: text,
                sell_reason_option: text,
                stock_type_option: text,
                notes: "created by automation at" + date,
                uuid: uuid,
            },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property("success", true);

            const apiTrade = response.body.trade;

            cy.task("getTradeFromDbTask", apiTrade.id).then((dbUser) => {
                expect(apiTrade.deleted_at).to.eq(dbUser.deletedAt);
                expect(apiTrade.deleted_at).to.be.null;
            });
        });
    });

    it("should Total Trades increase by 1 after adding a new trade", () => {
        let initialTotalTrades;

        cy.GetTradeSummary().then((summary) => {
            initialTotalTrades = summary.totalTrades;
            cy.log("Initial Total Trades: " + initialTotalTrades);
        });

        cy.AddNewTrade().then((trade) => {
            cy.log("Added Trade ID: " + trade.id);
            cy.GetTradeSummary().then((summary) => {
                expect(summary.totalTrades).to.eq(initialTotalTrades + 1);
            });
        });
    });

    it("should Total Trades decrease by 1 after deleting a trade", () => {
        let initialTotalTrades;

        cy.AddNewTrade().then((trade) => {
            cy.log("Added Trade ID: " + trade.id);

            cy.GetTradeSummary().then((summary) => {
                initialTotalTrades = summary.totalTrades;
                cy.log("Initial Total Trades: " + initialTotalTrades);
            });
            cy.DeleteTrade(trade.id).then(() => {
                cy.GetTradeSummary().then((summary) => {
                    expect(summary.totalTrades).to.eq(initialTotalTrades - 1);
                });
            });
        });
    });

    it("should fail to update trade with invalid ID", () => {
        const text = randomString(4, "text").toUpperCase();
        const invalidId = text;

        cy.UpdateTrade(invalidId).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body).to.have.property("success", false);
            expect(response.body).to.have.property(
                "error",
                "Invalid trade ID provided"
            );
        });
    });

    it("should successfully update trade", () => {
        const date = new Date().toISOString().split('T')[0];
        const text = randomString(4, "text").toUpperCase();
        const number = randomString(5, "number");
        const uuid = crypto.randomUUID();

        cy.task("getRandomTradeId").then((randomId) => {
            cy.request({
                method: "PUT",
                url: `/api/trade/update/${randomId}`,
                body: {
                    trade_date: date,
                    ticker: text,
                    margin: number,
                    proceeds: number,
                    return_percent: number,
                    realized_gain: number,
                    entry_session_option: text,
                    entry_occasion_option: text,
                    buy_reason_option: text,
                    sell_reason_option: text,
                    stock_type_option: text,
                    notes: "updated by automation at" + date,
                    uuid: uuid,
                },
                failOnStatusCode: false,
            }).then((response) => {
                cy.log(
                    "🟢 Response Body:",
                    JSON.stringify(response.body, null, 2)
                );
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property("success", true);

                const apiTrade = response.body.trade;

                cy.request({
                    method: "GET",
                    url: `/api/trade/list/${randomId}`,
                    failOnStatusCode: false,
                }).then(() => {
                    cy.task("getTradeFromDbTask", apiTrade.id).then(
                        (dbUser) => {
                            expect(apiTrade.trade_date).to.eq(dbUser.tradeDate);
                            expect(apiTrade.ticker).to.eq(dbUser.ticker);
                            expect(apiTrade.margin).to.eq(dbUser.margin);
                            expect(apiTrade.proceeds).to.eq(dbUser.proceeds);
                            expect(apiTrade.return_percent).to.eq(
                                dbUser.returnPercent
                            );
                            expect(apiTrade.realized_gain).to.eq(
                                dbUser.realizedGain
                            );
                            expect(apiTrade.entry_session_option).to.eq(
                                dbUser.entrySessionOption
                            );
                            expect(apiTrade.entry_occasion_option).to.eq(
                                dbUser.entryOccasionOption
                            );
                            expect(apiTrade.entry_occasion_option).to.eq(
                                dbUser.entryOccasionOption
                            );
                            expect(apiTrade.buy_reason_option).to.eq(
                                dbUser.buyReasonOption
                            );
                            expect(apiTrade.sell_reason_option).to.eq(
                                dbUser.sellReasonOption
                            );
                            expect(apiTrade.stock_type_option).to.eq(
                                dbUser.stockTypeOption
                            );
                            expect(apiTrade.notes).to.eq(dbUser.notes);
                        }
                    );
                });
            });
        });
    });

    it("should fail to update trade with missing required fields", () => {
        cy.task("getRandomTradeId").then((randomId) => {
            cy.UpdateTrade(
                randomId,
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                ""
            ).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body).to.have.property("success", false);
                expect(response.body).to.have.property("message");
                expect(response.body.message).to.include(
                    "trade date is required"
                );
                expect(response.body.message).to.include("ticker is required");
                expect(response.body.message).to.include("margin is required");
                expect(response.body.message).to.include(
                    "proceeds is required"
                );
                expect(response.body.message).to.include(
                    "return percent is required"
                );
                expect(response.body.message).to.include(
                    "realized gain is required"
                );
                expect(response.body.message).to.include(
                    "stock type option is required"
                );
                expect(response.body.message).to.include(
                    "entry session option is required"
                );
                expect(response.body.message).to.include(
                    "entry occasion option is required"
                );
                expect(response.body.message).to.include(
                    "buy reason option is required"
                );
                expect(response.body.message).to.include(
                    "sell reason option is required"
                );
            });
        });
    });

    it("should fail to update trade with invalid date format", () => {
        const text = randomString(4, "text").toUpperCase();
        const number = randomString(5, "number");

        cy.task("getRandomTradeId").then((randomId) => {
            cy.UpdateTrade(
                randomId,
                number,
                text,
                number,
                number,
                number,
                number,
                text,
                text,
                text,
                text,
                text
            ).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body).to.have.property("success", false);
                expect(response.body).to.have.property("message");
                expect(response.body.message).to.include(
                    "trade date must be valid format YYYY-MM-DD"
                );
            });
        });
    });

    it("should fail to update trade with invalid ticker", () => {
        const text = randomString(4, "text").toUpperCase();
        const number = randomString(5, "number");
        const invalidTicker = "TICKER!@#";

        cy.task("getRandomTradeId").then((randomId) => {
            cy.UpdateTrade(
                randomId,
                number,
                invalidTicker,
                number,
                number,
                number,
                number,
                text,
                text,
                text,
                text,
                text
            ).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body).to.have.property("success", false);
                expect(response.body).to.have.property("message");
                expect(response.body.message).to.include(
                    "ticker can only contain letters and numbers (A-Z, a-z, 0-9)"
                );
            });
        });
    });

    it("should fail to update trade with invalid number fields", () => {
        const text = randomString(4, "text").toUpperCase();
        const date = new Date().toISOString().split('T')[0];
        const invalidNumber = "123ABC";

        cy.task("getRandomTradeId").then((randomId) => {
            cy.UpdateTrade(
                randomId,
                date,
                text,
                invalidNumber,
                invalidNumber,
                invalidNumber,
                invalidNumber,
                text,
                text,
                text,
                text,
                text
            ).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body).to.have.property("success", false);
                expect(response.body).to.have.property("message");
                expect(response.body.message).to.include(
                    "margin must be a valid number"
                );
                expect(response.body.message).to.include(
                    "proceeds must be a valid number"
                );
                expect(response.body.message).to.include(
                    "return percent must be a valid number (with or without %)"
                );
                expect(response.body.message).to.include(
                    "realized gain must be a valid number"
                );
            });
        });
    });

    it("should ensure deleted_at is null after successfully updating a trade", () => {
        const date = new Date().toISOString().split('T')[0];
        const text = randomString(4, "text").toUpperCase();
        const number = randomString(5, "number");
        const uuid = crypto.randomUUID();

        cy.task("getRandomTradeId").then((randomId) => {
            cy.request({
                method: "PUT",
                url: `/api/trade/update/${randomId}`,
                body: {
                    trade_date: date,
                    ticker: text,
                    margin: number,
                    proceeds: number,
                    return_percent: number,
                    realized_gain: number,
                    entry_session_option: text,
                    entry_occasion_option: text,
                    buy_reason_option: text,
                    sell_reason_option: text,
                    stock_type_option: text,
                    notes: "updated by automation at" + date,
                    uuid: uuid,
                },
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(200);

                const apiTrade = response.body.trade;

                cy.task("getTradeFromDbTask", apiTrade.id).then((dbUser) => {
                    expect(apiTrade.deleted_at).to.eq(dbUser.deletedAt);
                    expect(apiTrade.deleted_at).to.be.null;
                });
            });
        });
    });

    it("should successfully delete trade", () => {
        cy.task("getRandomTradeId").then((randomId) => {
            cy.request({
                method: "DELETE",
                url: `/api/trade/delete/${randomId}`,
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property("success", true);

                cy.task("getTradeFromDbTask", randomId).then((dbUser) => {
                    expect(dbUser).to.be.null;
                });
            });
        });
    });
});
