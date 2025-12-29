import { randomString } from "../../support/common/helper";

describe("Trade API", () => {
    before(() => {
        cy.task("clearFixtureFile", "tradeIds.json");
    });

    describe("Summary", () => {
        it("should display correct progress overview summary", () => {
            cy.GetTradeSummary().then((summary) => {
                const metrics = ["totalTrades", "totalWins", "totalLosses"];
                metrics.forEach((metric) => {
                    cy.task("getProgressOverviewSummaryFromDb", metric).then(
                        (dbCount) => {
                            expect(summary[metric]).to.eq(dbCount);
                        }
                    );
                });
            });
        });

        it("should display correct total stock type counts in summary", () => {
            cy.GetTradeSummary().then((summary) => {
                const stockTypeSummary = summary.stockTypeSummary;
                const stockTypes = Object.keys(stockTypeSummary);
                stockTypes.forEach((type) => {
                    cy.task("getTotalStockTypeFromDb", type).then((dbCount) => {
                        expect(stockTypeSummary[type]).to.eq(dbCount);
                    });
                });
            });
        });

        it("should display correct total entry session counts in summary", () => {
            cy.GetTradeSummary().then((summary) => {
                const entrySessionSummary = summary.entrySessionSummary;
                const entrySessions = Object.keys(entrySessionSummary);
                entrySessions.forEach((session) => {
                    cy.task("getTotalEntrySessionFromDb", session).then(
                        (dbCount) => {
                            expect(entrySessionSummary[session]).to.eq(dbCount);
                        }
                    );
                });
            });
        });

        it("should display correct total entry occasion counts in summary", () => {
            cy.GetTradeSummary().then((summary) => {
                const entryOccasionSummary = summary.entryOccasionSummary;
                const entryOccasions = Object.keys(entryOccasionSummary);
                entryOccasions.forEach((occasion) => {
                    cy.task("getTotalEntryOccasionFromDb", occasion).then(
                        (dbCount) => {
                            expect(entryOccasionSummary[occasion]).to.eq(
                                dbCount
                            );
                        }
                    );
                });
            });
        });
    });

    describe("Create", () => {
        it("should successfully add new trade", () => {
            const testData = {
                date: new Date().toISOString().split("T")[0],
                text: randomString(4, "text").toUpperCase(),
                number: randomString(5, "number"),
            };

            const request = {
                trade_date: testData.date,
                ticker: testData.text,
                margin: testData.number,
                proceeds: testData.number,
                return_percent: testData.number,
                realized_gain: testData.number,
                stock_type_option: testData.text,
                entry_session_option: testData.text,
                entry_occasion_option: testData.text,
                buy_reason_option: testData.text,
                sell_reason_option: testData.text,
                notes: testData.text,
            };

            cy.AddNewTrade(request).then((response) => {
                expect(response.status).to.eq(200);

                cy.wrap(response.body.trade).as("apiTrade");
                cy.wrap(response.body.trade.id).as("tradeId");

                cy.get("@tradeId").then((id) => {
                    cy.task("getTradeFromDbTask", id).then((dbTrade) => {
                        cy.get("@apiTrade").then((apiTrade) => {
                            expect(apiTrade.trade_date).to.eq(
                                dbTrade.tradeDate
                            );
                            expect(apiTrade.ticker).to.eq(dbTrade.ticker);
                            expect(apiTrade.margin).to.eq(dbTrade.margin);
                            expect(apiTrade.proceeds).to.eq(dbTrade.proceeds);
                            expect(apiTrade.return_percent).to.eq(
                                dbTrade.returnPercent
                            );
                            expect(apiTrade.realized_gain).to.eq(
                                dbTrade.realizedGain
                            );
                            expect(apiTrade.stock_type_option).to.eq(
                                dbTrade.stockTypeOption
                            );
                            expect(apiTrade.entry_session_option).to.eq(
                                dbTrade.entrySessionOption
                            );
                            expect(apiTrade.entry_occasion_option).to.eq(
                                dbTrade.entryOccasionOption
                            );
                            expect(apiTrade.buy_reason_option).to.eq(
                                dbTrade.buyReasonOption
                            );
                            expect(apiTrade.sell_reason_option).to.eq(
                                dbTrade.sellReasonOption
                            );
                            expect(apiTrade.notes).to.eq(dbTrade.notes);
                        });
                    });
                });

                cy.task("saveTradeId", response.body.trade.id);
            });
        });

        it("should fail to add new trade with missing required fields", () => {
            const request = {
                trade_date: "",
                ticker: "",
                margin: "",
                proceeds: "",
                return_percent: "",
                realized_gain: "",
                stock_type_option: "",
                entry_session_option: "",
                entry_occasion_option: "",
                buy_reason_option: "",
                sell_reason_option: "",
                notes: "",
            };

            cy.AddNewTrade(request).then((response) => {
                expect(response.status).to.eq(400);

                cy.wrap(response.body.trade).as("apiTrade");

                const requiredErrors = [
                    "trade date is required",
                    "ticker is required",
                    "margin is required",
                    "proceeds is required",
                    "return percent is required",
                    "realized gain is required",
                    "stock type option is required",
                    "entry session option is required",
                    "entry occasion option is required",
                    "buy reason option is required",
                    "sell reason option is required",
                ];

                requiredErrors.forEach((error) => {
                    expect(response.body.message).to.include(error);
                });
            });
        });

        it("should fail to add new trade with invalid JSON", () => {
            cy.AddNewTrade().then((response) => {
                expect(response.status).to.eq(400);

                cy.wrap(response.body.trade).as("apiTrade");

                expect(response.body.message).to.include(
                    "Invalid JSON in request body"
                );
            });
        });

        it("should fail to add new trade with invalid ticker", () => {
            const testData = {
                text: randomString(4, "text").toUpperCase(),
                number: randomString(5, "number"),
                invalidTicker: "TICKER!@#",
            };

            const request = {
                trade_date: new Date().toISOString().split("T")[0],
                ticker: testData.invalidTicker,
                margin: testData.number,
                proceeds: testData.number,
                return_percent: testData.number,
                realized_gain: testData.number,
                stock_type_option: testData.text,
                entry_session_option: testData.text,
                entry_occasion_option: testData.text,
                buy_reason_option: testData.text,
                sell_reason_option: testData.text,
                notes: testData.text,
            };

            cy.AddNewTrade(request).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.message).to.include(
                    "ticker can only contain letters and numbers (A-Z, a-z, 0-9)"
                );
            });
        });

        it("should fail to add new trade with invalid number fields", () => {
            const testData = {
                text: randomString(4, "text").toUpperCase(),
                date: new Date().toISOString().split("T")[0],
                invalidNumber: "123ABC",
            };

            const request = {
                trade_date: testData.date,
                ticker: testData.text,
                margin: testData.invalidNumber,
                proceeds: testData.invalidNumber,
                return_percent: testData.invalidNumber,
                realized_gain: testData.invalidNumber,
                stock_type_option: testData.text,
                entry_session_option: testData.text,
                entry_occasion_option: testData.text,
                buy_reason_option: testData.text,
                sell_reason_option: testData.text,
                notes: testData.text,
            };

            cy.AddNewTrade(request).then((response) => {
                expect(response.status).to.eq(400);

                const requiredErrors = [
                    "margin must be a valid number",
                    "proceeds must be a valid number",
                    "return percent must be a valid number (with or without %)",
                    "realized gain must be a valid number",
                ];

                requiredErrors.forEach((error) => {
                    expect(response.body.message).to.include(error);
                });
            });
        });

        it("should ensure deleted_at is null after successfully adding a new trade", () => {
            const testData = {
                text: randomString(4, "text").toUpperCase(),
                date: new Date().toISOString().split("T")[0],
                number: randomString(5, "number"),
            };

            const request = {
                trade_date: testData.date,
                ticker: testData.text,
                margin: testData.number,
                proceeds: testData.number,
                return_percent: testData.number,
                realized_gain: testData.number,
                stock_type_option: testData.text,
                entry_session_option: testData.text,
                entry_occasion_option: testData.text,
                buy_reason_option: testData.text,
                sell_reason_option: testData.text,
                notes: testData.text,
            };

            cy.AddNewTrade(request).then((response) => {
                expect(response.status).to.eq(200);

                cy.wrap(response.body.trade.id).as("tradeId");

                cy.get("@tradeId").then((id) => {
                    cy.task("getTradeFromDbTask", id).then((dbUser) => {
                        expect(response.body.trade.deleted_at).to.eq(
                            dbUser.deletedAt
                        );
                        expect(response.body.trade.deleted_at).to.be.null;
                    });
                });
            });
        });

        it("should Total Trades increase by 1 after adding a new trade", () => {
            const testData = {
                text: randomString(4, "text").toUpperCase(),
                date: new Date().toISOString().split("T")[0],
                number: randomString(5, "number"),
            };

            const request = {
                trade_date: testData.date,
                ticker: testData.text,
                margin: testData.number,
                proceeds: testData.number,
                return_percent: testData.number,
                realized_gain: testData.number,
                stock_type_option: testData.text,
                entry_session_option: testData.text,
                entry_occasion_option: testData.text,
                buy_reason_option: testData.text,
                sell_reason_option: testData.text,
                notes: testData.text,
            };

            cy.GetTradeSummary()
                .then((summary) => {
                    cy.wrap(summary.totalTrades).as("initialTotalTrades");
                })

                .then(() => cy.AddNewTrade(request))

                .then(() =>
                    cy.GetTradeSummary().then((finalSummary) => {
                        cy.get("@initialTotalTrades").then(
                            (initialTotalTrades) => {
                                expect(finalSummary.totalTrades).to.eq(
                                    initialTotalTrades + 1
                                );
                            }
                        );
                    })
                );
        });

        it("should Total Win Trades increase by 1 after adding a new winning trade", () => {
            const testData = {
                text: randomString(4, "text").toUpperCase(),
                date: new Date().toISOString().split("T")[0],
                number: randomString(5, "number"),
            };
            const request = {
                trade_date: testData.date,
                ticker: testData.text,
                margin: testData.number,
                proceeds: testData.number,
                return_percent: testData.number,
                realized_gain: "10",
                stock_type_option: testData.text,
                entry_session_option: testData.text,
                entry_occasion_option: testData.text,
                buy_reason_option: testData.text,
                sell_reason_option: testData.text,
                notes: testData.text,
            };
            cy.GetTradeSummary()
                .then((summary) => {
                    cy.wrap(summary.totalWins).as("initialTotalWins");
                })

                .then(() => cy.AddNewTrade(request))
                .then(() =>
                    cy.GetTradeSummary().then((finalSummary) => {
                        cy.get("@initialTotalWins").then((initialTotalWins) => {
                            expect(finalSummary.totalWins).to.eq(
                                initialTotalWins + 1
                            );
                        });
                    })
                );
        });

        it("should Total Loss Trades increase by 1 after adding a new winning trade", () => {
            const testData = {
                text: randomString(4, "text").toUpperCase(),
                date: new Date().toISOString().split("T")[0],
                number: randomString(5, "number"),
            };
            const request = {
                trade_date: testData.date,
                ticker: testData.text,
                margin: testData.number,
                proceeds: testData.number,
                return_percent: testData.number,
                realized_gain: "-10",
                stock_type_option: testData.text,
                entry_session_option: testData.text,
                entry_occasion_option: testData.text,
                buy_reason_option: testData.text,
                sell_reason_option: testData.text,
                notes: testData.text,
            };
            cy.GetTradeSummary()
                .then((summary) => {
                    cy.wrap(summary.totalLosses).as("initialTotalLosses");
                })

                .then(() => cy.AddNewTrade(request))
                .then(() =>
                    cy.GetTradeSummary().then((finalSummary) => {
                        cy.get("@initialTotalLosses").then(
                            (initialTotalLosses) => {
                                expect(finalSummary.totalLosses).to.eq(
                                    initialTotalLosses + 1
                                );
                            }
                        );
                    })
                );
        });
    });

    describe("Update", () => {
        it("should fail to update trade with invalid ID", () => {
            const text = randomString(4, "text").toUpperCase();
            const invalidId = text;

            cy.UpdateTrade(invalidId).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body).to.have.property(
                    "message",
                    "Invalid trade ID provided"
                );
            });
        });

        it("should successfully update trade", () => {
            const testData = {
                date: new Date().toISOString().split("T")[0],
                text: randomString(4, "text").toUpperCase(),
                number: randomString(5, "number"),
            };

            const request = {
                trade_date: testData.date,
                ticker: testData.text,
                margin: testData.number,
                proceeds: testData.number,
                return_percent: testData.number,
                realized_gain: testData.number,
                stock_type_option: testData.text,
                entry_session_option: testData.text,
                entry_occasion_option: testData.text,
                buy_reason_option: testData.text,
                sell_reason_option: testData.text,
                notes: testData.text,
            };

            cy.task("getRandomTradeId")
                .then((id) => cy.UpdateTrade(id, request))
                .then((response) => {
                    expect(response.status).to.eq(200);

                    const apiTrade = response.body.trade;
                    cy.wrap(apiTrade).as("apiTrade");
                    cy.wrap(apiTrade.id).as("tradeId");
                })
                .then(() => {
                    cy.get("@tradeId").then((tradeId) => {
                        return cy.task("getTradeFromDbTask", tradeId);
                    });
                })
                .then((dbTrade) => {
                    cy.get("@apiTrade").then((apiTrade) => {
                        expect(apiTrade.trade_date).to.eq(dbTrade.tradeDate);
                        expect(apiTrade.ticker).to.eq(dbTrade.ticker);
                        expect(apiTrade.margin).to.eq(dbTrade.margin);
                        expect(apiTrade.proceeds).to.eq(dbTrade.proceeds);
                        expect(apiTrade.return_percent).to.eq(
                            dbTrade.returnPercent
                        );
                        expect(apiTrade.realized_gain).to.eq(
                            dbTrade.realizedGain
                        );
                        expect(apiTrade.stock_type_option).to.eq(
                            dbTrade.stockTypeOption
                        );
                        expect(apiTrade.entry_session_option).to.eq(
                            dbTrade.entrySessionOption
                        );
                        expect(apiTrade.entry_occasion_option).to.eq(
                            dbTrade.entryOccasionOption
                        );
                        expect(apiTrade.buy_reason_option).to.eq(
                            dbTrade.buyReasonOption
                        );
                        expect(apiTrade.sell_reason_option).to.eq(
                            dbTrade.sellReasonOption
                        );
                        expect(apiTrade.notes).to.eq(dbTrade.notes);
                    });
                });
        });

        it("should fail to update trade with missing required fields", () => {
            const request = {
                trade_date: "",
                ticker: "",
                margin: "",
                proceeds: "",
                return_percent: "",
                realized_gain: "",
                stock_type_option: "",
                entry_session_option: "",
                entry_occasion_option: "",
                buy_reason_option: "",
                sell_reason_option: "",
                notes: "",
            };

            cy.task("getRandomTradeId").then((randomId) => {
                cy.UpdateTrade(randomId, request).then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body).to.have.property("success", false);
                    expect(response.body).to.have.property("message");

                    const requiredErrors = [
                        "trade date is required",
                        "ticker is required",
                        "margin is required",
                        "proceeds is required",
                        "return percent is required",
                        "realized gain is required",
                        "stock type option is required",
                        "entry session option is required",
                        "entry occasion option is required",
                        "buy reason option is required",
                        "sell reason option is required",
                    ];

                    requiredErrors.forEach((error) => {
                        expect(response.body.message).to.include(error);
                    });
                });
            });
        });
        
        it("should fail to update trade with invalid ticker", () => {
            const testData = {
                text: randomString(4, "text").toUpperCase(),
                number: randomString(5, "number"),
                invalidTicker: "TICKER!@#",
            };

            const request = {
                trade_date: new Date().toISOString().split("T")[0],
                ticker: testData.invalidTicker,
                margin: testData.number,
                proceeds: testData.number,
                return_percent: testData.number,
                realized_gain: testData.number,
                stock_type_option: testData.text,
                entry_session_option: testData.text,
                entry_occasion_option: testData.text,
                buy_reason_option: testData.text,
                sell_reason_option: testData.text,
                notes: testData.text,
            };

            cy.task("getRandomTradeId").then((randomId) => {
                cy.UpdateTrade(randomId, request).then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body.message).to.include(
                        "ticker can only contain letters and numbers (A-Z, a-z, 0-9)"
                    );
                });
            });
        });

        it("should fail to update trade with invalid number fields", () => {
            const testData = {
                text: randomString(4, "text").toUpperCase(),
                date: new Date().toISOString().split("T")[0],
                invalidNumber: "123ABC",
            };

            const request = {
                trade_date: testData.date,
                ticker: testData.text,
                margin: testData.invalidNumber,
                proceeds: testData.invalidNumber,
                return_percent: testData.invalidNumber,
                realized_gain: testData.invalidNumber,
                stock_type_option: testData.text,
                entry_session_option: testData.text,
                entry_occasion_option: testData.text,
                buy_reason_option: testData.text,
                sell_reason_option: testData.text,
                notes: testData.text,
            };

            cy.task("getRandomTradeId").then((randomId) => {
                cy.UpdateTrade(randomId, request).then((response) => {
                    expect(response.status).to.eq(400);

                    const requiredErrors = [
                        "margin must be a valid number",
                        "proceeds must be a valid number",
                        "return percent must be a valid number (with or without %)",
                        "realized gain must be a valid number",
                    ];

                    requiredErrors.forEach((error) => {
                        expect(response.body.message).to.include(error);
                    });
                });
            });
        });

        it("should ensure deleted_at is null after successfully updating a trade", () => {
            const testData = {
                date: new Date().toISOString().split("T")[0],
                text: randomString(4, "text").toUpperCase(),
                number: randomString(5, "number"),
            };

            const request = {
                trade_date: testData.date,
                ticker: testData.text,
                margin: testData.number,
                proceeds: testData.number,
                return_percent: testData.number,
                realized_gain: testData.number,
                stock_type_option: testData.text,
                entry_session_option: testData.text,
                entry_occasion_option: testData.text,
                buy_reason_option: testData.text,
                sell_reason_option: testData.text,
                notes: testData.text,
            };

            cy.task("getRandomTradeId").then((randomId) => {
                cy.wrap(randomId).as("tradeId");
            });

            cy.get("@tradeId").then((id) => {
                cy.UpdateTrade(id, request).then((response) => {
                    expect(response.status).to.eq(200);
                    cy.wrap(response.body.trade).as("apiTrade");

                    cy.get("@apiTrade").then((apiTrade) => {
                        cy.task("getTradeFromDbTask", id).then((dbUser) => {
                            expect(apiTrade.deleted_at).to.eq(dbUser.deletedAt);
                            expect(apiTrade.deleted_at).to.be.null;
                        });
                    });
                });
            });
        });

        it("should Total Win Trades increase by 1 after updating a losing trade", () => {
            const testData = {
                text: randomString(4, "text").toUpperCase(),
                date: new Date().toISOString().split("T")[0],
                number: randomString(5, "number"),
            };

            const requestCreate = {
                trade_date: testData.date,
                ticker: testData.text,
                margin: testData.number,
                proceeds: testData.number,
                return_percent: testData.number,
                realized_gain: "-10",
                stock_type_option: testData.text,
                entry_session_option: testData.text,
                entry_occasion_option: testData.text,
                buy_reason_option: testData.text,
                sell_reason_option: testData.text,
                notes: testData.text,
            };

            const requestUpdate = {
                trade_date: testData.date,
                ticker: testData.text,
                margin: testData.number,
                proceeds: testData.number,
                return_percent: testData.number,
                realized_gain: "10",
                stock_type_option: testData.text,
                entry_session_option: testData.text,
                entry_occasion_option: testData.text,
                buy_reason_option: testData.text,
                sell_reason_option: testData.text,
                notes: testData.text,
            };

            cy.GetTradeSummary().then((summary) => {
                cy.wrap(summary.totalWins).as("initialTotalWins");
            });

            cy.AddNewTrade(requestCreate).then((response) => {
                const tradeId = response.body.trade.id;

                cy.UpdateTrade(tradeId, requestUpdate).then(() => {
                    cy.GetTradeSummary().then((finalSummary) => {
                        cy.get("@initialTotalWins").then((initialTotalWins) => {
                            expect(finalSummary.totalWins).to.eq(
                                initialTotalWins + 1
                            );
                        });
                    });
                });
            });
        });

        it("should Total Lose Trades increase by 1 after updating a winning trade", () => {
            const testData = {
                text: randomString(4, "text").toUpperCase(),
                date: new Date().toISOString().split("T")[0],
                number: randomString(5, "number"),
            };

            const requestCreate = {
                trade_date: testData.date,
                ticker: testData.text,
                margin: testData.number,
                proceeds: testData.number,
                return_percent: testData.number,
                realized_gain: "10",
                stock_type_option: testData.text,
                entry_session_option: testData.text,
                entry_occasion_option: testData.text,
                buy_reason_option: testData.text,
                sell_reason_option: testData.text,
                notes: testData.text,
            };

            const requestUpdate = {
                trade_date: testData.date,
                ticker: testData.text,
                margin: testData.number,
                proceeds: testData.number,
                return_percent: testData.number,
                realized_gain: "-10",
                stock_type_option: testData.text,
                entry_session_option: testData.text,
                entry_occasion_option: testData.text,
                buy_reason_option: testData.text,
                sell_reason_option: testData.text,
                notes: testData.text,
            };

            cy.GetTradeSummary().then((summary) => {
                cy.wrap(summary.totalLosses).as("initialTotalLosses");
            });

            cy.AddNewTrade(requestCreate).then((response) => {
                const tradeId = response.body.trade.id;

                cy.UpdateTrade(tradeId, requestUpdate).then(() => {
                    cy.GetTradeSummary().then((finalSummary) => {
                        cy.get("@initialTotalLosses").then(
                            (initialTotalLosses) => {
                                expect(finalSummary.totalLosses).to.eq(
                                    initialTotalLosses + 1
                                );
                            }
                        );
                    });
                });
            });
        });

        it("should fail to update trade with invalid JSON", () => {
            cy.task("getRandomTradeId").then((randomId) => {
                cy.UpdateTrade(randomId).then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body.message).to.include(
                        "Invalid JSON in request body"
                    );
                });
            });
        });
    });

    describe("Delete", () => {
        it("should successfully delete trade", () => {
            const testData = {
                date: new Date().toISOString().split("T")[0],
                text: randomString(4, "text").toUpperCase(),
                number: randomString(5, "number"),
            };

            const request = {
                trade_date: testData.date,
                ticker: testData.text,
                margin: testData.number,
                proceeds: testData.number,
                return_percent: testData.number,
                realized_gain: testData.number,
                stock_type_option: testData.text,
                entry_session_option: testData.text,
                entry_occasion_option: testData.text,
                buy_reason_option: testData.text,
                sell_reason_option: testData.text,
                notes: testData.text,
            };

            cy.AddNewTrade(request)
                .then((response) => {
                    cy.wrap(response.body.trade.id).as("tradeIdToDelete");
                })
                .then(() => {
                    cy.get("@tradeIdToDelete").then((id) => {
                        cy.DeleteTrade(id).then((deleteResponse) => {
                            expect(deleteResponse.status).to.eq(200);
                            cy.task("getTradeFromDbTask", id).then((dbTrade) => {
                                expect(dbTrade).to.be.null;
                            });
                        });
                    });
                });
        });

        it("should Total Trades decrease by 1 after deleting a trade", () => {
            let baselineotalTrades;

            const testData = {
                date: new Date().toISOString().split("T")[0],
                text: randomString(4, "text").toUpperCase(),
                number: randomString(5, "number"),
            };

            const request = {
                trade_date: testData.date,
                ticker: testData.text,
                margin: testData.number,
                proceeds: testData.number,
                return_percent: testData.number,
                realized_gain: testData.number,
                stock_type_option: testData.text,
                entry_session_option: testData.text,
                entry_occasion_option: testData.text,
                buy_reason_option: testData.text,
                sell_reason_option: testData.text,
                notes: testData.text,
            };

            cy.GetTradeSummary()
                .then((summary) => {
                    baselineotalTrades = summary.totalTrades;
                    return cy.AddNewTrade(request);
                })
                .then((response) => {
                    const tradeId = response.body.trade.id;
                    return cy.DeleteTrade(tradeId);
                })
                .then(() => cy.GetTradeSummary())
                .then((summary) => {
                    expect(summary.totalTrades).to.eq(baselineotalTrades);
                });
        });

        it("should fail with invalid ID", () => {
            cy.DeleteTrade("abc").then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.message).to.eq(
                    "Invalid trade ID provided"
                );
            });
        });
    });
});
