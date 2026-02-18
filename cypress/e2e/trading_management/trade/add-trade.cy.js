import { faker } from "@faker-js/faker";
import { formatToRupiah } from "../../../support/common/helper";

describe("Trade Add API and Database Comparison", () => {
    describe("Add Trade API", () => {
        beforeEach(() => {
            cy.clearCookies();
            cy.clearLocalStorage();
            cy.setupApiAuthCookies();
        });

        describe("Authentication & Authorization", () => {
            it("should return 307 or 401 when user is not authenticated", () => {
                cy.clearApiAuth();

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

                cy.AddTradeNoAuth(request).then((response) => {
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
                    expect(response.body.success).to.be.true;
                    expect(response.body.trade).to.exist;
                });
            });
        });

        describe("Request Body Validation", () => {
            it("should return 400 when body is missing", () => {
                cy.AddTrade().then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.eq(
                        "Invalid JSON in request body",
                    );
                });
            });

            it("should return 400 for invalid JSON", () => {
                const request = "NULL";

                cy.AddTrade(request).then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.eq(
                        "Invalid JSON in request body",
                    );
                });
            });

            it("should return 400 for empty body object", () => {
                const request = {};
                cy.AddTrade(request).then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.be.an("array");
                });
            });
        });

        describe("Required Fields Validation", () => {
            it("should return 400 when trade_date is missing", () => {
                const request = {
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
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.be.an("array");
                    expect(response.body.error).to.include(
                        "trade date is required",
                    );
                });
            });

            it("should return 400 when ticker is missing", () => {
                const request = {
                    trade_date: faker.date.recent(),
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
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.be.an("array");
                    expect(response.body.error).to.include(
                        "ticker is required",
                    );
                });
            });

            it("should return 400 when margin is missing", () => {
                const request = {
                    trade_date: faker.date.recent(),
                    ticker: faker.word.noun(4).toUpperCase(),
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
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.be.an("array");
                    expect(response.body.error).to.include(
                        "margin is required",
                    );
                });
            });

            it("should return 400 when proceeds is missing", () => {
                const request = {
                    trade_date: faker.date.recent(),
                    ticker: faker.word.noun(4).toUpperCase(),
                    margin: faker.string.numeric(5),
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
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.be.an("array");
                    expect(response.body.error).to.include(
                        "proceeds is required",
                    );
                });
            });

            it("should return 400 when trade_date is empty string", () => {
                const request = {
                    trade_date: "",
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
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.be.an("array");
                    expect(response.body.error).to.include(
                        "trade date is required",
                    );
                });
            });

            it("should return 400 when ticker is empty string", () => {
                const request = {
                    trade_date: faker.date.recent(),
                    ticker: "",
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
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.be.an("array");
                    expect(response.body.error).to.include(
                        "ticker is required",
                    );
                });
            });

            it("should return 400 when margin is empty string", () => {
                const request = {
                    trade_date: faker.date.recent(),
                    ticker: faker.word.noun(4).toUpperCase(),
                    margin: "",
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
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.be.an("array");
                    expect(response.body.error).to.include(
                        "margin is required",
                    );
                });
            });

            it("should return 400 when proceeds is empty string", () => {
                const request = {
                    trade_date: faker.date.recent(),
                    ticker: faker.word.noun(4).toUpperCase(),
                    margin: faker.string.numeric(5),
                    proceeds: "",
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
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.be.an("array");
                    expect(response.body.error).to.include(
                        "proceeds is required",
                    );
                });
            });

            it("should return 400 when trade_date is null", () => {
                const request = {
                    trade_date: null,
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
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.be.an("array");
                    expect(response.body.error).to.include(
                        "trade date is required",
                    );
                });
            });

            it("should return 400 when ticker is null", () => {
                const request = {
                    trade_date: faker.date.recent(),
                    ticker: null,
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
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.be.an("array");
                    expect(response.body.error).to.include(
                        "ticker is required",
                    );
                });
            });

            it("should return 400 when margin is null", () => {
                const request = {
                    trade_date: faker.date.recent(),
                    ticker: faker.word.noun(4).toUpperCase(),
                    margin: null,
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
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.be.an("array");
                    expect(response.body.error).to.include(
                        "margin is required",
                    );
                });
            });

            it("should return 400 when proceeds is null", () => {
                const request = {
                    trade_date: faker.date.recent(),
                    ticker: faker.word.noun(4).toUpperCase(),
                    margin: faker.string.numeric(5),
                    proceeds: null,
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
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.be.an("array");
                    expect(response.body.error).to.include(
                        "proceeds is required",
                    );
                });
            });

            it("should return 400 with multiple validation errors", () => {
                const request = {};

                cy.AddTrade(request).then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.be.an("array");
                    expect(response.body.error.length).to.be.greaterThan(1);
                    expect(response.body.error.length).to.be.eq(4);

                    cy.log(
                        `Validation errors: ${response.body.error.join(", ")}`,
                    );
                });
            });
        });

        describe("Trade Object Structure Scenarios", () => {
            it("should create trade with all required fields", () => {
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
                    const trade = response.body.trade;
                    expect(trade).to.have.property("id");
                    expect(trade).to.have.property("ticker");
                    expect(trade).to.have.property("margin");
                    expect(trade).to.have.property("proceeds");
                    expect(trade).to.have.property("trade_date");
                    expect(trade).to.have.property("user_id");
                    expect(trade).to.have.property("created_at");
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

                cy.AddTrade(request).then((response) => {
                    expect(response.status).to.eq(201);
                    expect(response.body).to.have.all.keys("success", "trade");
                    expect(response.body.success).to.be.true;
                    expect(response.body.trade).to.be.an("object");
                });
            });

            it("should return correct error response structure", () => {
                cy.AddTrade().then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body).to.have.all.keys("success", "error");
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.exist;
                });
            });
        });

        describe("Success Scenarios", () => {
            it("should create trade with all required fields", () => {
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
                    expect(response.body.success).to.be.true;
                    expect(response.body.trade).to.exist;
                });
            });

            it("should create trade with special characters in ticker", () => {
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

                cy.AddTrade(request).then((response) => {
                    expect(response.status).to.eq(201);
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

                cy.AddTrade(request).then((response) => {
                    expect(response.status).to.eq(201);

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

                cy.AddTrade(request).then((response) => {
                    expect(response.status).to.eq(201);

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
    });

    describe("Data Integrity - API vs Database Comparison", () => {
        let tradeId;
        let userId;

        beforeEach(() => {
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
                tradeId = response.body.trade.id;
                userId = response.body.trade.user_id;
                cy.log(`Created test trade ID: ${tradeId}`);
            });
        });

        describe("Complete Field Comparison", () => {
            it("should match all fields between API and DB", () => {
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

    describe("Trade Creation - Summary Impact Tests", () => {
        let tradeId;
        let userId;

        beforeEach(() => {
            cy.clearCookies();
            cy.clearLocalStorage();
            cy.setupApiAuthCookies();
        });

        describe("Total Trades Count Impact", () => {
            it("should increment totalTrades after creating a new trade", () => {
                let initialCount;

                cy.GetTradeSummary().then((response) => {
                    expect(response.status).to.eq(200);
                    initialCount = response.body.data.totalTrades;
                    cy.log(`📊 Initial total trades: ${initialCount}`);
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

                cy.AddTrade(request).then((response) => {
                    expect(response.status).to.eq(201);
                    tradeId = response.body.trade.id;
                    userId = response.body.trade.user_id;
                    cy.log(`Created test trade ID: ${tradeId}`);
                });

                cy.GetTradeSummary().then((response) => {
                    const newCount = response.body.data.totalTrades;

                    expect(newCount).to.eq(initialCount + 1);
                    cy.log(
                        `✅ Total trades increased: ${initialCount} → ${newCount}`,
                    );
                });
            });

            it("should match totalTrades with database count", () => {
                let apiTotal, dbTotal;

                cy.GetTradeSummary().then((response) => {
                    apiTotal = response.body.data.totalTrades;
                });

                cy.getTotalTradesFromDb().then((count) => {
                    dbTotal = count;
                });

                cy.then(() => {
                    expect(apiTotal).to.eq(dbTotal);
                    cy.log(`✅ API and DB counts match: ${apiTotal}`);
                });
            });
        });

        describe("Win Count Impact", () => {
            it("should increment totalWins when creating profit trade", () => {
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

                cy.AddTrade(request).then((response) => {
                    expect(response.status).to.eq(201);
                    tradeId = response.body.trade.id;
                    userId = response.body.trade.user_id;
                    cy.log(`Created test trade ID: ${tradeId}`);
                });

                cy.GetTradeSummary().then((response) => {
                    const newWins = response.body.data.totalWins;

                    expect(newWins).to.eq(initialWins + 1);
                    cy.log(`✅ Wins increased: ${initialWins} → ${newWins}`);
                });
            });

            it("should NOT increment totalWins when creating loss trade", () => {
                let initialWins;

                cy.GetTradeSummary().then((response) => {
                    initialWins = response.body.data.totalWins;
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

                cy.AddTrade(request).then((response) => {
                    expect(response.status).to.eq(201);
                    tradeId = response.body.trade.id;
                    userId = response.body.trade.user_id;
                    cy.log(`Created test trade ID: ${tradeId}`);
                });

                cy.GetTradeSummary().then((response) => {
                    const newWins = response.body.data.totalWins;

                    expect(newWins).to.eq(initialWins);
                    cy.log(`✅ Wins unchanged: ${initialWins}`);
                });
            });
        });

        describe("Loss Count Impact", () => {
            it("should increment totalLosses when creating loss trade", () => {
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

                cy.AddTrade(request).then((response) => {
                    expect(response.status).to.eq(201);
                    tradeId = response.body.trade.id;
                    userId = response.body.trade.user_id;
                    cy.log(`Created test trade ID: ${tradeId}`);
                });

                cy.GetTradeSummary().then((response) => {
                    const newLosses = response.body.data.totalLosses;

                    expect(newLosses).to.eq(initialLosses + 1);
                    cy.log(
                        `✅ Losses increased: ${initialLosses} → ${newLosses}`,
                    );
                });
            });

            it("should NOT increment totalLosses when creating profit trade", () => {
                let initialLosses;

                cy.GetTradeSummary().then((response) => {
                    initialLosses = response.body.data.totalLosses;
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

                cy.AddTrade(request).then((response) => {
                    expect(response.status).to.eq(201);
                    tradeId = response.body.trade.id;
                    userId = response.body.trade.user_id;
                    cy.log(`Created test trade ID: ${tradeId}`);
                });

                cy.GetTradeSummary().then((response) => {
                    const newLosses = response.body.data.totalLosses;

                    expect(newLosses).to.eq(initialLosses);
                    cy.log(`✅ Losses unchanged: ${initialLosses}`);
                });
            });
        });

        describe("Win Rate Calculation Impact", () => {
            it("should recalculate win rate after adding win trade", () => {
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

                cy.AddTrade(request).then((response) => {
                    expect(response.status).to.eq(201);
                    tradeId = response.body.trade.id;
                    userId = response.body.trade.user_id;
                    cy.log(`Created test trade ID: ${tradeId}`);
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
            it("should add new stock type to summary when created", () => {
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

                cy.AddTrade(request).then((response) => {
                    expect(response.status).to.eq(201);
                    tradeId = response.body.trade.id;
                    userId = response.body.trade.user_id;
                    cy.log(`Created test trade ID: ${tradeId}`);
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
            it("should update entry session summary when trade created", () => {
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

                cy.AddTrade(request).then((response) => {
                    expect(response.status).to.eq(201);
                    tradeId = response.body.trade.id;
                    userId = response.body.trade.user_id;
                    cy.log(`Created test trade ID: ${tradeId}`);
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

                cy.AddTrade(request).then((response) => {
                    expect(response.status).to.eq(201);
                    tradeId = response.body.trade.id;
                    userId = response.body.trade.user_id;
                    cy.log(`Created test trade ID: ${tradeId}`);
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
            it("should update all metrics for PROFIT trade", () => {
                let initialSummary;

                cy.GetTradeSummary().then((response) => {
                    initialSummary = response.body.data;
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

                cy.AddTrade(request).then((response) => {
                    expect(response.status).to.eq(201);
                });

                cy.wait(500);

                cy.GetTradeSummary().then((response) => {
                    const newSummary = response.body.data;

                    expect(newSummary.totalTrades).to.eq(
                        initialSummary.totalTrades + 1,
                    );
                    expect(newSummary.totalWins).to.eq(
                        initialSummary.totalWins + 1,
                    );
                    expect(newSummary.totalLosses).to.eq(
                        initialSummary.totalLosses,
                    );

                    const stock = request.stock_type_option;
                    const session = request.entry_session_option;
                    const occasion = request.entry_occasion_option;

                    expect(newSummary.stockTypeSummary[stock]).to.eq(
                        (initialSummary.stockTypeSummary[stock] || 0) + 1,
                    );
                    expect(newSummary.entrySessionSummary[session]).to.eq(
                        (initialSummary.entrySessionSummary[session] || 0) + 1,
                    );
                    expect(newSummary.entryOccasionSummary[occasion]).to.eq(
                        (initialSummary.entryOccasionSummary[occasion] || 0) +
                            1,
                    );

                    cy.log("✅ All metrics updated for profit trade");
                });
            });

            it("should update all metrics for LOSS trade", () => {
                let initialSummary;

                cy.GetTradeSummary().then((response) => {
                    initialSummary = response.body.data;
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

                cy.AddTrade(request).then((response) => {
                    expect(response.status).to.eq(201);
                });

                cy.wait(500);

                cy.GetTradeSummary().then((response) => {
                    const newSummary = response.body.data;

                    expect(newSummary.totalTrades).to.eq(
                        initialSummary.totalTrades + 1,
                    );
                    expect(newSummary.totalWins).to.eq(
                        initialSummary.totalWins,
                    );
                    expect(newSummary.totalLosses).to.eq(
                        initialSummary.totalLosses + 1,
                    );

                    const stock = request.stock_type_option;
                    const session = request.entry_session_option;
                    const occasion = request.entry_occasion_option;

                    expect(newSummary.stockTypeSummary[stock]).to.eq(
                        (initialSummary.stockTypeSummary[stock] || 0) + 1,
                    );
                    expect(newSummary.entrySessionSummary[session]).to.eq(
                        (initialSummary.entrySessionSummary[session] || 0) + 1,
                    );
                    expect(newSummary.entryOccasionSummary[occasion]).to.eq(
                        (initialSummary.entryOccasionSummary[occasion] || 0) +
                            1,
                    );

                    cy.log("✅ All metrics updated for loss trade");
                });
            });
        });
    });
});

describe("Add Trade Form - UI Tests", () => {
    describe("Desktop View", () => {
        beforeEach(() => {
            cy.viewport(1280, 720);
            cy.loginWithBypass();
            cy.visit("/main/trading/trade");
            cy.wait(1000);
        });
        describe("Dialog Behavior", () => {
            it("should open dialog when Add Trade button is clicked", () => {
                cy.get("#addNewTradeForm_tradePage").should("not.exist");
                cy.get("#addNewTradeBtn_tradePage")
                    .should("be.visible")
                    .click();
                cy.get("#addNewTradeForm_tradePage").should("be.visible");
            });

            it("should close dialog when Cancel button is clicked", () => {
                cy.get("#addNewTradeBtn_tradePage").click();
                cy.wait(1000);
                cy.get("#addNewTradeForm_tradePage").should("be.visible");
                cy.get("#cancelNewTradeBtn_tradePage").click();
                cy.get("#addNewTradeForm_tradePage").should("not.exist");
            });

            it("should close dialog when clicking outside", () => {
                cy.get("#addNewTradeBtn_tradePage").click();
                cy.wait(1000);
                cy.get("#addNewTradeForm_tradePage").should("be.visible");
                cy.get("body").click(0, 0, { force: true });
                cy.get("#addNewTradeForm_tradePage").should("not.exist");
            });

            it("should show loading state while fetching options", () => {
                cy.get("#addNewTradeBtn_tradePage").click();
                cy.get("#loadingOptionsContainer_tradePage").should(
                    "be.visible",
                );
            });
        });

        describe("Required Fields Validation", () => {
            beforeEach(() => {
                cy.get("#addNewTradeBtn_tradePage").click();
                cy.wait(1000);
            });

            it("should show error when ticker is empty", () => {
                cy.get("#submitNewTradeBtn_tradePage").click();
                cy.get("#tickerField_errorMessage_tradePage")
                    .should("be.visible")
                    .should("contain", "Ticker is required");
            });

            it("should show error when margin is empty", () => {
                cy.get("#tickerField_tradePage").type(
                    faker.word.noun(4).toUpperCase(),
                );
                cy.get("#submitNewTradeBtn_tradePage").click();
                cy.get("#marginField_errorMessage_tradePage")
                    .should("be.visible")
                    .should("contain", "required");
            });

            it("should show error when proceeds is empty", () => {
                cy.get("#tickerField_tradePage").type(
                    faker.word.noun(4).toUpperCase(),
                );
                cy.get("#marginField_tradePage").type("1000000");
                cy.get("#submitNewTradeBtn_tradePage").click();
                cy.get("#proceedsField_errorMessage_tradePage")
                    .should("be.visible")
                    .should("contain", "required");
            });
        });

        describe("Field Input Behavior", () => {
            beforeEach(() => {
                cy.get("#addNewTradeBtn_tradePage").click();
                cy.wait(1009);
            });

            it("should accept and format ticker in uppercase", () => {
                const ticker = faker.word.noun(4).toUpperCase();

                cy.get("#tickerField_tradePage").type(ticker);

                cy.get("#tickerField_tradePage").should("have.value", ticker);
            });

            it("should accept numeric input for margin", () => {
                const margin = faker.string.numeric(7);
                cy.get("#marginField_tradePage").type(margin);

                cy.get("#marginField_tradePage").should(
                    "have.value",
                    formatToRupiah(margin),
                );
            });

            it("should accept numeric input for proceeds", () => {
                const margin = faker.string.numeric(7);
                cy.get("#proceedsField_tradePage").type(margin);

                cy.get("#proceedsField_tradePage").should(
                    "have.value",
                    formatToRupiah(margin),
                );
            });

            it("should accept text in notes field", () => {
                const notes = faker.word.words(10);

                cy.get("#notesField_tradePage").type(notes);

                cy.get("#notesField_tradePage").should("have.value", notes);
            });
        });

        describe("Trade Date Picker", () => {
            beforeEach(() => {
                cy.get("#addNewTradeBtn_tradePage").click();
                cy.wait(1000);
            });

            it("should open calendar when date field is clicked", () => {
                cy.get("#tradeDateField_tradePage").click();
                cy.get("#tradeDatePicker_tradePage").should("be.visible");
            });

            it("should select a date from calendar", () => {
                cy.get("#tradeDateField_tradePage").click();
                cy.get("#tradeDatePicker_tradePage")
                    .contains("button", "15")
                    .click();
                cy.get("#tradeDateField_tradePage").should(
                    "not.contain",
                    "Pick a date",
                );
            });

            it("should display selected date in correct format", () => {
                cy.get("#tradeDateField_tradePage").click();
                cy.get("#tradeDatePicker_tradePage")
                    .contains("button", "10")
                    .click();
                cy.get("#tradeDateField_tradePage")
                    .should("not.contain", "Pick a date")
                    .should("contain", "2026");
            });

            it("should format large numbers correctly", () => {
                const largeValue = "50000000";

                cy.get("#marginField_tradePage").type(largeValue);

                cy.get("#marginField_tradePage").should(
                    "have.value",
                    formatToRupiah(largeValue),
                );
            });

            it("should handle different value ranges", () => {
                const testCases = [
                    { input: "100000", expected: formatToRupiah("100000") },
                    { input: "5000000", expected: formatToRupiah("5000000") },
                    { input: "25000000", expected: formatToRupiah("25000000") },
                    {
                        input: "100000000",
                        expected: formatToRupiah("100000000"),
                    },
                ];

                testCases.forEach(({ input, expected }) => {
                    cy.get("#marginField_tradePage").clear().type(input);

                    cy.get("#marginField_tradePage").should(
                        "have.value",
                        expected,
                    );
                });
            });
        });

        describe("Auto-Calculation", () => {
            beforeEach(() => {
                cy.get("#addNewTradeBtn_tradePage").click();
                cy.wait(500);
            });

            it("should calculate realized gain automatically", () => {
                cy.get("#marginField_tradePage").type("1000000");
                cy.get("#proceedsField_tradePage").type("1200000");
                cy.wait(300);
                cy.get("#realizedGainValue_realizedGainField_tradePage")
                    .should("have.value", "Rp. 200.000")
                    .should("be.disabled");
            });

            it("should calculate return percentage automatically", () => {
                cy.get("#marginField_tradePage").type("1000000");
                cy.get("#proceedsField_tradePage").type("1200000");
                cy.wait(300);
                cy.get("#returnPercentValue_returnPercentField_tradePage")
                    .should("have.value", "20.00%")
                    .should("be.disabled");
            });

            it("should calculate negative gain for loss trades", () => {
                cy.get("#marginField_tradePage").type("1000000");
                cy.get("#proceedsField_tradePage").type("800000");
                cy.wait(300);
                cy.get("#realizedGainValue_realizedGainField_tradePage")
                    .invoke("val")
                    .should("include", "Rp. -200.000");
            });

            it("should calculate negative return percentage for losses", () => {
                cy.get("#marginField_tradePage").type("1000000");
                cy.get("#proceedsField_tradePage").type("800000");
                cy.wait(300);
                cy.get("#returnPercentValue_returnPercentField_tradePage")
                    .invoke("val")
                    .should("include", "-20.00%");
            });

            it("should update calculations when values change", () => {
                cy.get("#marginField_tradePage").type("1000000");
                cy.get("#proceedsField_tradePage").type("1200000");
                cy.wait(300);
                cy.get("#proceedsField_tradePage").clear().type("1500000");
                cy.wait(300);
                cy.get("#realizedGainValue_realizedGainField_tradePage").should(
                    "have.value",
                    "Rp. 500.000",
                );
            });

            it("should clear calculations when fields are empty", () => {
                cy.get("#marginField_tradePage").type("1000000");
                cy.get("#proceedsField_tradePage").type("1200000");
                cy.wait(300);
                cy.get("#marginField_tradePage").clear();
                cy.wait(300);
                cy.get("#realizedGainValue_realizedGainField_tradePage").should(
                    "have.value",
                    "Rp. 0",
                );
                cy.get(
                    "#returnPercentValue_returnPercentField_tradePage",
                ).should("have.value", "");
            });
        });
    });

    describe("Tablet View", () => {
        beforeEach(() => {
            cy.viewport(768, 1024);
            cy.loginWithBypass();
            cy.visit("/main/trading/trade");
            cy.wait(1000);
        });
        describe("Dialog Behavior", () => {
            it("should open dialog when Add Trade button is clicked", () => {
                cy.get("#addNewTradeForm_tradePage").should("not.exist");
                cy.get("#addNewTradeBtn_tradePage")
                    .should("be.visible")
                    .click();
                cy.get("#addNewTradeForm_tradePage").should("be.visible");
            });

            it("should close dialog when Cancel button is clicked", () => {
                cy.get("#addNewTradeBtn_tradePage").click();
                cy.wait(1000);
                cy.get("#addNewTradeForm_tradePage").should("be.visible");
                cy.get("#cancelNewTradeBtn_tradePage").click();
                cy.get("#addNewTradeForm_tradePage").should("not.exist");
            });

            it("should close dialog when clicking outside", () => {
                cy.get("#addNewTradeBtn_tradePage").click();
                cy.wait(1000);
                cy.get("#addNewTradeForm_tradePage").should("be.visible");
                cy.get("body").click(0, 0, { force: true });
                cy.get("#addNewTradeForm_tradePage").should("not.exist");
            });

            it("should show loading state while fetching options", () => {
                cy.get("#addNewTradeBtn_tradePage").click();
                cy.get("#loadingOptionsContainer_tradePage").should(
                    "be.visible",
                );
            });
        });

        describe("Required Fields Validation", () => {
            beforeEach(() => {
                cy.get("#addNewTradeBtn_tradePage").click();
                cy.wait(1000);
            });

            it("should show error when ticker is empty", () => {
                cy.get("#submitNewTradeBtn_tradePage").click();
                cy.get("#tickerField_errorMessage_tradePage")
                    .should("be.visible")
                    .should("contain", "Ticker is required");
            });

            it("should show error when margin is empty", () => {
                cy.get("#tickerField_tradePage").type(
                    faker.word.noun(4).toUpperCase(),
                );
                cy.get("#submitNewTradeBtn_tradePage").click();
                cy.get("#marginField_errorMessage_tradePage")
                    .should("be.visible")
                    .should("contain", "required");
            });

            it("should show error when proceeds is empty", () => {
                cy.get("#tickerField_tradePage").type(
                    faker.word.noun(4).toUpperCase(),
                );
                cy.get("#marginField_tradePage").type("1000000");
                cy.get("#submitNewTradeBtn_tradePage").click();
                cy.get("#proceedsField_errorMessage_tradePage")
                    .should("be.visible")
                    .should("contain", "required");
            });
        });

        describe("Field Input Behavior", () => {
            beforeEach(() => {
                cy.get("#addNewTradeBtn_tradePage").click();
                cy.wait(1009);
            });

            it("should accept and format ticker in uppercase", () => {
                const ticker = faker.word.noun(4).toUpperCase();

                cy.get("#tickerField_tradePage").type(ticker);

                cy.get("#tickerField_tradePage").should("have.value", ticker);
            });

            it("should accept numeric input for margin", () => {
                const margin = faker.string.numeric(7);
                cy.get("#marginField_tradePage").type(margin);

                cy.get("#marginField_tradePage").should(
                    "have.value",
                    formatToRupiah(margin),
                );
            });

            it("should accept numeric input for proceeds", () => {
                const margin = faker.string.numeric(7);
                cy.get("#proceedsField_tradePage").type(margin);

                cy.get("#proceedsField_tradePage").should(
                    "have.value",
                    formatToRupiah(margin),
                );
            });

            it("should accept text in notes field", () => {
                const notes = faker.word.words(10);

                cy.get("#notesField_tradePage").type(notes);

                cy.get("#notesField_tradePage").should("have.value", notes);
            });
        });

        describe("Trade Date Picker", () => {
            beforeEach(() => {
                cy.get("#addNewTradeBtn_tradePage").click();
                cy.wait(1000);
            });

            it("should open calendar when date field is clicked", () => {
                cy.get("#tradeDateField_tradePage").click();
                cy.get("#tradeDatePicker_tradePage").should("be.visible");
            });

            it("should select a date from calendar", () => {
                cy.get("#tradeDateField_tradePage").click();
                cy.get("#tradeDatePicker_tradePage")
                    .contains("button", "15")
                    .click();
                cy.get("#tradeDateField_tradePage").should(
                    "not.contain",
                    "Pick a date",
                );
            });

            it("should display selected date in correct format", () => {
                cy.get("#tradeDateField_tradePage").click();
                cy.get("#tradeDatePicker_tradePage")
                    .contains("button", "10")
                    .click();
                cy.get("#tradeDateField_tradePage")
                    .should("not.contain", "Pick a date")
                    .should("contain", "2026");
            });

            it("should format large numbers correctly", () => {
                const largeValue = "50000000";

                cy.get("#marginField_tradePage").type(largeValue);

                cy.get("#marginField_tradePage").should(
                    "have.value",
                    formatToRupiah(largeValue),
                );
            });

            it("should handle different value ranges", () => {
                const testCases = [
                    { input: "100000", expected: formatToRupiah("100000") },
                    { input: "5000000", expected: formatToRupiah("5000000") },
                    { input: "25000000", expected: formatToRupiah("25000000") },
                    {
                        input: "100000000",
                        expected: formatToRupiah("100000000"),
                    },
                ];

                testCases.forEach(({ input, expected }) => {
                    cy.get("#marginField_tradePage").clear().type(input);

                    cy.get("#marginField_tradePage").should(
                        "have.value",
                        expected,
                    );
                });
            });
        });

        describe("Auto-Calculation", () => {
            beforeEach(() => {
                cy.get("#addNewTradeBtn_tradePage").click();
                cy.wait(500);
            });

            it("should calculate realized gain automatically", () => {
                cy.get("#marginField_tradePage").type("1000000");
                cy.get("#proceedsField_tradePage").type("1200000");
                cy.wait(300);
                cy.get("#realizedGainValue_realizedGainField_tradePage")
                    .should("have.value", "Rp. 200.000")
                    .should("be.disabled");
            });

            it("should calculate return percentage automatically", () => {
                cy.get("#marginField_tradePage").type("1000000");
                cy.get("#proceedsField_tradePage").type("1200000");
                cy.wait(300);
                cy.get("#returnPercentValue_returnPercentField_tradePage")
                    .should("have.value", "20.00%")
                    .should("be.disabled");
            });

            it("should calculate negative gain for loss trades", () => {
                cy.get("#marginField_tradePage").type("1000000");
                cy.get("#proceedsField_tradePage").type("800000");
                cy.wait(300);
                cy.get("#realizedGainValue_realizedGainField_tradePage")
                    .invoke("val")
                    .should("include", "Rp. -200.000");
            });

            it("should calculate negative return percentage for losses", () => {
                cy.get("#marginField_tradePage").type("1000000");
                cy.get("#proceedsField_tradePage").type("800000");
                cy.wait(300);
                cy.get("#returnPercentValue_returnPercentField_tradePage")
                    .invoke("val")
                    .should("include", "-20.00%");
            });

            it("should update calculations when values change", () => {
                cy.get("#marginField_tradePage").type("1000000");
                cy.get("#proceedsField_tradePage").type("1200000");
                cy.wait(300);
                cy.get("#proceedsField_tradePage").clear().type("1500000");
                cy.wait(300);
                cy.get("#realizedGainValue_realizedGainField_tradePage").should(
                    "have.value",
                    "Rp. 500.000",
                );
            });

            it("should clear calculations when fields are empty", () => {
                cy.get("#marginField_tradePage").type("1000000");
                cy.get("#proceedsField_tradePage").type("1200000");
                cy.wait(300);
                cy.get("#marginField_tradePage").clear();
                cy.wait(300);
                cy.get("#realizedGainValue_realizedGainField_tradePage").should(
                    "have.value",
                    "Rp. 0",
                );
                cy.get(
                    "#returnPercentValue_returnPercentField_tradePage",
                ).should("have.value", "");
            });
        });
    });

    describe("Mobile View", () => {
        beforeEach(() => {
            cy.viewport(375, 667);
            cy.loginWithBypass();
            cy.visit("/main/trading/trade");
            cy.wait(1000);
        });
        describe("Dialog Behavior", () => {
            it("should open dialog when Add Trade button is clicked", () => {
                cy.get("#addNewTradeForm_tradePage").should("not.exist");
                cy.get("#addNewTradeBtn_tradePage")
                    .should("be.visible")
                    .click();
                cy.get("#addNewTradeForm_tradePage").should("be.visible");
            });

            it("should close dialog when Cancel button is clicked", () => {
                cy.get("#addNewTradeBtn_tradePage").click();
                cy.wait(1000);
                cy.get("#addNewTradeForm_tradePage").should("be.visible");
                cy.get("#cancelNewTradeBtn_tradePage").click();
                cy.get("#addNewTradeForm_tradePage").should("not.exist");
            });

            it("should close dialog when clicking outside", () => {
                cy.get("#addNewTradeBtn_tradePage").click();
                cy.wait(1000);
                cy.get("#addNewTradeForm_tradePage").should("be.visible");
                cy.get("body").click(0, 0, { force: true });
                cy.get("#addNewTradeForm_tradePage").should("not.exist");
            });

            it("should show loading state while fetching options", () => {
                cy.get("#addNewTradeBtn_tradePage").click();
                cy.get("#loadingOptionsContainer_tradePage").should(
                    "be.visible",
                );
            });
        });

        describe("Required Fields Validation", () => {
            beforeEach(() => {
                cy.get("#addNewTradeBtn_tradePage").click();
                cy.wait(1000);
            });

            it("should show error when ticker is empty", () => {
                cy.get("#submitNewTradeBtn_tradePage").click();
                cy.get("#tickerField_errorMessage_tradePage")
                    .should("be.visible")
                    .should("contain", "Ticker is required");
            });

            it("should show error when margin is empty", () => {
                cy.get("#tickerField_tradePage").type(
                    faker.word.noun(4).toUpperCase(),
                );
                cy.get("#submitNewTradeBtn_tradePage").click();
                cy.get("#marginField_errorMessage_tradePage")
                    .should("be.visible")
                    .should("contain", "required");
            });

            it("should show error when proceeds is empty", () => {
                cy.get("#tickerField_tradePage").type(
                    faker.word.noun(4).toUpperCase(),
                );
                cy.get("#marginField_tradePage").type("1000000");
                cy.get("#submitNewTradeBtn_tradePage").click();
                cy.get("#proceedsField_errorMessage_tradePage")
                    .should("be.visible")
                    .should("contain", "required");
            });
        });

        describe("Field Input Behavior", () => {
            beforeEach(() => {
                cy.get("#addNewTradeBtn_tradePage").click();
                cy.wait(1009);
            });

            it("should accept and format ticker in uppercase", () => {
                const ticker = faker.word.noun(4).toUpperCase();

                cy.get("#tickerField_tradePage").type(ticker);

                cy.get("#tickerField_tradePage").should("have.value", ticker);
            });

            it("should accept numeric input for margin", () => {
                const margin = faker.string.numeric(7);
                cy.get("#marginField_tradePage").type(margin);

                cy.get("#marginField_tradePage").should(
                    "have.value",
                    formatToRupiah(margin),
                );
            });

            it("should accept numeric input for proceeds", () => {
                const margin = faker.string.numeric(7);
                cy.get("#proceedsField_tradePage").type(margin);

                cy.get("#proceedsField_tradePage").should(
                    "have.value",
                    formatToRupiah(margin),
                );
            });

            it("should accept text in notes field", () => {
                const notes = faker.word.words(10);

                cy.get("#notesField_tradePage").type(notes);

                cy.get("#notesField_tradePage").should("have.value", notes);
            });
        });

        describe("Trade Date Picker", () => {
            beforeEach(() => {
                cy.get("#addNewTradeBtn_tradePage").click();
                cy.wait(1000);
            });

            it("should open calendar when date field is clicked", () => {
                cy.get("#tradeDateField_tradePage").click();
                cy.get("#tradeDatePicker_tradePage").should("be.visible");
            });

            it("should select a date from calendar", () => {
                cy.get("#tradeDateField_tradePage").click();
                cy.get("#tradeDatePicker_tradePage")
                    .contains("button", "15")
                    .click();
                cy.get("#tradeDateField_tradePage").should(
                    "not.contain",
                    "Pick a date",
                );
            });

            it("should display selected date in correct format", () => {
                cy.get("#tradeDateField_tradePage").click();
                cy.get("#tradeDatePicker_tradePage")
                    .contains("button", "10")
                    .click();
                cy.get("#tradeDateField_tradePage")
                    .should("not.contain", "Pick a date")
                    .should("contain", "2026");
            });

            it("should format large numbers correctly", () => {
                const largeValue = "50000000";

                cy.get("#marginField_tradePage").type(largeValue);

                cy.get("#marginField_tradePage").should(
                    "have.value",
                    formatToRupiah(largeValue),
                );
            });

            it("should handle different value ranges", () => {
                const testCases = [
                    { input: "100000", expected: formatToRupiah("100000") },
                    { input: "5000000", expected: formatToRupiah("5000000") },
                    { input: "25000000", expected: formatToRupiah("25000000") },
                    {
                        input: "100000000",
                        expected: formatToRupiah("100000000"),
                    },
                ];

                testCases.forEach(({ input, expected }) => {
                    cy.get("#marginField_tradePage").clear().type(input);

                    cy.get("#marginField_tradePage").should(
                        "have.value",
                        expected,
                    );
                });
            });
        });

        describe("Auto-Calculation", () => {
            beforeEach(() => {
                cy.get("#addNewTradeBtn_tradePage").click();
                cy.wait(500);
            });

            it("should calculate realized gain automatically", () => {
                cy.get("#marginField_tradePage").type("1000000");
                cy.get("#proceedsField_tradePage").type("1200000");
                cy.wait(300);
                cy.get("#realizedGainValue_realizedGainField_tradePage")
                    .should("have.value", "Rp. 200.000")
                    .should("be.disabled");
            });

            it("should calculate return percentage automatically", () => {
                cy.get("#marginField_tradePage").type("1000000");
                cy.get("#proceedsField_tradePage").type("1200000");
                cy.wait(300);
                cy.get("#returnPercentValue_returnPercentField_tradePage")
                    .should("have.value", "20.00%")
                    .should("be.disabled");
            });

            it("should calculate negative gain for loss trades", () => {
                cy.get("#marginField_tradePage").type("1000000");
                cy.get("#proceedsField_tradePage").type("800000");
                cy.wait(300);
                cy.get("#realizedGainValue_realizedGainField_tradePage")
                    .invoke("val")
                    .should("include", "Rp. -200.000");
            });

            it("should calculate negative return percentage for losses", () => {
                cy.get("#marginField_tradePage").type("1000000");
                cy.get("#proceedsField_tradePage").type("800000");
                cy.wait(300);
                cy.get("#returnPercentValue_returnPercentField_tradePage")
                    .invoke("val")
                    .should("include", "-20.00%");
            });

            it("should update calculations when values change", () => {
                cy.get("#marginField_tradePage").type("1000000");
                cy.get("#proceedsField_tradePage").type("1200000");
                cy.wait(300);
                cy.get("#proceedsField_tradePage").clear().type("1500000");
                cy.wait(300);
                cy.get("#realizedGainValue_realizedGainField_tradePage").should(
                    "have.value",
                    "Rp. 500.000",
                );
            });

            it("should clear calculations when fields are empty", () => {
                cy.get("#marginField_tradePage").type("1000000");
                cy.get("#proceedsField_tradePage").type("1200000");
                cy.wait(300);
                cy.get("#marginField_tradePage").clear();
                cy.wait(300);
                cy.get("#realizedGainValue_realizedGainField_tradePage").should(
                    "have.value",
                    "Rp. 0",
                );
                cy.get(
                    "#returnPercentValue_returnPercentField_tradePage",
                ).should("have.value", "");
            });
        });
    });
});
