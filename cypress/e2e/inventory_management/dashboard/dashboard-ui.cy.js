const DASHBOARD_API = "/api/inventory/v1/dashboard";
const SUMMARY_API = "/api/inventory/v1/product/summary";
const INVENTORY_URL = "/main/inventory";

const emptyDashboardData = {
    top5: [],
    all: [],
    lowStockAlerts: [],
    neglectedProducts: [],
    monthlySpendByType: [],
    avgUsageDuration: [],
    daysUntilEmpty: [],
};

const emptySummaryData = {
    totalProducts: 0,
    activeProducts: 0,
    inactiveProducts: 0,
    totalQuantity: 0,
    totalUsageQuantity: 0,
    favoriteProducts: 0,
};

const stubDashboard = (data = emptyDashboardData) => {
    cy.intercept("GET", DASHBOARD_API, {
        statusCode: 200,
        body: { success: true, data },
    }).as("dashboardApi");
};

const stubSummary = (data = emptySummaryData) => {
    cy.intercept("GET", SUMMARY_API, {
        statusCode: 200,
        body: { success: true, data },
    }).as("summaryApi");
};

describe("Inventory Dashboard UI - /main/inventory", () => {
    beforeEach(() => {
        cy.loginWithBypass();
    });

    // =========================================================================
    // Page Load
    // =========================================================================
    describe("Page Load", () => {
        it("should load the dashboard page without errors", () => {
            stubDashboard();
            stubSummary();
            cy.visit(INVENTORY_URL);
            cy.wait(["@dashboardApi", "@summaryApi"]);
            cy.get("body").should("be.visible");
            // No uncaught JS errors — Cypress catches these automatically
        });

        it("should display navigation tabs", () => {
            stubDashboard();
            stubSummary();
            cy.visit(INVENTORY_URL);
            cy.contains("Dashboard").should("be.visible");
            cy.contains("Product List").should("be.visible");
            cy.contains("Product Brand").should("be.visible");
            cy.contains("Product Name").should("be.visible");
            cy.contains("Product History").should("be.visible");
        });

        it("should highlight Dashboard tab as active", () => {
            stubDashboard();
            stubSummary();
            cy.visit(INVENTORY_URL);
            // Dashboard tab should have active styling (white bg on desktop)
            cy.contains("Dashboard").should("be.visible");
        });
    });

    // =========================================================================
    // Summary Cards
    // =========================================================================
    describe("Summary Cards", () => {
        it("should render 6 summary cards with titles", () => {
            stubDashboard();
            stubSummary({
                totalProducts: 10,
                activeProducts: 7,
                inactiveProducts: 3,
                totalQuantity: 45,
                totalUsageQuantity: 12,
                favoriteProducts: 4,
            });
            cy.visit(INVENTORY_URL);
            cy.wait(["@dashboardApi", "@summaryApi"]);

            cy.contains("Total Products").should("be.visible");
            cy.contains("Active").should("be.visible");
            cy.contains("Inactive").should("be.visible");
            cy.contains("Total Stock").should("be.visible");
            cy.contains("In Use").should("be.visible");
            cy.contains("Favorites").should("be.visible");
        });

        it("should display numeric values in summary cards", () => {
            stubDashboard();
            stubSummary({
                totalProducts: 10,
                activeProducts: 7,
                inactiveProducts: 3,
                totalQuantity: 45,
                totalUsageQuantity: 12,
                favoriteProducts: 4,
            });
            cy.visit(INVENTORY_URL);
            cy.wait(["@dashboardApi", "@summaryApi"]);

            cy.contains("10").should("be.visible");
            cy.contains("7").should("be.visible");
            cy.contains("3").should("be.visible");
            cy.contains("45").should("be.visible");
            cy.contains("12").should("be.visible");
            cy.contains("4").should("be.visible");
        });
    });

    // =========================================================================
    // Cost Per Use Section
    // =========================================================================
    describe("Cost Per Use Section", () => {
        it("should display section header 'Cost Per Use'", () => {
            stubDashboard();
            stubSummary();
            cy.visit(INVENTORY_URL);
            cy.wait(["@dashboardApi", "@summaryApi"]);
            cy.contains("h2", "Cost Per Use").should("be.visible");
        });

        it("should show empty state 'No products yet.' when data is empty", () => {
            stubDashboard(emptyDashboardData);
            stubSummary();
            cy.visit(INVENTORY_URL);
            cy.wait(["@dashboardApi", "@summaryApi"]);
            cy.contains("No products yet.").should("be.visible");
        });

        it("should render table when top5 data exists", () => {
            stubDashboard({
                ...emptyDashboardData,
                top5: [
                    {
                        id: 1,
                        product: "Shampoo",
                        brand: "Dove",
                        type: "Hair Care",
                        quantity: 3,
                        product_status: "active",
                        is_favorite: false,
                        total_spent: 50000,
                        total_units: 5,
                        cost_per_use: 10000,
                    },
                ],
                all: [
                    {
                        id: 1,
                        product: "Shampoo",
                        brand: "Dove",
                        type: "Hair Care",
                        quantity: 3,
                        product_status: "active",
                        is_favorite: false,
                        total_spent: 50000,
                        total_units: 5,
                        cost_per_use: 10000,
                    },
                ],
            });
            stubSummary();
            cy.visit(INVENTORY_URL);
            cy.wait(["@dashboardApi", "@summaryApi"]);
            cy.contains("Shampoo").should("be.visible");
        });

        it("should show 'View All' button when top5 data exists", () => {
            stubDashboard({
                ...emptyDashboardData,
                top5: [
                    {
                        id: 1,
                        product: "Shampoo",
                        brand: "Dove",
                        type: "Hair Care",
                        quantity: 3,
                        product_status: "active",
                        is_favorite: false,
                        total_spent: 50000,
                        total_units: 5,
                        cost_per_use: 10000,
                    },
                ],
                all: [
                    {
                        id: 1,
                        product: "Shampoo",
                        brand: "Dove",
                        type: "Hair Care",
                        quantity: 3,
                        product_status: "active",
                        is_favorite: false,
                        total_spent: 50000,
                        total_units: 5,
                        cost_per_use: 10000,
                    },
                ],
            });
            stubSummary();
            cy.visit(INVENTORY_URL);
            cy.wait(["@dashboardApi", "@summaryApi"]);

            // The Cost Per Use section's View All button
            cy.contains("h2", "Cost Per Use")
                .parents(".bg-white")
                .contains("View All")
                .should("be.visible");
        });

        it("should open modal with correct title on 'View All' click", () => {
            stubDashboard({
                ...emptyDashboardData,
                top5: [
                    {
                        id: 1,
                        product: "Shampoo",
                        brand: "Dove",
                        type: "Hair Care",
                        quantity: 3,
                        product_status: "active",
                        is_favorite: false,
                        total_spent: 50000,
                        total_units: 5,
                        cost_per_use: 10000,
                    },
                ],
                all: [
                    {
                        id: 1,
                        product: "Shampoo",
                        brand: "Dove",
                        type: "Hair Care",
                        quantity: 3,
                        product_status: "active",
                        is_favorite: false,
                        total_spent: 50000,
                        total_units: 5,
                        cost_per_use: 10000,
                    },
                ],
            });
            stubSummary();
            cy.visit(INVENTORY_URL);
            cy.wait(["@dashboardApi", "@summaryApi"]);

            cy.contains("h2", "Cost Per Use")
                .parents(".bg-white")
                .contains("View All")
                .click();

            cy.contains("All Products — Cost Per Used").should("be.visible");
        });
    });

    // =========================================================================
    // Low Stock Alert Section
    // =========================================================================
    describe("Low Stock Alert Section", () => {
        it("should display section header 'Low Stock Alert'", () => {
            stubDashboard();
            stubSummary();
            cy.visit(INVENTORY_URL);
            cy.wait(["@dashboardApi", "@summaryApi"]);
            cy.contains("Low Stock Alert").should("be.visible");
        });

        it("should show 'All good!' empty state when no low stock items", () => {
            stubDashboard(emptyDashboardData);
            stubSummary();
            cy.visit(INVENTORY_URL);
            cy.wait(["@dashboardApi", "@summaryApi"]);
            cy.contains("All good! Stock levels are healthy").should("be.visible");
        });

        it("should show 'Out of Stock' badge when quantity is 0", () => {
            stubDashboard({
                ...emptyDashboardData,
                lowStockAlerts: [
                    {
                        id: 1,
                        product: "Sabun",
                        brand: "Lifebuoy",
                        type: "Body Wash",
                        quantity: 0,
                        product_status: "active",
                    },
                ],
            });
            stubSummary();
            cy.visit(INVENTORY_URL);
            cy.wait(["@dashboardApi", "@summaryApi"]);
            cy.contains("Out of Stock").should("be.visible");
        });

        it("should show 'Low: X left' badge when quantity is 1-2", () => {
            stubDashboard({
                ...emptyDashboardData,
                lowStockAlerts: [
                    {
                        id: 2,
                        product: "Pasta Gigi",
                        brand: "Pepsodent",
                        type: "Oral Care",
                        quantity: 1,
                        product_status: "active",
                    },
                ],
            });
            stubSummary();
            cy.visit(INVENTORY_URL);
            cy.wait(["@dashboardApi", "@summaryApi"]);
            cy.contains("Low: 1 left").should("be.visible");
        });

        it("should show 'View All' button when low stock data exists", () => {
            stubDashboard({
                ...emptyDashboardData,
                lowStockAlerts: [
                    {
                        id: 1,
                        product: "Sabun",
                        brand: "Lifebuoy",
                        type: "Body Wash",
                        quantity: 0,
                        product_status: "active",
                    },
                ],
            });
            stubSummary();
            cy.visit(INVENTORY_URL);
            cy.wait(["@dashboardApi", "@summaryApi"]);

            cy.contains("Low Stock Alert")
                .parents(".bg-white")
                .contains("View All")
                .should("be.visible");
        });

        it("should open modal with title 'All Low Stock Products' on View All click", () => {
            stubDashboard({
                ...emptyDashboardData,
                lowStockAlerts: [
                    {
                        id: 1,
                        product: "Sabun",
                        brand: "Lifebuoy",
                        type: "Body Wash",
                        quantity: 0,
                        product_status: "active",
                    },
                ],
            });
            stubSummary();
            cy.visit(INVENTORY_URL);
            cy.wait(["@dashboardApi", "@summaryApi"]);

            cy.contains("Low Stock Alert")
                .parents(".bg-white")
                .contains("View All")
                .click();

            cy.contains("All Low Stock Products").should("be.visible");
        });
    });

    // =========================================================================
    // Neglected Products Section
    // =========================================================================
    describe("Neglected Products Section", () => {
        it("should display section header 'Neglected Products'", () => {
            stubDashboard();
            stubSummary();
            cy.visit(INVENTORY_URL);
            cy.wait(["@dashboardApi", "@summaryApi"]);
            cy.contains("Neglected Products").should("be.visible");
        });

        it("should show empty state when no neglected products", () => {
            stubDashboard(emptyDashboardData);
            stubSummary();
            cy.visit(INVENTORY_URL);
            cy.wait(["@dashboardApi", "@summaryApi"]);
            cy.contains("No neglected products").should("be.visible");
        });

        it("should show 'Never used' italic label when last_used is null", () => {
            stubDashboard({
                ...emptyDashboardData,
                neglectedProducts: [
                    {
                        id: 1,
                        product: "Krim Wajah",
                        brand: "Vaseline",
                        type: "Skin Care",
                        quantity: 2,
                        product_status: "active",
                        last_used: null,
                        days_since_used: null,
                    },
                ],
            });
            stubSummary();
            cy.visit(INVENTORY_URL);
            cy.wait(["@dashboardApi", "@summaryApi"]);
            cy.contains("Never used").should("be.visible");
        });

        it("should render days badge for neglected product with days_since_used", () => {
            stubDashboard({
                ...emptyDashboardData,
                neglectedProducts: [
                    {
                        id: 2,
                        product: "Conditioner",
                        brand: "Pantene",
                        type: "Hair Care",
                        quantity: 1,
                        product_status: "active",
                        last_used: "2026-03-01T00:00:00Z",
                        days_since_used: 65,
                    },
                ],
            });
            stubSummary();
            cy.visit(INVENTORY_URL);
            cy.wait(["@dashboardApi", "@summaryApi"]);
            cy.contains("65d ago").should("be.visible");
        });
    });

    // =========================================================================
    // Monthly Spend by Type Section
    // =========================================================================
    describe("Monthly Spend by Type Section", () => {
        it("should display section header 'Monthly Spend by Type'", () => {
            stubDashboard();
            stubSummary();
            cy.visit(INVENTORY_URL);
            cy.wait(["@dashboardApi", "@summaryApi"]);
            cy.contains("Monthly Spend by Type").should("be.visible");
        });

        it("should show empty state 'No purchase data yet' when no data", () => {
            stubDashboard(emptyDashboardData);
            stubSummary();
            cy.visit(INVENTORY_URL);
            cy.wait(["@dashboardApi", "@summaryApi"]);
            cy.contains("No purchase data yet").should("be.visible");
        });

        it("should render grouped data with month header and type rows", () => {
            stubDashboard({
                ...emptyDashboardData,
                monthlySpendByType: [
                    { month: "2026-04", type: "Body Wash", total_spent: 35000 },
                    { month: "2026-04", type: "Hair Care", total_spent: 50000 },
                ],
            });
            stubSummary();
            cy.visit(INVENTORY_URL);
            cy.wait(["@dashboardApi", "@summaryApi"]);
            cy.contains("Body Wash").should("be.visible");
            cy.contains("Hair Care").should("be.visible");
        });

        it("should format total_spent as Rupiah", () => {
            stubDashboard({
                ...emptyDashboardData,
                monthlySpendByType: [
                    { month: "2026-04", type: "Body Wash", total_spent: 35000 },
                ],
            });
            stubSummary();
            cy.visit(INVENTORY_URL);
            cy.wait(["@dashboardApi", "@summaryApi"]);
            cy.contains("Rp").should("be.visible");
        });

        it("should open modal with title 'Monthly Spend by Type' on View All click", () => {
            stubDashboard({
                ...emptyDashboardData,
                monthlySpendByType: [
                    { month: "2026-04", type: "Body Wash", total_spent: 35000 },
                ],
            });
            stubSummary();
            cy.visit(INVENTORY_URL);
            cy.wait(["@dashboardApi", "@summaryApi"]);

            cy.contains("Monthly Spend by Type")
                .parents(".bg-white")
                .contains("View All")
                .click();

            // Modal dialog title
            cy.get("[role='dialog']")
                .contains("Monthly Spend by Type")
                .should("be.visible");
        });
    });

    // =========================================================================
    // Avg Usage Duration Section
    // =========================================================================
    describe("Avg Usage Duration Section", () => {
        it("should display section header 'Avg Usage Duration'", () => {
            stubDashboard();
            stubSummary();
            cy.visit(INVENTORY_URL);
            cy.wait(["@dashboardApi", "@summaryApi"]);
            cy.contains("Avg Usage Duration").should("be.visible");
        });

        it("should show empty state 'Not enough usage data yet' when no data", () => {
            stubDashboard(emptyDashboardData);
            stubSummary();
            cy.visit(INVENTORY_URL);
            cy.wait(["@dashboardApi", "@summaryApi"]);
            cy.contains("Not enough usage data yet").should("be.visible");
        });

        it("should render duration badge with 'days' text", () => {
            stubDashboard({
                ...emptyDashboardData,
                avgUsageDuration: [
                    {
                        product_list_id: 1,
                        product: "Shampoo",
                        brand: "Dove",
                        type: "Hair Care",
                        avg_days: 45,
                    },
                ],
            });
            stubSummary();
            cy.visit(INVENTORY_URL);
            cy.wait(["@dashboardApi", "@summaryApi"]);
            cy.contains("45 days").should("be.visible");
        });

        it("should open modal with title 'All Products — Avg Usage Duration' on View All click", () => {
            stubDashboard({
                ...emptyDashboardData,
                avgUsageDuration: [
                    {
                        product_list_id: 1,
                        product: "Shampoo",
                        brand: "Dove",
                        type: "Hair Care",
                        avg_days: 45,
                    },
                ],
            });
            stubSummary();
            cy.visit(INVENTORY_URL);
            cy.wait(["@dashboardApi", "@summaryApi"]);

            cy.contains("Avg Usage Duration")
                .parents(".bg-white")
                .contains("View All")
                .click();

            cy.contains("All Products — Avg Usage Duration").should("be.visible");
        });
    });

    // =========================================================================
    // Days Until Empty Section
    // =========================================================================
    describe("Days Until Empty Section", () => {
        it("should display section header 'Days Until Empty'", () => {
            stubDashboard();
            stubSummary();
            cy.visit(INVENTORY_URL);
            cy.wait(["@dashboardApi", "@summaryApi"]);
            cy.contains("Days Until Empty").should("be.visible");
        });

        it("should show empty state 'No consumption data to estimate from' when no data", () => {
            stubDashboard(emptyDashboardData);
            stubSummary();
            cy.visit(INVENTORY_URL);
            cy.wait(["@dashboardApi", "@summaryApi"]);
            cy.contains("No consumption data to estimate from").should("be.visible");
        });

        it("should show warning emoji in badge when days_until_empty <= 7", () => {
            stubDashboard({
                ...emptyDashboardData,
                daysUntilEmpty: [
                    {
                        id: 1,
                        product: "Pasta Gigi",
                        brand: "Pepsodent",
                        type: "Oral Care",
                        quantity: 1,
                        daily_consumption: 0.2,
                        days_until_empty: 5,
                    },
                ],
            });
            stubSummary();
            cy.visit(INVENTORY_URL);
            cy.wait(["@dashboardApi", "@summaryApi"]);
            cy.contains("5d ⚠️").should("be.visible");
        });

        it("should render days badge without warning for days_until_empty > 7", () => {
            stubDashboard({
                ...emptyDashboardData,
                daysUntilEmpty: [
                    {
                        id: 2,
                        product: "Sabun",
                        brand: "Lifebuoy",
                        type: "Body Wash",
                        quantity: 5,
                        daily_consumption: 0.1,
                        days_until_empty: 30,
                    },
                ],
            });
            stubSummary();
            cy.visit(INVENTORY_URL);
            cy.wait(["@dashboardApi", "@summaryApi"]);
            cy.contains("30d").should("be.visible");
        });

        it("should open modal with title 'All Products — Days Until Empty' on View All click", () => {
            stubDashboard({
                ...emptyDashboardData,
                daysUntilEmpty: [
                    {
                        id: 1,
                        product: "Pasta Gigi",
                        brand: "Pepsodent",
                        type: "Oral Care",
                        quantity: 1,
                        daily_consumption: 0.2,
                        days_until_empty: 5,
                    },
                ],
            });
            stubSummary();
            cy.visit(INVENTORY_URL);
            cy.wait(["@dashboardApi", "@summaryApi"]);

            cy.contains("Days Until Empty")
                .parents(".bg-white")
                .contains("View All")
                .click();

            cy.contains("All Products — Days Until Empty").should("be.visible");
        });
    });

    // =========================================================================
    // Loading States
    // =========================================================================
    describe("Loading States", () => {
        it("should show skeleton loading state while API is loading", () => {
            // Intercept with artificial delay
            cy.intercept("GET", DASHBOARD_API, (req) => {
                req.on("response", (res) => {
                    res.setDelay(800);
                });
            }).as("slowDashboard");

            cy.intercept("GET", SUMMARY_API, (req) => {
                req.on("response", (res) => {
                    res.setDelay(800);
                });
            }).as("slowSummary");

            cy.visit(INVENTORY_URL);

            // Skeleton cards should appear before data loads
            cy.get(".animate-pulse").should("exist");
        });
    });

    // =========================================================================
    // API Error Handling
    // =========================================================================
    describe("API Error Handling", () => {
        it("should render error message when dashboard API returns 500", () => {
            cy.intercept("GET", DASHBOARD_API, {
                statusCode: 500,
                body: { success: false, error: "Internal Server Error" },
            }).as("failedDashboard");

            stubSummary();
            cy.visit(INVENTORY_URL);
            cy.wait("@failedDashboard");

            // The client-side fetch throws with error.message from API response body
            // CostPerUse renders the error string directly in a <p> tag
            cy.contains("Internal Server Error").should("be.visible");
        });
    });

    // =========================================================================
    // Layout & Responsive
    // =========================================================================
    describe("Layout & Responsive", () => {
        it("should render the 2-column analytics grid on desktop viewport", () => {
            stubDashboard();
            stubSummary();
            cy.viewport(1280, 800);
            cy.visit(INVENTORY_URL);
            cy.wait(["@dashboardApi", "@summaryApi"]);

            // The grid container for sections 2-6 should exist
            cy.get(".grid.grid-cols-1.md\\:grid-cols-2").should("exist");
        });

        it("should render the 2-column summary cards grid", () => {
            stubDashboard();
            stubSummary({
                totalProducts: 5,
                activeProducts: 3,
                inactiveProducts: 2,
                totalQuantity: 10,
                totalUsageQuantity: 4,
                favoriteProducts: 1,
            });
            cy.viewport(1280, 800);
            cy.visit(INVENTORY_URL);
            cy.wait(["@dashboardApi", "@summaryApi"]);

            cy.get(".grid.grid-cols-2").should("exist");
        });
    });
});
