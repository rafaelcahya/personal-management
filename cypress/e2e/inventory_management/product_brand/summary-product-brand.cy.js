import { faker } from "@faker-js/faker";

describe("GET Product Brand Summary API", () => {
    before(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.setupApiAuthCookies();
    });

    beforeEach(() => {
        cy.setupApiAuthCookies();
    });

    describe("Authentication", () => {
        it("should return 200 when authenticated", () => {
            cy.GetProductBrandSummary().then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.success).to.be.true;
            });
        });

        it("should return 307 or 401 when not authenticated", () => {
            cy.clearCookies();
            cy.GetProductBrandSummaryNoAuth().then((response) => {
                expect(response.status).to.be.oneOf([307, 401]);
                if (response.status === 307) {
                    const location = response.headers.location || response.body;
                    expect(String(location)).to.include("/login");
                }
                if (response.status === 401) {
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.eq("Unauthorized");
                }
            });
        });
    });

    describe("Response Structure", () => {
        it("should return correct top-level keys", () => {
            cy.GetProductBrandSummary().then((response) => {
                expect(response.body).to.have.all.keys("success", "data");
                expect(response.body.success).to.be.true;
            });
        });

        it("should return correct data keys", () => {
            cy.GetProductBrandSummary().then((response) => {
                expect(response.body.data).to.have.all.keys(
                    "totalProductBrands",
                    "totalStatus",
                );
            });
        });

        it("should return correct data types", () => {
            cy.GetProductBrandSummary().then((response) => {
                const { data } = response.body;
                // totalProductBrands = number
                expect(data.totalProductBrands).to.be.a("number");
                // totalStatus = object { active: 16 }
                expect(data.totalStatus).to.be.an("object");
            });
        });

        it("should return application/json content-type", () => {
            cy.GetProductBrandSummary().then((response) => {
                expect(response.headers["content-type"]).to.include(
                    "application/json",
                );
            });
        });
    });

    describe("Business Logic", () => {
        it("totalProductBrands should be non-negative integer", () => {
            cy.GetProductBrandSummary().then((response) => {
                const total = response.body.data.totalProductBrands;
                expect(total).to.be.a("number");
                expect(total).to.be.gte(0);
                expect(Number.isInteger(total)).to.be.true;
            });
        });

        it("totalStatus values should all be positive integers", () => {
            cy.GetProductBrandSummary().then((response) => {
                const { totalStatus } = response.body.data;
                Object.values(totalStatus).forEach((count) => {
                    expect(count).to.be.a("number");
                    expect(count).to.be.gte(1);
                    expect(Number.isInteger(count)).to.be.true;
                });
            });
        });

        it("sum of totalStatus values should equal totalProductBrands", () => {
            cy.GetProductBrandSummary().then((response) => {
                const { totalProductBrands, totalStatus } = response.body.data;
                const sumOfStatus = Object.values(totalStatus).reduce(
                    (acc, val) => acc + val,
                    0,
                );
                expect(sumOfStatus).to.eq(totalProductBrands);
            });
        });

        it("totalStatus should reflect newly added product brand status", () => {
            let statusBefore;

            cy.GetProductBrandSummary().then((response) => {
                statusBefore = { ...response.body.data.totalStatus };
            });

            const newBrand = {
                brand: faker.food.fruit(),
                brand_status: "active",
                note: faker.word.words(5),
            };

            cy.AddProductBrand(newBrand).then((response) => {
                expect(response.status).to.eq(201);
            });

            cy.GetProductBrandSummary().then((response) => {
                const statusAfter = response.body.data.totalStatus;
                const prevActive = statusBefore["active"] || 0;
                expect(statusAfter["active"]).to.eq(prevActive + 1);
            });
        });

        it("totalProductBrands should increment after adding a new brand", () => {
            let totalBefore;

            cy.GetProductBrandSummary().then((response) => {
                totalBefore = response.body.data.totalProductBrands;
            });

            cy.AddProductBrand({
                brand: faker.food.fruit(),
                brand_status: "active",
                note: faker.word.words(5),
            }).then((response) => {
                expect(response.status).to.eq(201);
            });

            cy.GetProductBrandSummary().then((response) => {
                expect(response.body.data.totalProductBrands).to.eq(
                    totalBefore + 1,
                );
            });
        });
    });

    describe("API vs Database Comparison", () => {
        it("totalProductBrands should match database count", () => {
            cy.AddProductBrand({
                brand: faker.food.fruit(),
                brand_status: "active",
                note: faker.word.words(5),
            }).then((response) => {
                expect(response.status).to.eq(201);
            });

            cy.GetProductBrandSummary()
                .then((response) => {
                    expect(response.status).to.eq(200);
                    return response.body.data.totalProductBrands;
                })
                .then((apiCount) => {
                    cy.getTotalProductBrandsFromDb().then((dbCount) => {
                        expect(apiCount).to.eq(dbCount);
                    });
                });
        });
    });

    describe("Performance", () => {
        it("should respond within 2000ms", () => {
            const start = Date.now();
            cy.GetProductBrandSummary().then((response) => {
                expect(Date.now() - start).to.be.lte(2000);
                expect(response.status).to.eq(200);
            });
        });
    });
});
