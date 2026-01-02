import { randomString } from "../../../../support/common/helper";

describe("Product Brand API", () => {
    before(() => {
        cy.task("clearFixtureFile", "productBrandIds.json");
    });

    describe("Create", () => {
        it("should successfully add new product brand", () => {
            const testData = {
                text: randomString(10, "text"),
            };

            const request = {
                brand: testData.text,
                note: testData.text,
                brand_status: testData.text,
                brand_image: testData.text,
            };

            cy.AddNewProductBrand(request).then((response) => {
                expect(response.status).to.eq(200);

                cy.wrap(response.body.productBrand).as("apiProductBrand");
                cy.wrap(response.body.productBrand.id).as("productBrandId");

                cy.get("@productBrandId").then((id) => {
                    cy.task("getProductBrandListFromDbTask", id).then(
                        (dbProductBrand) => {
                            cy.get("@apiProductBrand").then(
                                (apiProductBrand) => {
                                    expect(apiProductBrand.brand).to.eq(
                                        dbProductBrand.brand
                                    );
                                    expect(apiProductBrand.note).to.eq(
                                        dbProductBrand.note
                                    );
                                    expect(apiProductBrand.brand_status).to.eq(
                                        dbProductBrand.brandStatus
                                    );
                                    expect(apiProductBrand.brand_image).to.eq(
                                        dbProductBrand.brandImage
                                    );
                                }
                            );
                        }
                    );
                });

                cy.saveProductBrandId(response.body.productBrand.id);
            });
        });

        it("should fail to add new product brand with missing required fields", () => {
            const request = {
                brand: "",
                note: "",
                brand_status: "",
                brand_image: "",
            };

            cy.AddNewProductBrand(request).then((response) => {
                expect(response.status).to.eq(400);

                cy.wrap(response.body.productBrand).as("apiProductBrand");

                const requiredErrors = [
                    "brand is required",
                    "note is required",
                    "brand status is required",
                    "brand image is required",
                ];

                requiredErrors.forEach((error) => {
                    expect(response.body.error).to.include(error);
                });
            });
        });

        it("should fail to add new product brand with invalid JSON", () => {
            cy.AddNewProductBrand().then((response) => {
                expect(response.status).to.eq(400);

                cy.wrap(response.body.productBrand).as("apiProductBrand");

                expect(response.body.error).to.include(
                    "Invalid JSON in request body"
                );
            });
        });

        it("should ensure deleted_at is null after successfully adding a new product brand", () => {
            const testData = {
                text: randomString(10, "text"),
            };

            const request = {
                brand: testData.text,
                note: testData.text,
                brand_status: testData.text,
                brand_image: testData.text,
            };

            cy.AddNewProductBrand(request).then((response) => {
                expect(response.status).to.eq(200);

                cy.wrap(response.body.productBrand.id).as("productBrandId");

                cy.get("@productBrandId").then((id) => {
                    cy.task("getProductBrandListFromDbTask", id).then(
                        (dbProductBrand) => {
                            expect(response.body.productBrand.deleted_at).to.eq(
                                dbProductBrand.deletedAt
                            );
                            expect(response.body.productBrand.deleted_at).to.be
                                .null;
                        }
                    );
                });
            });
        });
    });

    describe("Update", () => {
        it("should fail to update product brand with invalid ID", () => {
            const text = randomString(4, "text").toUpperCase();
            const invalidId = text;

            cy.UpdateProductBrand(invalidId).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.error).to.include(
                    "Invalid product brand ID provided"
                );
            });
        });

        it("should successfully update product brand", () => {
            const testData = {
                text: randomString(10, "text"),
            };

            const request = {
                brand: testData.text,
                note: testData.text,
                brand_status: testData.text,
                brand_image: testData.text,
            };

            let apiProductBrand;

             cy.task("getRandomProductBrandId")
                 .then((id) => cy.UpdateProductBrand(id, request))
                 .then((response) => {
                     expect(response.status).to.eq(200);
                     apiProductBrand = response.body.productBrand;
                     return cy.task(
                         "getProductBrandListFromDbTask",
                         apiProductBrand.id
                     );
                 })
                 .then((dbProductBrand) => {
                     expect(apiProductBrand.brand).to.eq(dbProductBrand.brand);
                     expect(apiProductBrand.note).to.eq(dbProductBrand.note);
                     expect(apiProductBrand.brand_status).to.eq(
                         dbProductBrand.brandStatus
                     );
                     expect(apiProductBrand.brand_image).to.eq(
                         dbProductBrand.brandImage
                     );
                 });
        });

        it("should fail to update product brand with missing required fields", () => {
            const request = {
                brand: "",
                note: "",
                brand_status: "",
                brand_image: "",
            };

            cy.task("getRandomProductBrandId").then((randomId) => {
                cy.UpdateProductBrand(randomId, request).then((response) => {
                    expect(response.status).to.eq(400);

                    const requiredErrors = [
                        "brand is required",
                        "note is required",
                        "brand status is required",
                        "brand image is required",
                    ];

                    requiredErrors.forEach((error) => {
                        expect(response.body.error).to.include(error);
                    });
                });
            });
        });

        it("should ensure deleted_at is null after successfully updating a product brand", () => {
            const testData = {
                text: randomString(10, "text"),
            };

            const request = {
                brand: testData.text,
                note: testData.text,
                brand_status: testData.text,
                brand_image: testData.text,
            };

            let apiProductBrand;

            cy.task("getRandomProductBrandId")
                .then((id) => cy.UpdateProductBrand(id, request))
                .then((response) => {
                    expect(response.status).to.eq(200);
                    apiProductBrand = response.body.productBrand;
                    return cy.task(
                        "getProductBrandListFromDbTask",
                        apiProductBrand.id
                    );
                })
                .then((dbProductBrand) => {
                    expect(apiProductBrand.deleted_at).to.eq(
                        dbProductBrand.deletedAt
                    );
                    expect(apiProductBrand.deleted_at).to.be.null;
                });
        });

        it("should fail to update product brand with invalid JSON", () => {
            cy.task("getRandomProductBrandId").then((randomId) => {
                cy.UpdateProductBrand(randomId).then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body.error).to.include(
                        "Invalid JSON in request body"
                    );
                });
            });
        });
    });

    describe("Delete", () => {
        it("should successfully delete product brand", () => {
            const testData = {
                text: randomString(10, "text"),
            };

            const request = {
                brand: testData.text,
                note: testData.text,
                brand_status: testData.text,
                brand_image: testData.text,
            };

            cy.AddNewProductBrand(request)
                .then((response) => {
                    cy.wrap(response.body.productBrand.id).as(
                        "productBrandIdToDelete"
                    );
                })
                .then(() => {
                    cy.get("@productBrandIdToDelete").then((id) => {
                        cy.DeleteProductBrand(id).then((deleteResponse) => {
                            expect(deleteResponse.status).to.eq(200);
                            cy.task("getProductBrandListFromDbTask", id).then(
                                (dbProductBrand) => {
                                    expect(dbProductBrand).to.be.null;
                                }
                            );
                        });
                    });
                });
        });

        it("should fail with invalid ID", () => {
            cy.DeleteProductBrand("abc").then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.error).to.eq(
                    "Invalid product brand ID provided"
                );
            });
        });
    });
});
