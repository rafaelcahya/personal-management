import { faker } from "@faker-js/faker";

describe("Fee Summary API and Database Comparison", () => {
    describe("Fee Summary API", () => {
        beforeEach(() => {
            cy.clearCookies();
            cy.clearLocalStorage();
            cy.setupApiAuthCookies();
        });

        describe("Authentication & Authorization", () => {
            it("should return 307 redirect when user is not authenticated", () => {
                cy.clearApiAuth();
                cy.GetFeeSummaryNoAuth().then((response) => {
                    expect(response.status).to.eq(307);

                    const location = response.headers.location || response.body;
                    expect(String(location)).to.include("/login");
                });
            });

            it("should return 200 when user is authenticated", () => {
                cy.GetFeeSummary().then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body.success).to.be.true;
                    expect(response.body.data).to.exist;
                });
            });
        });

        describe("Response Structure", () => {
            it("should return correct response structure", () => {
                cy.GetFeeSummary().then((response) => {
                    expect(response.body).to.have.property("success");
                    expect(response.body).to.have.property("data");
                    expect(response.body.success).to.be.true;
                });
            });

            it("should return all required data fields", () => {
                cy.GetFeeSummary().then((response) => {
                    const { data } = response.body;

                    expect(data).to.have.all.keys("feeCount", "totalFee");
                });
            });

            it("should return correct data types for all fields", () => {
                cy.GetFeeSummary().then((response) => {
                    const { data } = response.body;

                    expect(data.feeCount).to.be.a("number");
                    expect(data.totalFee).to.be.a("number");
                });
            });

            it("should have non-negative numeric values", () => {
                cy.GetFeeSummary().then((response) => {
                    const { data } = response.body;

                    expect(data.feeCount).to.be.at.least(0);
                    expect(data.totalFee).to.be.at.least(0);
                });
            });

            it("should return valid JSON content-type", () => {
                cy.GetFeeSummary().then((response) => {
                    expect(response.headers["content-type"]).to.include(
                        "application/json",
                    );
                });
            });
        });

        describe("Business Logic Validation", () => {
            it("summary objects should only contain positive integers", () => {
                cy.GetFeeSummary().then((response) => {
                    const { data } = response.body;

                    Object.values(data.feeCount).forEach((count) => {
                        expect(count).to.be.a("number");
                        expect(count).to.be.at.least(1);
                        expect(Number.isInteger(count)).to.be.true;
                    });

                    Object.values(data.totalFee).forEach((count) => {
                        expect(count).to.be.a("number");
                        expect(count).to.be.at.least(1);
                        expect(Number.isInteger(count)).to.be.true;
                    });
                });
            });
        });

        describe("Edge Cases & Data Scenarios", () => {
            it("should handle user with no fees", () => {
                cy.GetFeeSummary().then((response) => {
                    const { data } = response.body;

                    if (data.feeCount === 0) {
                        expect(data.totalFee).to.eq(0);
                        expect(data.totalLosses).to.eq(0);
                    }
                });
            });
        });

        describe("Performance", () => {
            it("should respond within acceptable time (<2s)", () => {
                const startTime = Date.now();

                cy.GetFeeSummary().then((response) => {
                    const duration = Date.now() - startTime;

                    expect(response.status).to.eq(200);
                    expect(duration).to.be.lessThan(2000);

                    cy.log(`Response time: ${duration}ms`);
                });
            });

            it("should handle multiple sequential requests", () => {
                cy.GetFeeSummary().then((response1) => {
                    expect(response1.status).to.eq(200);

                    cy.GetFeeSummary().then((response2) => {
                        expect(response2.status).to.eq(200);

                        cy.GetFeeSummary().then((response3) => {
                            expect(response3.status).to.eq(200);

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

                cy.GetFeeSummary().then((response) => {
                    firstData = response.body.data;
                });

                cy.GetFeeSummary().then((response) => {
                    const secondData = response.body.data;
                    expect(secondData).to.deep.equal(firstData);
                });
            });
        });
    });

    describe("Fee Summary API vs Database Comparison", () => {
        beforeEach(() => {
            cy.clearCookies();
            cy.clearLocalStorage();
            cy.setupApiAuthCookies();
        });

        describe("Total Counts Comparison", () => {
            it("API feeCount should match database count", () => {
                let apiTotal, dbTotal, userId;

                const request = {
                    fee_date: faker.date.recent().toISOString().split("T")[0],
                    fee: faker.string.numeric(5),
                    fee_name: faker.animal.snake(),
                };

                cy.AddFee(request).then((response) => {
                    expect(response.status).to.eq(201);
                    userId = response.body.fee.user_id;
                });

                cy.GetFeeSummary().then((response) => {
                    apiTotal = response.body.data.feeCount;
                    cy.log(`API feeCount: ${apiTotal}`);
                });

                cy.getTotalFeesFromDb(userId).then((count) => {
                    dbTotal = count;
                    cy.log(`DB feeCount: ${dbTotal}`);

                    expect(apiTotal).to.eq(dbTotal);
                });
            });

            it("API totalFee should match database count", () => {
                let apiWins, dbWins, userId;

                const request = {
                    fee_date: faker.date.recent().toISOString().split("T")[0],
                    fee: faker.string.numeric(5),
                    fee_name: faker.animal.snake(),
                };

                cy.AddFee(request).then((response) => {
                    expect(response.status).to.eq(201);
                    userId = response.body.fee.user_id;
                });

                cy.GetFeeSummary().then((response) => {
                    apiWins = response.body.data.totalFee;
                    cy.log(`API totalFee: ${apiWins}`);
                });

                cy.getTotalFeesPaidFromDb(userId).then((count) => {
                    dbWins = count;
                    cy.log(`DB totalFee: ${dbWins}`);

                    expect(apiWins).to.eq(dbWins);
                });
            });
        });

        describe("Complete Data Integrity Check", () => {
            it("all API data should perfectly match database source", () => {
                const request = {
                    fee_date: faker.date.recent().toISOString().split("T")[0],
                    fee: faker.string.numeric(5),
                    fee_name: faker.animal.snake(),
                };

                cy.AddFee(request).then((response) => {
                    expect(response.status).to.eq(201);
                });

                cy.GetFeeSummary().then((response) => {
                    expect(response.status).to.eq(200);
                    cy.wrap(response.body.data.feeCount).as("apiCount");
                    cy.wrap(response.body.data.totalFee).as("apiTotal");
                    cy.log(
                        "API Full Response:",
                        JSON.stringify(response.body.data),
                    );
                });

                cy.getTotalFeesFromDb().then((count) => {
                    cy.wrap(count).as("dbCount");
                    cy.log(`DB feeCount: ${count}`);
                });

                cy.getTotalFeesPaidFromDb().then((total) => {
                    cy.wrap(total).as("dbTotal");
                    cy.log(`DB totalFee: ${total}`);
                });

                cy.then(function () {
                    expect(this.apiCount, "feeCount").to.eq(this.dbCount);
                    expect(this.apiTotal, "totalFee").to.eq(this.dbTotal);
                    cy.log("✅ All API data matches database source");
                });
            });

        });
    });
});

describe("Fee List Summary - UI Tests", () => {
    beforeEach(() => {
        cy.loginWithBypass();
        cy.visit("/main/landing");
        cy.visit("/main/trading/fee");
        cy.wait(1000);
    });

    describe("Mobile Interaction (375x667)", () => {
        beforeEach(() => {
            cy.viewport(375, 667);
        });

        it("should hide desktop view and show collapsible on mobile", () => {
            cy.get("#feeListSummaryDesktop_feePage").should("not.be.visible");
            cy.get("#feeSummaryCollapsible_feePage").should("be.visible");
        });

        it("should display collapsed summary header by default", () => {
            cy.get("#feeSummaryCollapsibleDefault_feePage").should(
                "be.visible",
            );
            cy.get("#feeSummaryCollapsibleContent_feePage").should(
                "not.be.visible",
            );
        });

        it("should expand when trigger is clicked", () => {
            cy.get("#feeSummaryCollapsibleContent_feePage").should(
                "not.be.visible",
            );

            cy.get("#feeSummaryCollapsibleTrigger_feePage").click();
            cy.wait(300);

            cy.get("#feeSummaryCollapsibleContent_feePage").should(
                "be.visible",
            );
            cy.get("#totalTransactionsSummary_feePage_mobileView").should(
                "be.visible",
            );
            cy.get("#totalFeesPaidSummary_feePage_mobileView").should(
                "be.visible",
            );
        });

        it("should collapse when trigger is clicked again", () => {
            cy.get("#feeSummaryCollapsibleTrigger_feePage").click();
            cy.wait(300);
            cy.get("#feeSummaryCollapsibleContent_feePage").should(
                "be.visible",
            );

            cy.get("#feeSummaryCollapsibleTrigger_feePage").click();
            cy.wait(300);
            cy.get("#feeSummaryCollapsibleContent_feePage").should(
                "not.be.visible",
            );
        });
    });

    describe("Tablet Interaction (768x1024)", () => {
        beforeEach(() => {
            cy.viewport(768, 1024);
        });

        it("should show desktop grid view on tablet", () => {
            cy.get("#feeListSummaryDesktop_feePage").should("be.visible");
            cy.get("#feeSummaryCollapsible_feePage").should("not.be.visible");
        });

        it("should display all 2 summary cards in grid", () => {
            cy.get("#totalTransactionsSummary_feePage_desktopView").should(
                "be.visible",
            );
            cy.get("#totalFeesPaidSummary_feePage_desktopView").should(
                "be.visible",
            );
        });
    });

    describe("Desktop Interaction (1280x720)", () => {
        beforeEach(() => {
            cy.viewport(1280, 720);
        });

        it("should show desktop grid view", () => {
            cy.get("#feeListSummaryDesktop_feePage").should("be.visible");
            cy.get("#feeSummaryCollapsible_feePage").should("not.be.visible");
        });

        it("should display all 2 summary cards", () => {
            cy.get("#totalTransactionsSummary_feePage_desktopView").should(
                "be.visible",
            );
            cy.get("#totalFeesPaidSummary_feePage_desktopView").should(
                "be.visible",
            );
        });
    });
});
