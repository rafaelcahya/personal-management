import { faker } from "@faker-js/faker";

describe("Trade List API - GET /api/trade/list", () => {
    let testUserId;
    let testTradeIds = [];
    let testTradesData = [];

    const request = () => ({
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
    });

    before(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.setupApiAuthCookies();

        Cypress._.times(3, () => {
            cy.AddTrade(request()).then((response) => {
                expect(response.body.success).to.be.true;
                expect(response.status).to.eq(201);

                const trade = response.body.trade;
                testUserId = trade.user_id;
                testTradeIds.push(trade.id);
                testTradesData.push(trade);
            });
        });
    });

    beforeEach(() => {
        cy.setupApiAuthCookies();
    });

    it("should return 200 with trades list for authenticated user", () => {
        cy.GetListTrade().then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.success).to.be.true;
            expect(response.body.trades).to.be.an("array");
            expect(response.body.trades.length).to.be.gte(testTradeIds.length);
            testTradeIds.forEach((id) => {
                expect(response.body.trades.some((t) => t.id === id)).to.be
                    .true;
            });
        });
    });

    it("should return only authenticated user's trades", () => {
        cy.GetListTrade().then((response) => {
            response.body.trades.forEach((trade) => {
                expect(trade.user_id).to.eq(testUserId);
            });
        });
    });

    it("should sort trades by trade_date DESC", () => {
        cy.GetListTrade().then((response) => {
            const trades = response.body.trades;
            for (let i = 0; i < trades.length - 1; i++) {
                const date1 = new Date(trades[i].trade_date);
                const date2 = new Date(trades[i + 1].trade_date);
                expect(date1.getTime()).to.gte(date2.getTime());
            }
        });
    });

    it("should return 401 Unauthorized without auth", () => {
        cy.clearCookies();
        cy.GetListTradeNoAuth().then((response) => {
            expect(response.status).to.be.oneOf([401, 307]);
            if (response.status === 401) {
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.eq("Unauthorized");
            }
        });
    });

    it("should return correct response structure", () => {
        cy.GetListTrade().then((response) => {
            expect(response.body).to.have.all.keys("success", "trades");
            expect(response.body.success).to.be.a("boolean");
            expect(response.body.trades).to.be.an("array");

            if (response.body.trades.length > 0) {
                const trade = response.body.trades[0];
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
            }
        });
    });

    it("should respond within 1000ms", () => {
        const start = Date.now();
        cy.GetListTrade().then(() => {
            const duration = Date.now() - start;
            expect(duration).to.be.lte(1000);
            cy.log(`Response time: ${duration}ms`);
        });
    });
});
