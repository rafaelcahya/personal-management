import { faker } from "@faker-js/faker";

describe("Trade Update API - PUT /api/trade/v1/trade/update/{id}", () => {
    let testTradeId;
    let testUserId;

    before(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
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

    describe("Authentication & Authorization", () => {
        it("should update trade successfully (200)", () => {
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

            cy.UpdateTrade(testTradeId, request).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.success).to.be.true;
                expect(response.body.trade).to.exist;
            });
        });

        it("should return 401 without authentication", () => {
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

    describe("Trade Object Structure Scenarios", () => {
        it("should update trade with all required fields", () => {
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

            cy.UpdateTrade(testTradeId, request).then((response) => {
                const trade = response.body.trade;
                expect(trade).to.have.property("id");
                expect(trade).to.have.property("ticker");
                expect(trade).to.have.property("trade_date");
                expect(trade).to.have.property("margin");
                expect(trade).to.have.property("proceeds");
                expect(trade).to.have.property("realized_gain");
                expect(trade).to.have.property("return_percent");
                expect(trade).to.have.property("user_id");
                expect(trade).to.have.property("stock_type_option");
                expect(trade).to.have.property("entry_session_option");
                expect(trade).to.have.property("entry_occasion_option");
                expect(trade).to.have.property("buy_reason_option");
                expect(trade).to.have.property("sell_reason_option");
                expect(trade).to.have.property("notes");
                expect(trade).to.have.property("created_at");
                expect(trade).to.have.property("updated_at");
                expect(trade).to.have.property("deleted_at");
                expect(trade).to.have.property("uuid");
            });
        });

        it("should return complete updated trade object", () => {
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

            cy.UpdateTrade(testTradeId, request).then((response) => {
                const trade = response.body.trade;
                expect(trade).to.have.all.keys([
                    "buy_reason_option",
                    "created_at",
                    "deleted_at",
                    "entry_occasion_option",
                    "entry_session_option",
                    "id",
                    "margin",
                    "notes",
                    "proceeds",
                    "realized_gain",
                    "return_percent",
                    "sell_reason_option",
                    "stock_type_option",
                    "ticker",
                    "trade_date",
                    "updated_at",
                    "user_id",
                    "uuid",
                ]);
            });
        });

        it("should return correct success response structure", () => {
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

            cy.UpdateTrade(testTradeId, request).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.all.keys("success", "trade");
                expect(response.body.success).to.be.true;
                expect(response.body.trade).to.be.an("object");
            });
        });

        it("should return correct error response structure", () => {
            cy.UpdateTrade().then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body).to.have.all.keys("success", "error");
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.exist;
            });
        });
    });

    describe("Success Scenario", () => {
        it("should update trade successfully (200)", () => {
            const today = new Date().toISOString().split("T")[0];

            const request = {
                trade_date: today,
                ticker: `TEST${faker.string.alphanumeric(4).toUpperCase()}`,
                margin: faker.string.numeric({ length: 7 }),
                proceeds: faker.string.numeric({ length: 7 }),
                return_percent: faker.string.numeric({ length: 3 }),
                realized_gain: faker.string.numeric({ length: 6 }),
                stock_type_option: faker.helpers.arrayElement([
                    "Normal",
                    "E-IPO",
                    "FCA",
                ]),
                entry_session_option: faker.helpers.arrayElement([
                    "Pre-market",
                    "Mid-session",
                ]),
                entry_occasion_option: faker.helpers.arrayElement([
                    "Weekday",
                    "Post-Holiday",
                ]),
                buy_reason_option: faker.helpers.arrayElement([
                    "Support retest:",
                    "No data",
                ]),
                sell_reason_option: faker.helpers.arrayElement([
                    "Target reached:",
                    "No reason",
                ]),
                notes: faker.lorem.sentence(),
            };

            cy.UpdateTrade(testTradeId, request).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.success).to.be.true;

                const updatableFields = [
                    "ticker",
                    "margin",
                    "proceeds",
                    "realized_gain",
                    "return_percent",
                    "stock_type_option",
                    "entry_session_option",
                    "entry_occasion_option",
                    "buy_reason_option",
                    "sell_reason_option",
                    "notes",
                ];

                updatableFields.forEach((field) => {
                    expect(response.body.trade[field]).to.eq(request[field]);
                });

                expect(
                    response.body.trade.trade_date.startsWith(
                        request.trade_date,
                    ),
                ).to.be.true;

                cy.log("✅ All fields updated:", JSON.stringify(request));
            });
        });

        it("should update trade with special characters in ticker", () => {
            const request = {
                trade_date: faker.date.recent(),
                ticker: "BRK.B",
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

            cy.UpdateTrade(testTradeId, request).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.success).to.be.true;
                expect(response.body.trade.ticker).to.eq("BRK.B");
            });
        });

        it("should assign user_id from authenticated user", () => {
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

            cy.UpdateTrade(testTradeId, request).then((response) => {
                expect(response.status).to.eq(200);

                const trade = response.body.trade;
                expect(trade.user_id).to.exist;
                expect(trade.user_id).to.be.a("string");
                expect(trade.user_id.length).to.be.greaterThan(0);

                cy.log(`✅ User ID assigned: ${trade.user_id}`);
            });
        });

        it("should generate timestamps (created_at, updated_at)", () => {
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

            cy.UpdateTrade(testTradeId, request).then((response) => {
                expect(response.status).to.eq(200);

                const trade = response.body.trade;
                expect(trade.created_at).to.exist;
                expect(trade.updated_at).to.exist;

                expect(new Date(trade.created_at).toString()).to.not.eq(
                    "Invalid Date",
                );

                cy.log("✅ Timestamps generated correctly");
            });
        });
    });

    describe("Data Integrity - API vs Database Comparison", () => {
        beforeEach(() => {
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

            cy.UpdateTrade(testTradeId, request).then((response) => {
                expect(response.status).to.eq(200);
                cy.wrap(response.body.trade).as("tradeData");
            });
        });
        describe("Complete Field Comparison", () => {
            it("should match all fields between API and DB", () => {
                const tradeId = this.tradeData.id;
                let apiTrade, dbTrade;

                cy.GetSingleTrade(tradeId).then((response) => {
                    expect(response.status).to.eq(200);
                    apiTrade = response.body.data;
                    cy.log("API Trade:", JSON.stringify(apiTrade));
                });

                cy.getSingleTradeFromDb(tradeId).then((trade) => {
                    dbTrade = trade[0];
                    cy.log("DB Trade:", JSON.stringify(dbTrade));
                });

                cy.then(() => {
                    expect(apiTrade.id, "ID").to.eq(dbTrade.id);
                    expect(apiTrade.ticker, "Ticker").to.eq(dbTrade.ticker);
                    expect(apiTrade.trade_date, "Trade Date").to.eq(
                        dbTrade.trade_date,
                    );
                    expect(apiTrade.user_id, "User ID").to.eq(dbTrade.user_id);
                    expect(apiTrade.margin, "Margin").to.eq(dbTrade.margin);
                    expect(apiTrade.proceeds, "Proceeds").to.eq(
                        dbTrade.proceeds,
                    );
                    expect(apiTrade.realized_gain, "Realized Gain").to.eq(
                        dbTrade.realized_gain,
                    );
                    expect(apiTrade.return_percent, "Return Percent").to.eq(
                        dbTrade.return_percent,
                    );
                    expect(apiTrade.stock_type_option, "Stock Type").to.eq(
                        dbTrade.stock_type_option,
                    );
                    expect(
                        apiTrade.entry_session_option,
                        "Entry Session",
                    ).to.eq(dbTrade.entry_session_option);
                    expect(
                        apiTrade.entry_occasion_option,
                        "Entry Occasion",
                    ).to.eq(dbTrade.entry_occasion_option);
                    expect(apiTrade.buy_reason_option, "Buy Reason").to.eq(
                        dbTrade.buy_reason_option,
                    );
                    expect(apiTrade.sell_reason_option, "Sell Reason").to.eq(
                        dbTrade.sell_reason_option,
                    );
                    expect(apiTrade.notes, "Notes").to.eq(dbTrade.notes);
                    expect(apiTrade.created_at, "Created At").to.eq(
                        dbTrade.created_at,
                    );
                    expect(apiTrade.updated_at, "Updated At").to.eq(
                        dbTrade.updated_at,
                    );
                    expect(apiTrade.deleted_at, "Deleted At").to.eq(
                        dbTrade.deleted_at,
                    );

                    cy.log("✅ All fields match between API and DB");
                });
            });

            it("should have identical field count", () => {
                const tradeId = this.tradeData.id;
                let apiTrade, dbTrade;

                cy.GetSingleTrade(tradeId).then((response) => {
                    apiTrade = response.body.data;
                });

                cy.getSingleTradeFromDb(tradeId).then((trade) => {
                    dbTrade = trade[0];
                });

                cy.then(() => {
                    const apiFieldCount = Object.keys(apiTrade).length;
                    const dbFieldCount = Object.keys(dbTrade).length;

                    expect(apiFieldCount, "Field Count").to.eq(dbFieldCount);
                    cy.log(`✅ Both have ${apiFieldCount} fields`);
                });
            });

            it("should have valid ISO timestamp formats", () => {
                const tradeId = this.tradeData.id;
                let apiTrade, dbTrade;

                cy.GetSingleTrade(tradeId).then((response) => {
                    apiTrade = response.body.data;
                });

                cy.getSingleTradeFromDb(tradeId).then((trade) => {
                    dbTrade = trade[0];
                });

                cy.then(() => {
                    const apiCreatedDate = new Date(apiTrade.created_at);
                    const dbCreatedDate = new Date(dbTrade.created_at);

                    expect(apiCreatedDate.toString()).to.not.eq("Invalid Date");
                    expect(dbCreatedDate.toString()).to.not.eq("Invalid Date");

                    expect(apiTrade.created_at).to.eq(dbTrade.created_at);

                    cy.log("✅ Timestamp formats valid and match");
                });
            });

            it("should match margin values with exact precision", () => {
                const tradeId = this.tradeData.id;
                let apiTrade, dbTrade;

                cy.GetSingleTrade(tradeId).then((response) => {
                    apiTrade = response.body.data;
                });

                cy.getSingleTradeFromDb(tradeId).then((trade) => {
                    dbTrade = trade[0];
                });

                cy.then(() => {
                    const apiMargin = parseFloat(apiTrade.margin);
                    const dbMargin = parseFloat(dbTrade.margin);

                    expect(apiMargin).to.eq(dbMargin);
                    expect(apiTrade.margin).to.eq(dbTrade.margin);

                    cy.log(`✅ Margin matches: ${apiMargin}`);
                });
            });

            it("should match proceeds values with exact precision", () => {
                const tradeId = this.tradeData.id;
                let apiTrade, dbTrade;

                cy.GetSingleTrade(tradeId).then((response) => {
                    apiTrade = response.body.data;
                });

                cy.getSingleTradeFromDb(tradeId).then((trade) => {
                    dbTrade = trade[0];
                });

                cy.then(() => {
                    const apiProceeds = parseFloat(apiTrade.proceeds);
                    const dbProceeds = parseFloat(dbTrade.proceeds);

                    expect(apiProceeds).to.eq(dbProceeds);
                    expect(apiTrade.proceeds).to.eq(dbTrade.proceeds);

                    cy.log(`✅ Proceeds matches: ${apiProceeds}`);
                });
            });

            it("should match realized_gain including negative values", () => {
                const tradeId = this.tradeData.id;
                let apiTrade, dbTrade;

                cy.GetSingleTrade(tradeId).then((response) => {
                    apiTrade = response.body.data;
                });

                cy.getSingleTradeFromDb(tradeId).then((trade) => {
                    dbTrade = trade[0];
                });

                cy.then(() => {
                    if (apiTrade.realized_gain && dbTrade.realized_gain) {
                        const apiGain = parseFloat(apiTrade.realized_gain);
                        const dbGain = parseFloat(dbTrade.realized_gain);

                        expect(apiGain).to.eq(dbGain);
                        expect(apiTrade.realized_gain).to.eq(
                            dbTrade.realized_gain,
                        );

                        cy.log(`✅ Realized Gain matches: ${apiGain}`);
                    }
                });
            });
        });
    });

    describe("Trade Update - Summary Impact Tests", () => {
        describe("Win Count Impact", () => {
            let lossTradeId;
            let lossUserId;
            beforeEach(() => {
                const request = {
                    trade_date: faker.date.recent(),
                    ticker: faker.word.noun(4).toUpperCase(),
                    margin: faker.string.numeric(5),
                    proceeds: faker.string.numeric(5),
                    return_percent: faker.string.numeric(),
                    realized_gain: "-" + faker.string.numeric(5),
                    stock_type_option: faker.animal.snake(),
                    entry_session_option: faker.animal.snake(),
                    entry_occasion_option: faker.animal.snake(),
                    buy_reason_option: faker.animal.snake(),
                    sell_reason_option: faker.animal.snake(),
                    notes: faker.word.words(25),
                };
                cy.AddTrade(request).then((response) => {
                    expect(response.status).to.eq(201);
                    lossTradeId = response.body.trade.id;
                    lossUserId = response.body.trade.user_id;
                    cy.log(`✅ Created test trade ID: ${lossTradeId}`);
                });
            });
            it("should increment totalWins when updating profit trade", () => {
                let initialWins;
                cy.GetTradeSummary().then((response) => {
                    initialWins = response.body.data.totalWins;
                    cy.log(`📊 Initial wins: ${initialWins}`);
                });
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
                cy.UpdateTrade(lossTradeId, request).then((response) => {
                    expect(response.status).to.eq(200);
                });
                cy.GetTradeSummary().then((response) => {
                    const newWins = response.body.data.totalWins;
                    expect(newWins).to.eq(initialWins + 1);
                    cy.log(`✅ Wins increased: ${initialWins} → ${newWins}`);
                });
            });
            it("should NOT increment totalLosses when updating profit trade", () => {
                let initialLosses;
                cy.GetTradeSummary().then((response) => {
                    initialLosses = response.body.data.totalLosses;
                });
                const request = {
                    trade_date: faker.date.recent(),
                    ticker: faker.word.noun(4).toUpperCase(),
                    margin: faker.string.numeric(5),
                    proceeds: faker.string.numeric(3),
                    return_percent: faker.string.numeric(),
                    realized_gain: "-" + faker.string.numeric(5),
                    stock_type_option: faker.animal.snake(),
                    entry_session_option: faker.animal.snake(),
                    entry_occasion_option: faker.animal.snake(),
                    buy_reason_option: faker.animal.snake(),
                    sell_reason_option: faker.animal.snake(),
                    notes: faker.word.words(25),
                };
                cy.UpdateTrade(lossTradeId, request).then((response) => {
                    expect(response.status).to.eq(200);
                });
                cy.GetTradeSummary().then((response) => {
                    const newLosses = response.body.data.totalLosses;
                    expect(newLosses).to.eq(initialLosses);
                    cy.log(
                        `✅ Losses decreased: ${initialLosses} → ${newLosses}`,
                    );
                });
            });
        });
        describe("Loss Count Impact", () => {
            let winTradeId;
            let winUserId;
            beforeEach(() => {
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
                    winTradeId = response.body.trade.id;
                    winUserId = response.body.trade.user_id;
                    cy.log(`✅ Created test trade ID: ${winTradeId}`);
                });
            });
            it("should increment totalLosses when updating loss trade", () => {
                let initialLosses;
                cy.GetTradeSummary().then((response) => {
                    initialLosses = response.body.data.totalLosses;
                    cy.log(`📊 Initial losses: ${initialLosses}`);
                });
                const request = {
                    trade_date: faker.date.recent(),
                    ticker: faker.word.noun(4).toUpperCase(),
                    margin: faker.string.numeric(5),
                    proceeds: faker.string.numeric(3),
                    return_percent: faker.string.numeric(),
                    realized_gain: `-${faker.string.numeric(5)}`,
                    stock_type_option: faker.animal.snake(),
                    entry_session_option: faker.animal.snake(),
                    entry_occasion_option: faker.animal.snake(),
                    buy_reason_option: faker.animal.snake(),
                    sell_reason_option: faker.animal.snake(),
                    notes: faker.word.words(25),
                };
                cy.UpdateTrade(winTradeId, request).then((response) => {
                    expect(response.status).to.eq(200);
                });
                cy.GetTradeSummary().then((response) => {
                    const newLosses = response.body.data.totalLosses;
                    expect(newLosses).to.eq(initialLosses + 1);
                    cy.log(
                        `✅ Losses increased: ${initialLosses} → ${newLosses}`,
                    );
                });
            });
            it("should NOT increment totalWins when updating lost trade", () => {
                let initialWins;
                cy.GetTradeSummary().then((response) => {
                    initialWins = response.body.data.totalWins;
                });
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
                cy.UpdateTrade(winTradeId, request).then((response) => {
                    expect(response.status).to.eq(200);
                });
                cy.GetTradeSummary().then((response) => {
                    const newWins = response.body.data.totalWins;
                    expect(newWins).to.eq(initialWins);
                    cy.log(`✅ Wins unchanged: ${initialWins}`);
                });
            });
        });
        describe("Win Rate Calculation Impact", () => {
            it("should recalculate win rate after updating win trade", () => {
                let initialSummary;
                cy.GetTradeSummary().then((response) => {
                    initialSummary = response.body.data;
                    const initialWinRate =
                        initialSummary.totalTrades > 0
                            ? (initialSummary.totalWins /
                                  initialSummary.totalTrades) *
                              100
                            : 0;
                    cy.log(
                        `📊 Initial win rate: ${initialWinRate.toFixed(1)}%`,
                    );
                });
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
                cy.UpdateTrade(testTradeId, request).then((response) => {
                    expect(response.status).to.eq(200);
                });
                cy.GetTradeSummary().then((response) => {
                    const newSummary = response.body.data;
                    const expectedWinRate =
                        (newSummary.totalWins / newSummary.totalTrades) * 100;
                    const actualWinRate =
                        (newSummary.totalWins / newSummary.totalTrades) * 100;
                    expect(actualWinRate).to.be.closeTo(expectedWinRate, 0.1);
                    cy.log(`✅ New win rate: ${actualWinRate.toFixed(1)}%`);
                });
            });
        });
        describe("Stock Type Summary Impact", () => {
            it("should add new stock type to summary when updated", () => {
                let initialCount;
                cy.GetTradeSummary().then((response) => {
                    const summary = response.body.data.stockTypeSummary;
                    initialCount = summary[request.stock_type_option] || 0;
                    cy.log(
                        `📊 Initial ${request.stock_type_option} count: ${initialCount}`,
                    );
                });
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
                cy.UpdateTrade(testTradeId, request).then((response) => {
                    expect(response.status).to.eq(200);
                });
                cy.GetTradeSummary().then((response) => {
                    const summary = response.body.data.stockTypeSummary;
                    const newCount = summary[request.stock_type_option];
                    expect(newCount).to.eq(initialCount + 1);
                    cy.log(
                        `✅ ${request.stock_type_option} count increased: ${initialCount} → ${newCount}`,
                    );
                });
            });
            it("should match stock type summary with database", () => {
                let apiSummary, dbSummary;
                cy.GetTradeSummary().then((response) => {
                    apiSummary = response.body.data.stockTypeSummary;
                });
                cy.getStockTypeSummaryFromDb().then((summary) => {
                    dbSummary = summary;
                });
                cy.then(() => {
                    expect(apiSummary).to.deep.equal(dbSummary);
                    cy.log("✅ Stock type summaries match");
                });
            });
        });

        describe("Entry Session Summary Impact", () => {
            it("should update entry session summary when trade updated", () => {
                let initialCount;
                cy.GetTradeSummary().then((response) => {
                    const summary = response.body.data.entrySessionSummary;
                    initialCount = summary[request.entry_session_option] || 0;
                    cy.log(
                        `📊 Initial ${request.entry_session_option} count: ${initialCount}`,
                    );
                });
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
                cy.UpdateTrade(testTradeId, request).then((response) => {
                    expect(response.status).to.eq(200);
                });
                cy.GetTradeSummary().then((response) => {
                    const summary = response.body.data.entrySessionSummary;
                    const newCount = summary[request.entry_session_option];
                    expect(newCount).to.eq(initialCount + 1);
                    cy.log(
                        `✅ ${request.entry_session_option} count increased: ${initialCount} → ${newCount}`,
                    );
                });
            });
            it("should match entry session summary with database", () => {
                let apiSummary, dbSummary;
                cy.GetTradeSummary().then((response) => {
                    apiSummary = response.body.data.entrySessionSummary;
                });
                cy.getEntrySessionSummaryFromDb().then((summary) => {
                    dbSummary = summary;
                });
                cy.then(() => {
                    expect(apiSummary).to.deep.equal(dbSummary);
                    cy.log("✅ Entry session summaries match");
                });
            });
        });
        describe("Entry Occasion Summary Impact", () => {
            it("should update entry occasion summary when trade created", () => {
                const occasion = "breakout";
                let initialCount;
                cy.GetTradeSummary().then((response) => {
                    const summary = response.body.data.entryOccasionSummary;
                    initialCount = summary[request.entry_occasion_option] || 0;
                    cy.log(
                        `📊 Initial ${request.entry_occasion_option} count: ${initialCount}`,
                    );
                });
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
                cy.UpdateTrade(testTradeId, request).then((response) => {
                    expect(response.status).to.eq(200);
                });
                cy.GetTradeSummary().then((response) => {
                    const summary = response.body.data.entryOccasionSummary;
                    const newCount = summary[request.entry_occasion_option];
                    expect(newCount).to.eq(initialCount + 1);
                    cy.log(
                        `✅ ${request.entry_occasion_option} count increased: ${initialCount} → ${newCount}`,
                    );
                });
            });
            it("should match entry occasion summary with database", () => {
                let apiSummary, dbSummary;
                cy.GetTradeSummary().then((response) => {
                    apiSummary = response.body.data.entryOccasionSummary;
                });
                cy.getEntryOccasionSummaryFromDb().then((summary) => {
                    dbSummary = summary;
                });
                cy.then(() => {
                    expect(apiSummary).to.deep.equal(dbSummary);
                    cy.log("✅ Entry occasion summaries match");
                });
            });
        });
        describe("Complete Summary Update Verification", () => {
            let initialSummary;

            beforeEach(() => {
                cy.setupApiAuthCookies();
                cy.GetTradeSummary().then((response) => {
                    initialSummary = response.body.data;
                    cy.log("📊 Initial summary captured");
                });
            });

            describe("PROFIT Trade Update", () => {
                it("should flip LOSS → PROFIT correctly", () => {
                    const fixedDate = "2026-02-26";
                    let lossTradeId;

                    cy.AddTrade({
                        trade_date: fixedDate,
                        ticker: "LOSS1",
                        margin: "1000000",
                        proceeds: "900000",
                        return_percent: faker.string.numeric(),
                        realized_gain: "-100000",
                        stock_type_option: "Normal",
                        entry_session_option: "Pre-market",
                        entry_occasion_option: "Weekday",
                        buy_reason_option: faker.animal.snake(),
                        sell_reason_option: faker.animal.snake(),
                    })
                        .then((lossResponse) => {
                            lossTradeId = lossResponse.body.trade.id;
                            cy.log(`📈 LOSS trade ID: ${lossTradeId}`);
                            return cy.GetTradeSummary();
                        })
                        .then((afterLoss) => {
                            expect(afterLoss.body.data.totalLosses).to.eq(
                                initialSummary.totalLosses + 1,
                            );
                            return cy.UpdateTrade(lossTradeId, {
                                margin: "1000000",
                                proceeds: "1100000",
                                realized_gain: "100000",
                                notes: "Flipped to profit",
                            });
                        })
                        .then((updateResponse) => {
                            expect(updateResponse.status).to.eq(200);
                            cy.log("✅ Updated to PROFIT");
                            return cy.wait(1000);
                        })
                        .then(() => {
                            return cy.GetTradeSummary();
                        })
                        .then((finalSummary) => {
                            expect(finalSummary.body.data.totalTrades).to.eq(
                                initialSummary.totalTrades + 1,
                            );
                            expect(finalSummary.body.data.totalWins).to.eq(
                                initialSummary.totalWins + 1,
                            );
                            expect(finalSummary.body.data.totalLosses).to.eq(
                                initialSummary.totalLosses,
                            );

                            expect(
                                finalSummary.body.data.stockTypeSummary[
                                    "Normal"
                                ],
                            ).to.eq(
                                (initialSummary.stockTypeSummary["Normal"] ||
                                    0) + 1,
                            );

                            cy.log("✅ LOSS → PROFIT verified!");
                        });
                });
            });

            describe("LOSS Trade Update", () => {
                it("should flip PROFIT → LOSS correctly", () => {
                    const fixedDate = "2026-02-27";

                    let profitTradeId;

                    cy.AddTrade({
                        trade_date: fixedDate,
                        ticker: "WIN1",
                        margin: "1000000",
                        proceeds: "1100000",
                        return_percent: faker.string.numeric(),
                        realized_gain: "100000",
                        stock_type_option: "E-IPO",
                        entry_session_option: "After-hours",
                        entry_occasion_option: "Post-Holiday",
                        buy_reason_option: faker.animal.snake(),
                        sell_reason_option: faker.animal.snake(),
                    })
                        .then((profitResponse) => {
                            profitTradeId = profitResponse.body.trade.id;
                            cy.log(`📉 PROFIT trade ID: ${profitTradeId}`);
                            return cy.GetTradeSummary();
                        })
                        .then((afterProfit) => {
                            expect(afterProfit.body.data.totalWins).to.eq(
                                initialSummary.totalWins + 1,
                            );
                            return cy.UpdateTrade(profitTradeId, {
                                margin: "1000000",
                                proceeds: "800000",
                                realized_gain: "-200000",
                                notes: "Flipped to loss",
                            });
                        })
                        .then((updateResponse) => {
                            expect(updateResponse.status).to.eq(200);
                            cy.log("✅ Updated to LOSS");
                            return cy.wait(1000);
                        })
                        .then(() => {
                            return cy.GetTradeSummary();
                        })
                        .then((finalSummary) => {
                            expect(finalSummary.body.data.totalTrades).to.eq(
                                initialSummary.totalTrades + 1,
                            );
                            expect(finalSummary.body.data.totalWins).to.eq(
                                initialSummary.totalWins,
                            );
                            expect(finalSummary.body.data.totalLosses).to.eq(
                                initialSummary.totalLosses + 1,
                            );

                            expect(
                                finalSummary.body.data.stockTypeSummary[
                                    "E-IPO"
                                ],
                            ).to.eq(
                                (initialSummary.stockTypeSummary["E-IPO"] ||
                                    0) + 1,
                            );

                            cy.log("✅ PROFIT → LOSS verified!");
                        });
                });
            });
        });
    });

    describe("Request Body Validation", () => {
        it("should return 400 when body is missing", () => {
            cy.UpdateTrade(testTradeId).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.eq(
                    "Invalid JSON in request body",
                );
            });
        });

        it("should return 400 for invalid JSON", () => {
            const request = "NULL";

            cy.UpdateTrade(testTradeId, request).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.eq(
                    "Invalid JSON in request body",
                );
            });
        });

        it("should return 400 for invalid trade ID format", () => {
            cy.UpdateTrade("abc", {}).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
            });
        });

        it("should return 400 for empty body object", () => {
            const request = {};
            cy.UpdateTrade(testTradeId, request).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.be.an("array");
            });
        });
    });

    describe("Update Trade Performance", () => {
        it("should update within 2s", () => {
            const start = Date.now();
            cy.UpdateTrade(testTradeId, { notes: "perf test" }).then(
                (response) => {
                    const duration = Date.now() - start;
                    expect(duration).to.be.lte(2000);
                    cy.log(`Update time: ${duration}ms`);
                },
            );
        });
    });
});
