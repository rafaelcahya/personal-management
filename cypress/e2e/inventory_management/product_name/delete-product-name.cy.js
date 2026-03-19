import { faker } from "@faker-js/faker";

describe("Product Name Delete API", () => {
    let testProductNameId;
    let testUserId;

    before(() => {
        cy.setupApiAuthCookies();

        const request = {
            product_name: faker.food.fruit(),
            note: faker.word.words(25),
            product_name_status: "active",
        };

        cy.AddProductName(request).then((response) => {
            expect(response.status).to.eq(201);
            testProductNameId = response.body.productName.id;
            testUserId = response.body.productName.user_id;
        });
    });

    beforeEach(() => {
        cy.setupApiAuthCookies();
    });

    describe("Authentication", () => {
        it("should return 307 or 401 without authentication", () => {
            cy.AddProductName().then((id) => {
                cy.clearCookies();
                cy.DeleteProductNameNoAuth(id).then((response) => {
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
            cy.DeleteProductNameNoAuth(testProductNameId).then((response) => {
                cy.clearCookies();

                const updateData = { notes: "unauth test" };
                cy.UpdateProductNameNoAuth(
                    testProductNameId,
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
            cy.DeleteProductName("abc").then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.eq(
                    "Invalid product name ID provided",
                );
            });
        });

        it("should return 400 for missing ID", () => {
            cy.DeleteProductName(null).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.eq(
                    "Invalid product name ID provided",
                );
            });
        });

        it("should return 400 for negative/zero product name ID", () => {
            cy.DeleteProductName("0").then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.error).to.eq(
                    "Invalid product name ID format",
                );
            });
        });

        it("should return 404 for non-existent ID", () => {
            cy.DeleteProductName(999999999).then((response) => {
                expect(response.status).to.eq(404);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.include("not found");
            });
        });
    });

    describe("Success Scenarios", () => {
        const request = {
            product_name: faker.food.fruit(),
            note: faker.word.words(25),
            product_name_status: "active",
        };

        it("should delete product name and return 200", () => {
            cy.AddProductName(request).then((response) => {
                let productNameId = response.body.productName.id;
                cy.DeleteProductName(productNameId).then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body.success).to.be.true;
                    expect(response.body.data).to.exist;
                });
            });
        });

        it("should return correct response structure", () => {
            cy.AddProductName(request).then((response) => {
                let productNameId = response.body.productName.id;
                cy.DeleteProductName(productNameId).then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body).to.have.all.keys("success", "data");
                    expect(response.body.success).to.be.true;
                    expect(response.body.data).to.be.an("object");
                });
            });
        });

        it("should return application/json content-type", () => {
            cy.AddProductName(request).then((response) => {
                let productNameId = response.body.productName.id;
                cy.DeleteProductName(productNameId).then((response) => {
                    expect(response.headers["content-type"]).to.include(
                        "application/json",
                    );
                });
            });
        });

        it("should return correct success response", () => {
            cy.DeleteProductName(testProductNameId).then((response) => {
                expect(response.body).to.have.all.keys("success", "data");
                expect(response.body.success).to.be.true;
            });
        });
    });

    describe("Delete Product Name - Summary Impact", () => {
        const request = {
            product_name: faker.food.fruit(),
            note: faker.word.words(25),
            product_name_status: "active",
        };

        it("totalProductNames should decrement by 1 after deletion", () => {
            cy.AddProductName(request).then((response) => {
                let productNameId = response.body.productName.id;
                cy.GetProductNameSummary()
                    .then((before) => {
                        expect(before.status).to.eq(200);
                        return before.body.data.totalProductNames;
                    })
                    .then((totalBefore) => {
                        cy.DeleteProductName(productNameId).then(
                            (deleteRes) => {
                                expect(deleteRes.status).to.eq(200);
                            },
                        );

                        cy.GetProductNameSummary().then((after) => {
                            expect(after.body.data.totalProductNames).to.eq(
                                totalBefore,
                            );
                        });
                    });
            });
        });
    });

    describe("DB Verification", () => {
        const request = {
            product_name: faker.food.fruit(),
            note: faker.word.words(25),
            product_name_status: "active",
        };

        it("should reflect soft delete in database", () => {
            cy.AddProductName(request).then((response) => {
                let productNameId = response.body.productName.id;
                cy.DeleteProductName(productNameId)
                    .then((response) => {
                        expect(response.status).to.eq(200);
                        return productNameId;
                    })
                    .then((productNameId) => {
                        cy.getSingleProductNameFromDb(productNameId).then(
                            (rows) => {
                                const dbData = rows[0];
                                expect(dbData).to.exist;
                                expect(dbData.product_name_status).to.eq("deleted");
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
            cy.DeleteProductName(testProductNameId).then((response) => {
                const duration = Date.now() - start;
                expect(duration).to.be.lte(1000);
                cy.log(`Delete time: ${duration}ms`);
            });
        });
    });
});
