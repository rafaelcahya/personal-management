describe("Trade Summary API and Database Comparison", () => {
    describe("Trade Summary API", () => {
        beforeEach(() => {
            cy.clearCookies();
            cy.clearLocalStorage();
            cy.setupApiAuthCookies();
        });

        describe("Authentication & Authorization", () => {
            it("should return 307 redirect when user is not authenticated", () => {
                cy.clearApiAuth();
                cy.GetTradeSummaryNoAuth().then((response) => {
                    expect(response.status).to.eq(307);

                    const location = response.headers.location || response.body;
                    expect(String(location)).to.include("/login");
                });
            });

            it("should return 200 when user is authenticated", () => {
                cy.GetTradeSummary().then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body.success).to.be.true;
                    expect(response.body.data).to.exist;
                });
            });
        });

        describe("Response Structure", () => {
            it("should return correct response structure", () => {
                cy.GetTradeSummary().then((response) => {
                    expect(response.body).to.have.property("success");
                    expect(response.body).to.have.property("data");
                    expect(response.body.success).to.be.true;
                });
            });

            it("should return all required data fields", () => {
                cy.GetTradeSummary().then((response) => {
                    const { data } = response.body;

                    expect(data).to.have.all.keys(
                        "totalTrades",
                        "totalWins",
                        "totalLosses",
                        "stockTypeSummary",
                        "entrySessionSummary",
                        "entryOccasionSummary",
                    );
                });
            });

            it("should return correct data types for all fields", () => {
                cy.GetTradeSummary().then((response) => {
                    const { data } = response.body;

                    expect(data.totalTrades).to.be.a("number");
                    expect(data.totalWins).to.be.a("number");
                    expect(data.totalLosses).to.be.a("number");
                    expect(data.stockTypeSummary).to.be.an("object");
                    expect(data.entrySessionSummary).to.be.an("object");
                    expect(data.entryOccasionSummary).to.be.an("object");
                });
            });

            it("should have non-negative numeric values", () => {
                cy.GetTradeSummary().then((response) => {
                    const { data } = response.body;

                    expect(data.totalTrades).to.be.at.least(0);
                    expect(data.totalWins).to.be.at.least(0);
                    expect(data.totalLosses).to.be.at.least(0);
                });
            });

            it("should return valid JSON content-type", () => {
                cy.GetTradeSummary().then((response) => {
                    expect(response.headers["content-type"]).to.include(
                        "application/json",
                    );
                });
            });
        });

        describe("Business Logic Validation", () => {
            it("wins + losses should not exceed total trades", () => {
                cy.GetTradeSummary().then((response) => {
                    const { data } = response.body;

                    const calculatedSum = data.totalWins + data.totalLosses;
                    expect(calculatedSum).to.be.at.most(data.totalTrades);

                    cy.log(`Total: ${data.totalTrades}`);
                    cy.log(
                        `Wins: ${data.totalWins}, Losses: ${data.totalLosses}`,
                    );
                });
            });

            it("should calculate breakeven trades correctly", () => {
                cy.GetTradeSummary().then((response) => {
                    const { data } = response.body;

                    const breakeven =
                        data.totalTrades - (data.totalWins + data.totalLosses);
                    expect(breakeven).to.be.at.least(0);

                    cy.log(`Breakeven trades: ${breakeven}`);
                });
            });

            it("stockTypeSummary counts should sum to totalTrades", () => {
                cy.GetTradeSummary().then((response) => {
                    const { data } = response.body;

                    if (data.totalTrades > 0) {
                        const stockTypeSum = Object.values(
                            data.stockTypeSummary,
                        ).reduce((sum, count) => sum + count, 0);

                        expect(stockTypeSum).to.eq(data.totalTrades);
                    }
                });
            });

            it("entrySessionSummary counts should sum to totalTrades", () => {
                cy.GetTradeSummary().then((response) => {
                    const { data } = response.body;

                    if (data.totalTrades > 0) {
                        const sessionSum = Object.values(
                            data.entrySessionSummary,
                        ).reduce((sum, count) => sum + count, 0);

                        expect(sessionSum).to.eq(data.totalTrades);
                    }
                });
            });

            it("entryOccasionSummary counts should sum to totalTrades", () => {
                cy.GetTradeSummary().then((response) => {
                    const { data } = response.body;

                    if (data.totalTrades > 0) {
                        const occasionSum = Object.values(
                            data.entryOccasionSummary,
                        ).reduce((sum, count) => sum + count, 0);

                        expect(occasionSum).to.eq(data.totalTrades);
                    }
                });
            });

            it("summary objects should only contain positive integers", () => {
                cy.GetTradeSummary().then((response) => {
                    const { data } = response.body;

                    Object.values(data.stockTypeSummary).forEach((count) => {
                        expect(count).to.be.a("number");
                        expect(count).to.be.at.least(1);
                        expect(Number.isInteger(count)).to.be.true;
                    });

                    Object.values(data.entrySessionSummary).forEach((count) => {
                        expect(count).to.be.a("number");
                        expect(count).to.be.at.least(1);
                        expect(Number.isInteger(count)).to.be.true;
                    });

                    Object.values(data.entryOccasionSummary).forEach(
                        (count) => {
                            expect(count).to.be.a("number");
                            expect(count).to.be.at.least(1);
                            expect(Number.isInteger(count)).to.be.true;
                        },
                    );
                });
            });

            it("summary keys should be non-empty strings", () => {
                cy.GetTradeSummary().then((response) => {
                    const { data } = response.body;

                    if (data.totalTrades > 0) {
                        Object.keys(data.stockTypeSummary).forEach((key) => {
                            expect(key).to.be.a("string");
                            expect(key.length).to.be.greaterThan(0);
                        });

                        Object.keys(data.entrySessionSummary).forEach((key) => {
                            expect(key).to.be.a("string");
                            expect(key.length).to.be.greaterThan(0);
                        });

                        Object.keys(data.entryOccasionSummary).forEach(
                            (key) => {
                                expect(key).to.be.a("string");
                                expect(key.length).to.be.greaterThan(0);
                            },
                        );
                    }
                });
            });
        });

        describe("Edge Cases & Data Scenarios", () => {
            it("should handle user with no trades", () => {
                cy.GetTradeSummary().then((response) => {
                    const { data } = response.body;

                    if (data.totalTrades === 0) {
                        expect(data.totalWins).to.eq(0);
                        expect(data.totalLosses).to.eq(0);
                        expect(
                            Object.keys(data.stockTypeSummary),
                        ).to.have.length(0);
                        expect(
                            Object.keys(data.entrySessionSummary),
                        ).to.have.length(0);
                        expect(
                            Object.keys(data.entryOccasionSummary),
                        ).to.have.length(0);
                    }
                });
            });

            it("should handle user with only winning trades", () => {
                cy.GetTradeSummary().then((response) => {
                    const { data } = response.body;

                    if (data.totalLosses === 0 && data.totalTrades > 0) {
                        expect(data.totalWins).to.be.greaterThan(0);
                        expect(data.totalWins).to.be.at.most(data.totalTrades);
                    }
                });
            });

            it("should handle user with only losing trades", () => {
                cy.GetTradeSummary().then((response) => {
                    const { data } = response.body;

                    if (data.totalWins === 0 && data.totalTrades > 0) {
                        expect(data.totalLosses).to.be.greaterThan(0);
                        expect(data.totalLosses).to.be.at.most(
                            data.totalTrades,
                        );
                    }
                });
            });

            it("should handle user with mixed trade results", () => {
                cy.GetTradeSummary().then((response) => {
                    const { data } = response.body;

                    if (data.totalWins > 0 && data.totalLosses > 0) {
                        expect(data.totalWins + data.totalLosses).to.be.at.most(
                            data.totalTrades,
                        );

                        const winRate =
                            (data.totalWins / data.totalTrades) * 100;
                        cy.log(`Win rate: ${winRate.toFixed(2)}%`);
                    }
                });
            });
        });

        describe("Performance", () => {
            it("should respond within acceptable time (<2s)", () => {
                const startTime = Date.now();

                cy.GetTradeSummary().then((response) => {
                    const duration = Date.now() - startTime;

                    expect(response.status).to.eq(200);
                    expect(duration).to.be.lessThan(2000);

                    cy.log(`Response time: ${duration}ms`);
                });
            });

            it("should handle multiple sequential requests", () => {
                cy.GetTradeSummary().then((response1) => {
                    expect(response1.status).to.eq(200);

                    cy.GetTradeSummary().then((response2) => {
                        expect(response2.status).to.eq(200);

                        cy.GetTradeSummary().then((response3) => {
                            expect(response3.status).to.eq(200);

                            // All responses should have same structure
                            expect(response1.body.data).to.have.all.keys(
                                response2.body.data,
                            );
                        });
                    });
                });
            });
        });

        describe("Data Consistency", () => {
            it("should return consistent data across multiple requests", () => {
                let firstData;

                cy.GetTradeSummary().then((response) => {
                    firstData = response.body.data;
                });

                cy.GetTradeSummary().then((response) => {
                    const secondData = response.body.data;
                    expect(secondData).to.deep.equal(firstData);
                });
            });

            it("should match calculated totals with provided totals", () => {
                cy.GetTradeSummary().then((response) => {
                    const { data } = response.body;

                    if (data.totalTrades > 0) {
                        const stockTypeTotal = Object.values(
                            data.stockTypeSummary,
                        ).reduce((sum, val) => sum + val, 0);

                        const sessionTotal = Object.values(
                            data.entrySessionSummary,
                        ).reduce((sum, val) => sum + val, 0);

                        const occasionTotal = Object.values(
                            data.entryOccasionSummary,
                        ).reduce((sum, val) => sum + val, 0);

                        expect(stockTypeTotal).to.eq(data.totalTrades);
                        expect(sessionTotal).to.eq(data.totalTrades);
                        expect(occasionTotal).to.eq(data.totalTrades);
                    }
                });
            });
        });
    });

    describe("Trade Summary API vs Database Comparison", () => {
        beforeEach(() => {
            cy.clearCookies();
            cy.clearLocalStorage();
            cy.setupApiAuthCookies();
        });

        describe("Total Counts Comparison", () => {
            it("API totalTrades should match database count", () => {
                let apiTotal, dbTotal;

                cy.GetTradeSummary().then((response) => {
                    apiTotal = response.body.data.totalTrades;
                    cy.log(`API totalTrades: ${apiTotal}`);
                });

                cy.getTotalTradesFromDb().then((count) => {
                    dbTotal = count;
                    cy.log(`DB totalTrades: ${dbTotal}`);

                    expect(apiTotal).to.eq(dbTotal);
                });
            });

            it("API totalWins should match database count", () => {
                let apiWins, dbWins;

                cy.GetTradeSummary().then((response) => {
                    apiWins = response.body.data.totalWins;
                    cy.log(`API totalWins: ${apiWins}`);
                });

                cy.getTotalWinsFromDb().then((count) => {
                    dbWins = count;
                    cy.log(`DB totalWins: ${dbWins}`);

                    expect(apiWins).to.eq(dbWins);
                });
            });

            it("API totalLosses should match database count", () => {
                let apiLosses, dbLosses;

                cy.GetTradeSummary().then((response) => {
                    apiLosses = response.body.data.totalLosses;
                    cy.log(`API totalLosses: ${apiLosses}`);
                });

                cy.getTotalLossesFromDb().then((count) => {
                    dbLosses = count;
                    cy.log(`DB totalLosses: ${dbLosses}`);

                    expect(apiLosses).to.eq(dbLosses);
                });
            });
        });

        describe("Stock Type Summary Comparison", () => {
            it("API stockTypeSummary should match database aggregation", () => {
                let apiSummary, dbSummary;

                cy.GetTradeSummary().then((response) => {
                    apiSummary = response.body.data.stockTypeSummary;
                    cy.log("API stockTypeSummary:", JSON.stringify(apiSummary));
                });

                cy.getStockTypeSummaryFromDb().then((summary) => {
                    dbSummary = summary;
                    cy.log("DB stockTypeSummary:", JSON.stringify(dbSummary));

                    expect(apiSummary).to.deep.equal(dbSummary);
                });
            });

            it("each stock type count should match database individually", () => {
                cy.GetTradeSummary().then((response) => {
                    const apiSummary = response.body.data.stockTypeSummary;

                    cy.getStockTypeSummaryFromDb().then((dbSummary) => {
                        const stockTypes = Object.keys(apiSummary);

                        stockTypes.forEach((stockType) => {
                            const apiCount = apiSummary[stockType];
                            const dbCount = dbSummary[stockType];

                            expect(dbCount, `Stock type: ${stockType}`).to
                                .exist;
                            expect(apiCount).to.eq(dbCount);

                            cy.log(
                                `✅ ${stockType}: API=${apiCount}, DB=${dbCount}`,
                            );
                        });
                    });
                });
            });
        });

        describe("Entry Session Summary Comparison", () => {
            it("API entrySessionSummary should match database aggregation", () => {
                let apiSummary, dbSummary;

                cy.GetTradeSummary().then((response) => {
                    apiSummary = response.body.data.entrySessionSummary;
                    cy.log(
                        "API entrySessionSummary:",
                        JSON.stringify(apiSummary),
                    );
                });

                cy.getEntrySessionSummaryFromDb().then((summary) => {
                    dbSummary = summary;
                    cy.log(
                        "DB entrySessionSummary:",
                        JSON.stringify(dbSummary),
                    );

                    expect(apiSummary).to.deep.equal(dbSummary);
                });
            });

            it("each entry session count should match database individually", () => {
                cy.GetTradeSummary().then((response) => {
                    const apiSummary = response.body.data.entrySessionSummary;

                    cy.getEntrySessionSummaryFromDb().then((dbSummary) => {
                        const sessions = Object.keys(apiSummary);

                        sessions.forEach((session) => {
                            const apiCount = apiSummary[session];
                            const dbCount = dbSummary[session];

                            expect(dbCount, `Entry session: ${session}`).to
                                .exist;
                            expect(apiCount).to.eq(dbCount);

                            cy.log(
                                `✅ ${session}: API=${apiCount}, DB=${dbCount}`,
                            );
                        });
                    });
                });
            });
        });

        describe("Entry Occasion Summary Comparison", () => {
            it("API entryOccasionSummary should match database aggregation", () => {
                let apiSummary, dbSummary;

                cy.GetTradeSummary().then((response) => {
                    apiSummary = response.body.data.entryOccasionSummary;
                    cy.log(
                        "API entryOccasionSummary:",
                        JSON.stringify(apiSummary),
                    );
                });

                cy.getEntryOccasionSummaryFromDb().then((summary) => {
                    dbSummary = summary;
                    cy.log(
                        "DB entryOccasionSummary:",
                        JSON.stringify(dbSummary),
                    );

                    expect(apiSummary).to.deep.equal(dbSummary);
                });
            });

            it("each entry occasion count should match database individually", () => {
                cy.GetTradeSummary().then((response) => {
                    const apiSummary = response.body.data.entryOccasionSummary;

                    cy.getEntryOccasionSummaryFromDb().then((dbSummary) => {
                        const occasions = Object.keys(apiSummary);

                        occasions.forEach((occasion) => {
                            const apiCount = apiSummary[occasion];
                            const dbCount = dbSummary[occasion];

                            expect(dbCount, `Entry occasion: ${occasion}`).to
                                .exist;
                            expect(apiCount).to.eq(dbCount);

                            cy.log(
                                `✅ ${occasion}: API=${apiCount}, DB=${dbCount}`,
                            );
                        });
                    });
                });
            });
        });

        describe("Complete Data Integrity Check", () => {
            it("all API data should perfectly match database source", () => {
                let apiData;

                cy.GetTradeSummary().then((response) => {
                    apiData = response.body.data;
                    cy.log("API Full Response:", JSON.stringify(apiData));
                });

                // Verify all counts
                cy.getTotalTradesFromDb().then((totalTrades) => {
                    expect(apiData.totalTrades, "Total Trades").to.eq(
                        totalTrades,
                    );
                });

                cy.getTotalWinsFromDb().then((totalWins) => {
                    expect(apiData.totalWins, "Total Wins").to.eq(totalWins);
                });

                cy.getTotalLossesFromDb().then((totalLosses) => {
                    expect(apiData.totalLosses, "Total Losses").to.eq(
                        totalLosses,
                    );
                });

                // Verify all summaries
                cy.getStockTypeSummaryFromDb().then((stockTypeSummary) => {
                    expect(
                        apiData.stockTypeSummary,
                        "Stock Type Summary",
                    ).to.deep.equal(stockTypeSummary);
                });

                cy.getEntrySessionSummaryFromDb().then(
                    (entrySessionSummary) => {
                        expect(
                            apiData.entrySessionSummary,
                            "Entry Session Summary",
                        ).to.deep.equal(entrySessionSummary);
                    },
                );

                cy.getEntryOccasionSummaryFromDb().then(
                    (entryOccasionSummary) => {
                        expect(
                            apiData.entryOccasionSummary,
                            "Entry Occasion Summary",
                        ).to.deep.equal(entryOccasionSummary);
                    },
                );
            });
        });
    });
});

