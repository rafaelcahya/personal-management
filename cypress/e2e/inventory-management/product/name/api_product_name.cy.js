import { randomString } from "../../../../support/common/helper";

describe("Product Name API", () => {
    before(() => {
        cy.task("clearFixtureFile", "productNameIds.json");
    });

    describe("Create", () => {
        it("should successfully add new product name", () => {
            const testData = {
                text: randomString(10, "text"),
            };

            const request = {
                product_name: testData.text,
                product_name_status: testData.text,
                note: testData.text,
            };

            cy.AddNewProductName(request).then((response) => {
                expect(response.status).to.eq(200);

                cy.wrap(response.body.productName).as("apiProductName");
                cy.wrap(response.body.productName.id).as("productNameId");

                cy.get("@productNameId").then((id) => {
                    cy.task("getProductNameListFromDbTask", id).then(
                        (dbProductName) => {
                            cy.get("@apiProductName").then((apiProductName) => {
                                expect(apiProductName.product_name).to.eq(
                                    dbProductName.productName
                                );
                                expect(apiProductName.product_name_status).to.eq(
                                    dbProductName.productNameStatus
                                );
                                expect(apiProductName.note).to.eq(
                                    dbProductName.note
                                );
                            });
                        }
                    );
                });

                cy.saveProductBrandId(response.body.productName.id);
            });
        });

        it("should fail to add new product name with missing required fields", () => {
            const request = {
                product_name: "",
                product_name_status: "",
            };

            cy.AddNewProductName(request).then((response) => {
                expect(response.status).to.eq(400);

                cy.wrap(response.body.productName).as("apiProductName");

                const requiredErrors = [
                    "product name is required",
                    "product name status is required",
                ];

                requiredErrors.forEach((error) => {
                    expect(response.body.error).to.include(error);
                });
            });
        });

        it("should fail to add new product name with invalid JSON", () => {
            cy.AddNewProductName().then((response) => {
                expect(response.status).to.eq(400);

                cy.wrap(response.body.productName).as("apiProductName");

                expect(response.body.error).to.include(
                    "Invalid JSON in request body"
                );
            });
        });

        it("should ensure deleted_at is null after successfully adding a new product name", () => {
            const testData = {
                text: randomString(10, "text"),
            };

            const request = {
                product_name: testData.text,
                product_name_status: testData.text,
                note: testData.text,
            };

            cy.AddNewProductName(request).then((response) => {
                expect(response.status).to.eq(200);

                cy.wrap(response.body.productName.id).as("productNameId");

                cy.get("@productNameId").then((id) => {
                    cy.task("getProductNameListFromDbTask", id).then(
                        (dbProductName) => {
                            expect(response.body.productName.deleted_at).to.eq(
                                dbProductName.deletedAt
                            );
                            expect(response.body.productName.deleted_at).to.be
                                .null;
                        }
                    );
                });
            });
        });
    });

    describe("Update", () => {
        it("should fail to update product name with invalid ID", () => {
            const text = randomString(4, "text").toUpperCase();
            const invalidId = text;

            cy.UpdateProductName(invalidId).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.error).to.include(
                    "Invalid product name ID provided"
                );
            });
        });

        it("should successfully update product name", () => {
            const testData = {
                text: randomString(10, "text"),
            };

            const request = {
                product_name: testData.text,
                product_name_status: testData.text,
                note: testData.text,
            };

            cy.task("getRandomProductBrandId")
                .then((id) => cy.UpdateProductName(id, request))
                .then((response) => {
                    expect(response.status).to.eq(200);

                    const apiProductName = response.body.productName;
                    cy.wrap(apiProductName).as("apiProductName");
                    cy.wrap(apiProductName.id).as("productNameId");
                })
                .then(() => {
                    cy.get("@productNameId").then((productNameId) => {
                        return cy.task(
                            "getProductNameListFromDbTask",
                            productNameId
                        );
                    });
                })
                .then((dbProductName) => {
                    cy.get("@apiProductName").then((apiProductName) => {
                        expect(apiProductName.product_name).to.eq(
                            dbProductName.productName
                        );
                        expect(apiProductName.product_name_status).to.eq(
                            dbProductName.productNameStatus
                        );
                        expect(apiProductName.note).to.eq(dbProductName.note);
                    });
                });
        });

        it("should fail to update product name with missing required fields", () => {
            const request = {
                product_name: "",
                product_name_status: "",
            };

            cy.task("getRandomProductBrandId").then((randomId) => {
                cy.UpdateProductName(randomId, request).then((response) => {
                    expect(response.status).to.eq(400);

                    const requiredErrors = [
                        "product name is required",
                        "product name status is required",
                    ];

                    requiredErrors.forEach((error) => {
                        expect(response.body.error).to.include(error);
                    });
                });
            });
        });

        it("should ensure deleted_at is null after successfully updating a product name", () => {
            const testData = {
                text: randomString(10, "text"),
            };

            const request = {
                product_name: testData.text,
                product_name_status: testData.text,
                note: testData.text,
            };

            let apiProductName;

            cy.task("getRandomProductBrandId")
                .then((id) => cy.UpdateProductName(id, request))
                .then((response) => {
                    expect(response.status).to.eq(200);
                    apiProductName = response.body.productName;
                    return cy.task(
                        "getProductNameListFromDbTask",
                        apiProductName.id
                    );
                })
                .then((dbProductName) => {
                    expect(apiProductName.deleted_at).to.eq(
                        dbProductName.deletedAt
                    );
                    expect(apiProductName.deleted_at).to.be.null;
                });
        });

        it("should fail to update product name with invalid JSON", () => {
            cy.task("getRandomProductBrandId").then((randomId) => {
                cy.UpdateProductName(randomId).then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body.error).to.include(
                        "Invalid JSON in request body"
                    );
                });
            });
        });
    });

    describe("Delete", () => {
        it("should successfully delete product name", () => {
            const testData = {
                text: randomString(10, "text"),
            };

            const request = {
                product_name: testData.text,
                product_name_status: testData.text,
                note: testData.text,
            };

            cy.AddNewProductName(request)
                .then((response) => {
                    cy.wrap(response.body.productName.id).as(
                        "productBrandIdToDelete"
                    );
                })
                .then(() => {
                    cy.get("@productBrandIdToDelete").then((id) => {
                        cy.DeleteProductName(id).then((deleteResponse) => {
                            expect(deleteResponse.status).to.eq(200);
                            cy.task("getProductNameListFromDbTask", id).then(
                                (dbProductName) => {
                                    expect(dbProductName).to.be.null;
                                }
                            );
                        });
                    });
                });
        });

        it("should fail with invalid ID", () => {
            cy.DeleteProductName("abc").then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.error).to.eq(
                    "Invalid product name ID provided"
                );
            });
        });
    });
});
