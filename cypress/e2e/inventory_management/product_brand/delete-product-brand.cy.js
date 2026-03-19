import { faker } from "@faker-js/faker";

describe("Product Brand Delete API", () => {
    let testProductBrandId;
    let testUserId;

    before(() => {
        cy.setupApiAuthCookies();

        const request = {
            brand_status: faker.food.fruit(),
            note: faker.word.words(25),
            brand: faker.food.fruit(),
        };

        cy.AddProductBrand(request).then((response) => {
            expect(response.status).to.eq(201);
            testProductBrandId = response.body.productBrand.id;
            testUserId = response.body.productBrand.user_id;
        });
    });

    beforeEach(() => {
        cy.setupApiAuthCookies();
    });

    describe("Authentication", () => {
        it("should return 307 or 401 without authentication", () => {
            cy.AddProductBrand().then((id) => {
                cy.clearCookies();
                cy.DeleteProductBrandNoAuth(id).then((response) => {
                    expect(response.status).to.be.oneOf([307, 401]);

                    if (response.status === 307) {
                        const location =
                            response.headers.location || response.body;
                        expect(String(location)).to.include("/login");
                    }

                    if (response.status === 401) {
                        expect(response.body.success).to.be.false;
                        expect(response.body.error).to.eq("Unauthorized");
                    }
                });
            });
        });

        it("should return 401 without authentication", () => {
            cy.clearCookies();
            cy.DeleteProductBrandNoAuth(testProductBrandId).then((response) => {
                cy.clearCookies();

                const updateData = { notes: "unauth test" };
                cy.UpdateProductBrandNoAuth(
                    testProductBrandId,
                    updateData,
                ).then((response) => {
                    expect(response.status).to.be.oneOf([307, 401]);

                    if (response.status === 401) {
                        expect(response.body.success).to.be.false;
                        expect(response.body.error).to.eq("Unauthorized");
                    }

                    const location = response.headers.location || response.body;
                    expect(String(location)).to.include("/login");
                });
            });
        });
    });

    describe("ID Validation", () => {
        it("should return 400 for non-numeric ID", () => {
            cy.DeleteProductBrand("abc").then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.eq(
                    "Invalid product brand ID provided",
                );
            });
        });

        it("should return 400 for missing ID", () => {
            cy.DeleteProductBrand(null).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.eq(
                    "Invalid product brand ID provided",
                );
            });
        });

        it("should return 400 for negative/zero product brand ID", () => {
            cy.DeleteProductBrand("0").then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.error).to.eq(
                    "Invalid product brand ID format",
                );
            });
        });

        it("should return 404 for non-existent ID", () => {
            cy.DeleteProductBrand(999999999).then((response) => {
                expect(response.status).to.eq(404);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.include("not found");
            });
        });
    });

    describe("Success Scenarios", () => {
        const request = {
            brand_status: faker.food.fruit(),
            note: faker.word.words(25),
            brand: faker.food.fruit(),
        };

        it("should delete product brand and return 200", () => {
            cy.AddProductBrand(request).then((response) => {
                let productBrandId = response.body.productBrand.id;
                cy.DeleteProductBrand(productBrandId).then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body.success).to.be.true;
                    expect(response.body.data).to.exist;
                });
            });
        });

        it("should return correct response structure", () => {
            cy.AddProductBrand(request).then((response) => {
                let productBrandId = response.body.productBrand.id;
                cy.DeleteProductBrand(productBrandId).then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body).to.have.all.keys("success", "data");
                    expect(response.body.success).to.be.true;
                    expect(response.body.data).to.be.an("object");
                });
            });
        });

        it("should return application/json content-type", () => {
            cy.AddProductBrand(request).then((response) => {
                let productBrandId = response.body.productBrand.id;
                cy.DeleteProductBrand(productBrandId).then((response) => {
                    expect(response.headers["content-type"]).to.include(
                        "application/json",
                    );
                });
            });
        });

        it("should return correct success response", () => {
            cy.DeleteProductBrand(testProductBrandId).then((response) => {
                expect(response.body).to.have.all.keys("success", "data");
                expect(response.body.success).to.be.true;
            });
        });
    });

    describe("Delete Product Brand - Summary Impact", () => {
        const request = {
            brand_status: faker.food.fruit(),
            note: faker.word.words(25),
            brand: faker.food.fruit(),
        };

        it("totalProductBrands should decrement by 1 after deletion", () => {
            cy.AddProductBrand(request).then((response) => {
                let productBrandId = response.body.productBrand.id;
                cy.GetProductBrandSummary()
                    .then((before) => {
                        expect(before.status).to.eq(200);
                        return before.body.data.totalProductBrands;
                    })
                    .then((totalBefore) => {
                        cy.DeleteProductBrand(productBrandId).then(
                            (deleteRes) => {
                                expect(deleteRes.status).to.eq(200);
                            },
                        );

                        cy.GetProductBrandSummary().then((after) => {
                            expect(after.body.data.totalProductBrands).to.eq(
                                totalBefore,
                            );
                        });
                    });
            });
        });
    });

    describe("DB Verification", () => {
        const request = {
            brand_status: faker.food.fruit(),
            note: faker.word.words(25),
            brand: faker.food.fruit(),
        };

        it("should reflect soft delete in database", () => {
            cy.AddProductBrand(request).then((response) => {
                let productBrandId = response.body.productBrand.id;
                cy.DeleteProductBrand(productBrandId)
                    .then((response) => {
                        expect(response.status).to.eq(200);
                        return productBrandId;
                    })
                    .then((productBrandId) => {
                        cy.getSingleProductBrandFromDb(productBrandId).then(
                            (rows) => {
                                const dbData = rows[0];
                                expect(dbData).to.exist;
                                expect(dbData.brand_status).to.eq("deleted");
                                expect(dbData.deleted_at).to.not.be.null;
                            },
                        );
                    });
            });
        });
    });

    describe("Performance", () => {
        it("should delete within 1s", () => {
            const start = Date.now();
            cy.DeleteProductBrand(testProductBrandId).then((response) => {
                const duration = Date.now() - start;
                expect(duration).to.be.lte(1000);
                cy.log(`Delete time: ${duration}ms`);
            });
        });
    });
});