describe("Trade List Summary - UI Tests", () => {
    beforeEach(() => {
        cy.loginWithBypass();
        cy.visit("/main/landing");
        cy.visit("/main/trading/trade");
        cy.wait(1000);
    });

    describe("Mobile Interaction (375x667)", () => {
        beforeEach(() => {
            cy.viewport(375, 667);
        });

        it("should hide desktop view and show collapsible on mobile", () => {
            cy.get("#tradeListSummaryDesktop_tradePage").should(
                "not.be.visible",
            );
            cy.get("#tradeSummaryCollapsible_tradePage").should("be.visible");
        });

        it("should display collapsed summary header by default", () => {
            cy.get("#tradeSummaryCollapsibleDefault_tradePage").should(
                "be.visible",
            );
            cy.get("#tradeSummaryCollapsibleContent_tradePage").should(
                "not.be.visible",
            );
        });

        it("should expand when trigger is clicked", () => {
            cy.get("#tradeSummaryCollapsibleContent_tradePage").should(
                "not.be.visible",
            );

            cy.get("#tradeSummaryCollapsibleTrigger_tradePage").click();
            cy.wait(300);

            cy.get("#tradeSummaryCollapsibleContent_tradePage").should(
                "be.visible",
            );
            cy.get("#totalTradesSummary_tradePage_mobileView").should(
                "be.visible",
            );
            cy.get("#winRateSummary_tradePage_mobileView").should("be.visible");
            cy.get("#totalProfitSummary_tradePage_mobileView").should(
                "be.visible",
            );
            cy.get("#netPnLSummary_tradePage_mobileView").should("be.visible");
        });

        it("should collapse when trigger is clicked again", () => {
            cy.get("#tradeSummaryCollapsibleTrigger_tradePage").click();
            cy.wait(300);
            cy.get("#tradeSummaryCollapsibleContent_tradePage").should(
                "be.visible",
            );

            cy.get("#tradeSummaryCollapsibleTrigger_tradePage").click();
            cy.wait(300);
            cy.get("#tradeSummaryCollapsibleContent_tradePage").should(
                "not.be.visible",
            );
        });
    });

    describe("Tablet Interaction (768x1024)", () => {
        beforeEach(() => {
            cy.viewport(768, 1024);
        });

        it("should show desktop grid view on tablet", () => {
            cy.get("#tradeListSummaryDesktop_tradePage").should("be.visible");
            cy.get("#tradeSummaryCollapsible_tradePage").should(
                "not.be.visible",
            );
        });

        it("should display all 4 summary cards in grid", () => {
            cy.get("#totalTradesSummary_tradePage_desktopView").should(
                "be.visible",
            );
            cy.get("#winRateSummary_tradePage_desktopView").should(
                "be.visible",
            );
            cy.get("#totalProfitSummary_tradePage_desktopView").should(
                "be.visible",
            );
            cy.get("#netPnLSummary_tradePage_desktopView").should("be.visible");
        });
    });

    describe("Desktop Interaction (1280x720)", () => {
        beforeEach(() => {
            cy.viewport(1280, 720);
        });

        it("should show desktop grid view", () => {
            cy.get("#tradeListSummaryDesktop_tradePage").should("be.visible");
            cy.get("#tradeSummaryCollapsible_tradePage").should(
                "not.be.visible",
            );
        });

        it("should display all 4 summary cards", () => {
            cy.get("#totalTradesSummary_tradePage_desktopView").should(
                "be.visible",
            );
            cy.get("#winRateSummary_tradePage_desktopView").should(
                "be.visible",
            );
            cy.get("#totalProfitSummary_tradePage_desktopView").should(
                "be.visible",
            );
            cy.get("#netPnLSummary_tradePage_desktopView").should("be.visible");
        });
    });
});
