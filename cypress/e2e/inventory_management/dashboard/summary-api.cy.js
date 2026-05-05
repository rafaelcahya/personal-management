describe("GET Product Summary API - /api/inventory/v1/product/summary", () => {
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
            cy.GetProductSummary().then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.success).to.be.true;
            });
        });

        it("should return 307 or 401 without authentication", () => {
            cy.clearApiAuth();
            cy.GetProductSummaryNoAuth().then((response) => {
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
            cy.GetProductSummary().then((response) => {
                expect(response.body).to.have.all.keys("success", "data");
                expect(response.body.success).to.be.true;
            });
        });

        it("should return all required data keys", () => {
            cy.GetProductSummary().then((response) => {
                const data = response.body.data;
                expect(data).to.have.all.keys(
                    "totalProducts",
                    "activeProducts",
                    "inactiveProducts",
                    "totalQuantity",
                    "totalUsageQuantity",
                    "favoriteProducts",
                );
            });
        });

        it("should return application/json content-type", () => {
            cy.GetProductSummary().then((response) => {
                expect(response.headers["content-type"]).to.include("application/json");
            });
        });
    });

    // =========================================================================
    // Data Types
    // =========================================================================
    describe("Data Types", () => {
        it("totalProducts should be a number >= 0", () => {
            cy.GetProductSummary().then((response) => {
                expect(response.body.data.totalProducts).to.be.a("number");
                expect(response.body.data.totalProducts).to.be.gte(0);
            });
        });

        it("activeProducts should be a number >= 0", () => {
            cy.GetProductSummary().then((response) => {
                expect(response.body.data.activeProducts).to.be.a("number");
                expect(response.body.data.activeProducts).to.be.gte(0);
            });
        });

        it("inactiveProducts should be a number >= 0", () => {
            cy.GetProductSummary().then((response) => {
                expect(response.body.data.inactiveProducts).to.be.a("number");
                expect(response.body.data.inactiveProducts).to.be.gte(0);
            });
        });

        it("totalQuantity should be a number >= 0", () => {
            cy.GetProductSummary().then((response) => {
                expect(response.body.data.totalQuantity).to.be.a("number");
                expect(response.body.data.totalQuantity).to.be.gte(0);
            });
        });

        it("totalUsageQuantity should be a number >= 0", () => {
            cy.GetProductSummary().then((response) => {
                expect(response.body.data.totalUsageQuantity).to.be.a("number");
                expect(response.body.data.totalUsageQuantity).to.be.gte(0);
            });
        });

        it("favoriteProducts should be a number >= 0", () => {
            cy.GetProductSummary().then((response) => {
                expect(response.body.data.favoriteProducts).to.be.a("number");
                expect(response.body.data.favoriteProducts).to.be.gte(0);
            });
        });

        it("all summary values should be numbers >= 0", () => {
            cy.GetProductSummary().then((response) => {
                const data = response.body.data;
                Object.values(data).forEach((value) => {
                    expect(value).to.be.a("number");
                    expect(value).to.be.gte(0);
                });
            });
        });
    });

    // =========================================================================
    // Data Consistency
    // =========================================================================
    describe("Data Consistency", () => {
        it("totalProducts should be >= activeProducts + inactiveProducts (soft-deleted may exist)", () => {
            cy.GetProductSummary().then((response) => {
                const { totalProducts, activeProducts, inactiveProducts } =
                    response.body.data;
                expect(totalProducts).to.be.gte(activeProducts + inactiveProducts);
            });
        });

        it("activeProducts + inactiveProducts should not exceed totalProducts", () => {
            cy.GetProductSummary().then((response) => {
                const { totalProducts, activeProducts, inactiveProducts } =
                    response.body.data;
                expect(activeProducts + inactiveProducts).to.be.lte(totalProducts);
            });
        });

        it("favoriteProducts should not exceed totalProducts", () => {
            cy.GetProductSummary().then((response) => {
                const { totalProducts, favoriteProducts } = response.body.data;
                expect(favoriteProducts).to.be.lte(totalProducts);
            });
        });

        it("totalQuantity should be >= 0 regardless of product count", () => {
            cy.GetProductSummary().then((response) => {
                expect(response.body.data.totalQuantity).to.be.gte(0);
            });
        });
    });

    // =========================================================================
    // Performance
    // =========================================================================
    describe("Performance", () => {
        it("should respond within 2000ms", () => {
            const start = Date.now();
            cy.GetProductSummary().then((response) => {
                expect(response.status).to.eq(200);
                expect(Date.now() - start).to.be.lte(2000);
            });
        });
    });
});
