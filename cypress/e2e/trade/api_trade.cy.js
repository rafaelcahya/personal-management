import { randomString } from "../../support/common/helper";

describe("Trade API", () => {
    it("should successfully add new trade", () => {
        const date = new Date().toISOString().replace("Z", "+00:00");
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
            cy.task("saveTradeId", apiTrade.id);
        });
    });

    it("should ensure deleted_at is null after successfully adding a new trade", () => {
        const date = new Date().toISOString().replace("Z", "+00:00");
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

    it("should successfully update trade", () => {
        const date = new Date().toISOString().replace("Z", "+00:00");
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
                expect(response.body).to.have.property("success", true);

                const apiTrade = response.body.trade;

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
        });
    });

    it("should ensure deleted_at is null after successfully updating a trade", () => {
        const date = new Date().toISOString().replace("Z", "+00:00");
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
        cy.AddNewTrade().then((response) => {
            const apiTrade = response.body.trade;

            cy.request({
                method: "DELETE",
                url: `/api/trade/delete/${apiTrade.id}`,
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property("success", true);

                cy.task("getTradeFromDbTask", apiTrade.id).then((dbUser) => {
                    expect(dbUser).to.be.null;
                });
            });
        });
    });
});
