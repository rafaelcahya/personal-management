import { randomString } from "../../../support/common/helper";

describe("Brand API", () => {
    before(() => {
        cy.task("clearFixtureFile", "productIds.json");
    });

    describe("Create", () => {
        it("should successfully add new brand", () => {
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

                cy.wrap(response.body.brand).as("apiBrand");
                cy.wrap(response.body.brand.id).as("brandId");

                cy.get("@brandId").then((id) => {
                    cy.task("getProductBrandListFromDbTask", id).then(
                        (dbProduct) => {
                            cy.get("@apiBrand").then((apiBrand) => {
                                expect(apiBrand.brand).to.eq(dbProduct.brand);
                                expect(apiBrand.note).to.eq(dbProduct.note);
                                expect(apiBrand.brand_status).to.eq(
                                    dbProduct.brandStatus
                                );
                                expect(apiBrand.brand_image).to.eq(
                                    dbProduct.brandImage
                                );
                            });
                        }
                    );
                });

                cy.saveProductBrandId(response.body.brand.id);
            });
        });

        it("should fail to add new brand with missing required fields", () => {
            const request = {
                brand: "",
                note: "",
                brand_status: "",
                brand_image: "",
            };

            cy.AddNewProductBrand(request).then((response) => {
                expect(response.status).to.eq(400);

                cy.wrap(response.body.brand).as("apiBrand");

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

        it("should fail to add new brand with invalid JSON", () => {
            cy.AddNewProductBrand().then((response) => {
                expect(response.status).to.eq(400);

                cy.wrap(response.body.brand).as("apiBrand");

                expect(response.body.error).to.include(
                    "Invalid JSON in request body"
                );
            });
        });

        it("should ensure deleted_at is null after successfully adding a new brand", () => {
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

                cy.wrap(response.body.brand.id).as("brandId");

                cy.get("@brandId").then((id) => {
                    cy.task("getProductBrandListFromDbTask", id).then(
                        (dbUser) => {
                            expect(response.body.brand.deleted_at).to.eq(
                                dbUser.deletedAt
                            );
                            expect(response.body.brand.deleted_at).to.be.null;
                        }
                    );
                });
            });
        });
    });

    describe("Update", () => {
        it("should fail to update brand with invalid ID", () => {
            const text = randomString(4, "text").toUpperCase();
            const invalidId = text;

            cy.UpdateProductBrand(invalidId).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.error).to.include(
                    "Invalid brand ID provided"
                );
            });
        });

        it("should successfully update brand", () => {
            const testData = {
                text: randomString(10, "text"),
            };

            const request = {
                brand: testData.text,
                note: testData.text,
                brand_status: testData.text,
                brand_image: testData.text,
            };

            cy.task("getRandomProductBrandId")
                .then((id) => cy.UpdateProductBrand(id, request))
                .then((response) => {
                    expect(response.status).to.eq(200);

                    const apiBrand = response.body.brand;
                    cy.wrap(apiBrand).as("apiBrand");
                    cy.wrap(apiBrand.id).as("brandId");
                })
                .then(() => {
                    cy.get("@brandId").then((brandId) => {
                        return cy.task(
                            "getProductBrandListFromDbTask",
                            brandId
                        );
                    });
                })
                .then((dbProduct) => {
                    cy.get("@apiBrand").then((apiBrand) => {
                        expect(apiBrand.brand).to.eq(dbProduct.brand);
                        expect(apiBrand.note).to.eq(dbProduct.note);
                        expect(apiBrand.brand_status).to.eq(
                            dbProduct.brandStatus
                        );
                        expect(apiBrand.brand_image).to.eq(
                            dbProduct.brandImage
                        );
                    });
                });
        });

        it("should fail to update brand with missing required fields", () => {
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

        it("should ensure deleted_at is null after successfully updating a brand", () => {
            const testData = {
                text: randomString(10, "text"),
            };

            const request = {
                brand: testData.text,
                note: testData.text,
                brand_status: testData.text,
                brand_image: testData.text,
            };

            let apiBrand;

            cy.task("getRandomProductBrandId")
                .then((id) => cy.UpdateProductBrand(id, request))
                .then((response) => {
                    expect(response.status).to.eq(200);
                    apiBrand = response.body.brand;
                    return cy.task(
                        "getProductBrandListFromDbTask",
                        apiBrand.id
                    );
                })
                .then((dbProduct) => {
                    expect(apiBrand.deleted_at).to.eq(dbProduct.deletedAt);
                    expect(apiBrand.deleted_at).to.be.null;
                });
        });

        it("should fail to update brand with invalid JSON", () => {
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
        it("should successfully delete brand", () => {
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
                    cy.wrap(response.body.brand.id).as(
                        "productBrandIdToDelete"
                    );
                })
                .then(() => {
                    cy.get("@productBrandIdToDelete").then((id) => {
                        cy.DeleteProductBrand(id).then((deleteResponse) => {
                            expect(deleteResponse.status).to.eq(200);
                            cy.task("getProductBrandListFromDbTask", id).then(
                                (dbProduct) => {
                                    expect(dbProduct).to.be.null;
                                }
                            );
                        });
                    });
                });
        });

        it("should fail with invalid ID", () => {
            cy.DeleteProductBrand("abc").then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.error).to.eq("Invalid brand ID provided");
            });
        });
    });
});
