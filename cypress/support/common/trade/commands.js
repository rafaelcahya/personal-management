import { randomString } from "../helper";

Cypress.Commands.add("AddNewTrade", () => {
    const date = new Date().toISOString().replace("Z", "+00:00");
    const text = randomString(4, "text").toUpperCase();
    const number = randomString(5, "number");
    const uuid = crypto.randomUUID();

    return cy
        .request({
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
        })
        .then((response) => {
            return response.body.trade;
        });
});

Cypress.Commands.add("DeleteTrade", (id) => {
    return cy
        .request({
            method: "DELETE",
            url: `/api/trade/delete/${id}`,
            failOnStatusCode: false,
        })
        .then((response) => {
            expect(response.status).to.eq(200);
        });
});

Cypress.Commands.add(
    "UpdateTrade",
    (
        id,
        trade_date,
        ticker,
        margin,
        proceeds,
        return_percent,
        realized_gain,
        entry_session_option,
        entry_occasion_option,
        buy_reason_option,
        sell_reason_option,
        stock_type_option
    ) => {
        const uuid = crypto.randomUUID();
        return cy
            .request({
                method: "PUT",
                url: `/api/trade/update/${id}`,
                body: {
                    trade_date: trade_date,
                    ticker: ticker,
                    margin: margin,
                    proceeds: proceeds,
                    return_percent: return_percent,
                    realized_gain: realized_gain,
                    entry_session_option: entry_session_option,
                    entry_occasion_option: entry_occasion_option,
                    buy_reason_option: buy_reason_option,
                    sell_reason_option: sell_reason_option,
                    stock_type_option: stock_type_option,
                    notes: "updated by automation",
                    uuid: uuid,
                },
                failOnStatusCode: false,
            })
            .then((response) => {
                return response;
            });
    }
);

Cypress.Commands.add("GetTradeSummary", () => {
    return cy
        .request({
            method: "GET",
            url: "/api/trade/summary",
            failOnStatusCode: false,
        })
        .then((response) => {
            return response.body.data;
        });
});
