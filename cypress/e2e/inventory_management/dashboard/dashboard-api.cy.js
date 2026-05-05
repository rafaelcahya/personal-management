describe("GET Dashboard API - /api/inventory/v1/dashboard", () => {
    before(() => {
        cy.setupApiAuthCookies();
    });

    beforeEach(() => {
        cy.setupApiAuthCookies();
    });

    // =========================================================================
    // Authentication
    // =========================================================================
    describe("Authentication", () => {
        it("should return 200 for authenticated user", () => {
            cy.request({
                method: "GET",
                url: "/api/inventory/v1/dashboard",
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.success).to.be.true;
            });
        });

        it("should return 307 or 401 without authentication", () => {
            cy.clearApiAuth();
            cy.request({
                method: "GET",
                url: "/api/inventory/v1/dashboard",
                failOnStatusCode: false,
                followRedirect: false,
            }).then((response) => {
                expect(response.status).to.be.oneOf([307, 401]);

                if (response.status === 401) {
                    // Middleware returns { error: "UNAUTHORIZED", message: "..." }
                    // Route handler returns { success: false, error: "Unauthorized" }
                    const body = response.body;
                    const isUnauth =
                        body?.success === false || body?.error === "UNAUTHORIZED";
                    expect(isUnauth).to.be.true;
                }

                if (response.status === 307) {
                    const location = response.headers.location || "";
                    expect(String(location)).to.include("/login");
                }
            });
        });
    });

    // =========================================================================
    // Response Structure
    // =========================================================================
    describe("Response Structure", () => {
        it("should return correct top-level keys: success and data", () => {
            cy.request({
                method: "GET",
                url: "/api/inventory/v1/dashboard",
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.body).to.have.all.keys("success", "data");
                expect(response.body.success).to.be.true;
            });
        });

        it("should return all required data keys", () => {
            cy.request({
                method: "GET",
                url: "/api/inventory/v1/dashboard",
                failOnStatusCode: false,
            }).then((response) => {
                const data = response.body.data;
                expect(data).to.have.all.keys(
                    "top5",
                    "all",
                    "lowStockAlerts",
                    "neglectedProducts",
                    "monthlySpendByType",
                    "avgUsageDuration",
                    "daysUntilEmpty",
                );
            });
        });

        it("should return all data values as arrays", () => {
            cy.request({
                method: "GET",
                url: "/api/inventory/v1/dashboard",
                failOnStatusCode: false,
            }).then((response) => {
                const data = response.body.data;
                expect(data.top5).to.be.an("array");
                expect(data.all).to.be.an("array");
                expect(data.lowStockAlerts).to.be.an("array");
                expect(data.neglectedProducts).to.be.an("array");
                expect(data.monthlySpendByType).to.be.an("array");
                expect(data.avgUsageDuration).to.be.an("array");
                expect(data.daysUntilEmpty).to.be.an("array");
            });
        });

        it("should return application/json content-type", () => {
            cy.request({
                method: "GET",
                url: "/api/inventory/v1/dashboard",
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.headers["content-type"]).to.include("application/json");
            });
        });
    });

    // =========================================================================
    // Cost Per Use Data
    // =========================================================================
    describe("Cost Per Use Data", () => {
        it("should have required keys on top5 items", () => {
            cy.request({
                method: "GET",
                url: "/api/inventory/v1/dashboard",
                failOnStatusCode: false,
            }).then((response) => {
                const { top5 } = response.body.data;
                if (top5.length === 0) {
                    cy.log("top5 is empty — skipping field key assertion");
                    return;
                }
                top5.forEach((item) => {
                    expect(item).to.include.all.keys(
                        "id",
                        "product",
                        "brand",
                        "type",
                        "quantity",
                        "product_status",
                        "is_favorite",
                        "total_spent",
                        "total_units",
                        "cost_per_use",
                    );
                });
            });
        });

        it("cost_per_use should be null or a positive number (null-safe)", () => {
            cy.request({
                method: "GET",
                url: "/api/inventory/v1/dashboard",
                failOnStatusCode: false,
            }).then((response) => {
                const { top5 } = response.body.data;
                top5.forEach((item) => {
                    if (item.cost_per_use !== null) {
                        expect(item.cost_per_use).to.be.a("number");
                        expect(item.cost_per_use).to.be.gt(0);
                    }
                });
            });
        });

        it("top5 should be sorted DESC by cost_per_use (nulls last)", () => {
            cy.request({
                method: "GET",
                url: "/api/inventory/v1/dashboard",
                failOnStatusCode: false,
            }).then((response) => {
                const { top5 } = response.body.data;
                if (top5.length <= 1) return;

                const nonNullItems = top5.filter((i) => i.cost_per_use !== null);
                for (let i = 0; i < nonNullItems.length - 1; i++) {
                    expect(nonNullItems[i].cost_per_use).to.be.gte(
                        nonNullItems[i + 1].cost_per_use,
                    );
                }

                // Null items should appear after non-null items
                let nullStarted = false;
                top5.forEach((item) => {
                    if (item.cost_per_use === null) nullStarted = true;
                    if (nullStarted) expect(item.cost_per_use).to.be.null;
                });
            });
        });

        it("top5 should have at most 5 items", () => {
            cy.request({
                method: "GET",
                url: "/api/inventory/v1/dashboard",
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.body.data.top5.length).to.be.lte(5);
            });
        });

        it("all.length should be >= top5.length", () => {
            cy.request({
                method: "GET",
                url: "/api/inventory/v1/dashboard",
                failOnStatusCode: false,
            }).then((response) => {
                const { top5, all } = response.body.data;
                expect(all.length).to.be.gte(top5.length);
            });
        });

        it("all items should have same required keys as top5", () => {
            cy.request({
                method: "GET",
                url: "/api/inventory/v1/dashboard",
                failOnStatusCode: false,
            }).then((response) => {
                const { all } = response.body.data;
                if (all.length === 0) return;
                all.forEach((item) => {
                    expect(item).to.include.all.keys(
                        "id",
                        "product",
                        "brand",
                        "type",
                        "quantity",
                        "product_status",
                        "is_favorite",
                        "total_spent",
                        "total_units",
                        "cost_per_use",
                    );
                });
            });
        });
    });

    // =========================================================================
    // Low Stock Alert Logic
    // =========================================================================
    describe("Low Stock Alert Logic", () => {
        it("all lowStockAlerts items should have quantity <= 2", () => {
            cy.request({
                method: "GET",
                url: "/api/inventory/v1/dashboard",
                failOnStatusCode: false,
            }).then((response) => {
                const { lowStockAlerts } = response.body.data;
                lowStockAlerts.forEach((item) => {
                    expect(item.quantity).to.be.lte(2);
                });
            });
        });

        it("lowStockAlerts should be sorted ASC by quantity", () => {
            cy.request({
                method: "GET",
                url: "/api/inventory/v1/dashboard",
                failOnStatusCode: false,
            }).then((response) => {
                const { lowStockAlerts } = response.body.data;
                if (lowStockAlerts.length <= 1) return;
                for (let i = 0; i < lowStockAlerts.length - 1; i++) {
                    expect(lowStockAlerts[i].quantity).to.be.lte(
                        lowStockAlerts[i + 1].quantity,
                    );
                }
            });
        });

        it("lowStockAlerts items should have required keys", () => {
            cy.request({
                method: "GET",
                url: "/api/inventory/v1/dashboard",
                failOnStatusCode: false,
            }).then((response) => {
                const { lowStockAlerts } = response.body.data;
                if (lowStockAlerts.length === 0) return;
                lowStockAlerts.forEach((item) => {
                    expect(item).to.include.all.keys(
                        "id",
                        "product",
                        "brand",
                        "type",
                        "quantity",
                        "product_status",
                    );
                });
            });
        });
    });

    // =========================================================================
    // Neglected Products Logic
    // =========================================================================
    describe("Neglected Products Logic", () => {
        it("all neglectedProducts items should have product_status = 'active'", () => {
            cy.request({
                method: "GET",
                url: "/api/inventory/v1/dashboard",
                failOnStatusCode: false,
            }).then((response) => {
                const { neglectedProducts } = response.body.data;
                neglectedProducts.forEach((item) => {
                    expect(item.product_status).to.eq("active");
                });
            });
        });

        it("neglectedProducts items should have last_used as null or date string", () => {
            cy.request({
                method: "GET",
                url: "/api/inventory/v1/dashboard",
                failOnStatusCode: false,
            }).then((response) => {
                const { neglectedProducts } = response.body.data;
                neglectedProducts.forEach((item) => {
                    expect(item).to.have.property("last_used");
                    if (item.last_used !== null) {
                        expect(new Date(item.last_used).toString()).to.not.eq("Invalid Date");
                    }
                });
            });
        });

        it("neglectedProducts items should have days_since_used as number or null", () => {
            cy.request({
                method: "GET",
                url: "/api/inventory/v1/dashboard",
                failOnStatusCode: false,
            }).then((response) => {
                const { neglectedProducts } = response.body.data;
                neglectedProducts.forEach((item) => {
                    expect(item).to.have.property("days_since_used");
                    if (item.days_since_used !== null) {
                        expect(item.days_since_used).to.be.a("number");
                        expect(item.days_since_used).to.be.gte(0);
                    }
                });
            });
        });

        it("neglectedProducts items with last_used null should appear before items with last_used set", () => {
            cy.request({
                method: "GET",
                url: "/api/inventory/v1/dashboard",
                failOnStatusCode: false,
            }).then((response) => {
                const { neglectedProducts } = response.body.data;
                if (neglectedProducts.length <= 1) return;
                let datedStarted = false;
                neglectedProducts.forEach((item) => {
                    if (item.last_used !== null) datedStarted = true;
                    if (datedStarted) expect(item.last_used).to.not.be.null;
                });
            });
        });

        it("neglectedProducts items should have required keys", () => {
            cy.request({
                method: "GET",
                url: "/api/inventory/v1/dashboard",
                failOnStatusCode: false,
            }).then((response) => {
                const { neglectedProducts } = response.body.data;
                if (neglectedProducts.length === 0) return;
                neglectedProducts.forEach((item) => {
                    expect(item).to.include.all.keys(
                        "id",
                        "product",
                        "brand",
                        "type",
                        "quantity",
                        "last_used",
                        "days_since_used",
                    );
                });
            });
        });
    });

    // =========================================================================
    // Monthly Spend By Type Logic
    // =========================================================================
    describe("Monthly Spend By Type Logic", () => {
        it("monthlySpendByType items should have required keys: month, type, total_spent", () => {
            cy.request({
                method: "GET",
                url: "/api/inventory/v1/dashboard",
                failOnStatusCode: false,
            }).then((response) => {
                const { monthlySpendByType } = response.body.data;
                if (monthlySpendByType.length === 0) return;
                monthlySpendByType.forEach((item) => {
                    expect(item).to.include.all.keys("month", "type", "total_spent");
                });
            });
        });

        it("month field should be in YYYY-MM format", () => {
            const monthRegex = /^\d{4}-\d{2}$/;
            cy.request({
                method: "GET",
                url: "/api/inventory/v1/dashboard",
                failOnStatusCode: false,
            }).then((response) => {
                const { monthlySpendByType } = response.body.data;
                monthlySpendByType.forEach((item) => {
                    expect(item.month).to.match(monthRegex);
                });
            });
        });

        it("total_spent should be a number >= 0", () => {
            cy.request({
                method: "GET",
                url: "/api/inventory/v1/dashboard",
                failOnStatusCode: false,
            }).then((response) => {
                const { monthlySpendByType } = response.body.data;
                monthlySpendByType.forEach((item) => {
                    expect(item.total_spent).to.be.a("number");
                    expect(item.total_spent).to.be.gte(0);
                });
            });
        });

        it("monthlySpendByType should only include last 6 months", () => {
            cy.request({
                method: "GET",
                url: "/api/inventory/v1/dashboard",
                failOnStatusCode: false,
            }).then((response) => {
                const { monthlySpendByType } = response.body.data;
                const sixMonthsAgo = new Date();
                sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
                const cutoffMonth = sixMonthsAgo.toISOString().slice(0, 7);

                monthlySpendByType.forEach((item) => {
                    expect(item.month).to.be.gte(cutoffMonth);
                });
            });
        });
    });

    // =========================================================================
    // Avg Usage Duration Logic
    // =========================================================================
    describe("Avg Usage Duration Logic", () => {
        it("avgUsageDuration items should have required keys", () => {
            cy.request({
                method: "GET",
                url: "/api/inventory/v1/dashboard",
                failOnStatusCode: false,
            }).then((response) => {
                const { avgUsageDuration } = response.body.data;
                if (avgUsageDuration.length === 0) return;
                avgUsageDuration.forEach((item) => {
                    expect(item).to.include.all.keys(
                        "product_list_id",
                        "product",
                        "brand",
                        "type",
                        "avg_days",
                    );
                });
            });
        });

        it("avg_days should be a positive number", () => {
            cy.request({
                method: "GET",
                url: "/api/inventory/v1/dashboard",
                failOnStatusCode: false,
            }).then((response) => {
                const { avgUsageDuration } = response.body.data;
                avgUsageDuration.forEach((item) => {
                    expect(item.avg_days).to.be.a("number");
                    expect(item.avg_days).to.be.gt(0);
                });
            });
        });

        it("avgUsageDuration should be sorted DESC by avg_days", () => {
            cy.request({
                method: "GET",
                url: "/api/inventory/v1/dashboard",
                failOnStatusCode: false,
            }).then((response) => {
                const { avgUsageDuration } = response.body.data;
                if (avgUsageDuration.length <= 1) return;
                for (let i = 0; i < avgUsageDuration.length - 1; i++) {
                    expect(avgUsageDuration[i].avg_days).to.be.gte(
                        avgUsageDuration[i + 1].avg_days,
                    );
                }
            });
        });
    });

    // =========================================================================
    // Days Until Empty Logic
    // =========================================================================
    describe("Days Until Empty Logic", () => {
        it("daysUntilEmpty items should have required keys", () => {
            cy.request({
                method: "GET",
                url: "/api/inventory/v1/dashboard",
                failOnStatusCode: false,
            }).then((response) => {
                const { daysUntilEmpty } = response.body.data;
                if (daysUntilEmpty.length === 0) return;
                daysUntilEmpty.forEach((item) => {
                    expect(item).to.include.all.keys(
                        "id",
                        "product",
                        "brand",
                        "type",
                        "quantity",
                        "daily_consumption",
                        "days_until_empty",
                    );
                });
            });
        });

        it("daysUntilEmpty items should have quantity > 0", () => {
            cy.request({
                method: "GET",
                url: "/api/inventory/v1/dashboard",
                failOnStatusCode: false,
            }).then((response) => {
                const { daysUntilEmpty } = response.body.data;
                daysUntilEmpty.forEach((item) => {
                    expect(item.quantity).to.be.gt(0);
                });
            });
        });

        it("days_until_empty should be a positive number", () => {
            cy.request({
                method: "GET",
                url: "/api/inventory/v1/dashboard",
                failOnStatusCode: false,
            }).then((response) => {
                const { daysUntilEmpty } = response.body.data;
                daysUntilEmpty.forEach((item) => {
                    expect(item.days_until_empty).to.be.a("number");
                    expect(item.days_until_empty).to.be.gt(0);
                });
            });
        });

        it("daily_consumption should be a positive number", () => {
            cy.request({
                method: "GET",
                url: "/api/inventory/v1/dashboard",
                failOnStatusCode: false,
            }).then((response) => {
                const { daysUntilEmpty } = response.body.data;
                daysUntilEmpty.forEach((item) => {
                    expect(item.daily_consumption).to.be.a("number");
                    expect(item.daily_consumption).to.be.gt(0);
                });
            });
        });

        it("daysUntilEmpty should be sorted ASC by days_until_empty (most critical first)", () => {
            cy.request({
                method: "GET",
                url: "/api/inventory/v1/dashboard",
                failOnStatusCode: false,
            }).then((response) => {
                const { daysUntilEmpty } = response.body.data;
                if (daysUntilEmpty.length <= 1) return;
                for (let i = 0; i < daysUntilEmpty.length - 1; i++) {
                    expect(daysUntilEmpty[i].days_until_empty).to.be.lte(
                        daysUntilEmpty[i + 1].days_until_empty,
                    );
                }
            });
        });
    });

    // =========================================================================
    // Performance
    // =========================================================================
    describe("Performance", () => {
        it("should respond within 2000ms", () => {
            const start = Date.now();
            cy.request({
                method: "GET",
                url: "/api/inventory/v1/dashboard",
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(Date.now() - start).to.be.lte(2000);
            });
        });
    });
});
