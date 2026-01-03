import { faker } from "@faker-js/faker";
import { randomString } from "../../../../support/common/helper";

describe("Product Brand API", () => {
    before(() => {
        cy.task("clearFixtureFile", "productBrandIds.json");
    });

    describe("Summary", () => {
        it("should display correct total products summary", () => {
            cy.GetProductBrandSummary().then((apiSummary) => {
                cy.task("getProductBrandSummaryFromDbTask").then(
                    (dbSummary) => {
                        expect(apiSummary.totalProductBrands).to.eq(
                            dbSummary.totalProductBrands
                        );
                        expect(apiSummary.totalStatus.active).to.eq(
                            dbSummary.totalStatus.active
                        );
                        expect(apiSummary.totalStatus.inactive).to.eq(
                            dbSummary.totalStatus.inactive
                        );
                        expect(apiSummary.totalStatus.deleted).to.eq(
                            dbSummary.totalStatus.deleted
                        );
                    }
                );
            });
        });
    });

    describe("Create", () => {
        it("should successfully add new product brand with active status", () => {
            const request = {
                brand: faker.company.name(),
                note: faker.commerce.productDescription(),
                brand_status: "active",
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
                                    expect(
                                        response.body.productBrand.deleted_at
                                    ).to.be.null;
                                }
                            );
                        }
                    );
                });

                cy.saveProductBrandId(response.body.productBrand.id);
            });
        });

        it("should successfully add new product brand with inactive status", () => {
            const request = {
                brand: faker.company.name(),
                note: faker.commerce.productDescription(),
                brand_status: "inactive",
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
                                    expect(
                                        response.body.productBrand.deleted_at
                                    ).to.be.null;
                                }
                            );
                        }
                    );
                });

                cy.saveProductBrandId(response.body.productBrand.id);
            });
        });

        it("should successfully add new product brand with deleted status", () => {
            const request = {
                brand: faker.company.name(),
                note: faker.commerce.productDescription(),
                brand_status: "deleted",
                deleted_at: new Date().toISOString().replace("Z", "+00:00"),
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
                                    expect(dbProductBrand.deletedAt).to.be.not
                                        .null;
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
            };

            cy.AddNewProductBrand(request).then((response) => {
                expect(response.status).to.eq(400);

                cy.wrap(response.body.productBrand).as("apiProductBrand");

                const requiredErrors = ["brand is required"];

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

        it("should ensure deleted_at is null after successfully adding a new product brand with status active", () => {
            const request = {
                brand: faker.company.name(),
                note: faker.commerce.productDescription(),
                brand_status: "active",
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

        it("should ensure deleted_at is null after successfully adding a new product brand with status inactive", () => {
            const request = {
                brand: faker.company.name(),
                note: faker.commerce.productDescription(),
                brand_status: "inactive",
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

        it("should ensure deleted_at is not null after successfully adding a new product brand with status deleted", () => {
            const request = {
                brand: faker.company.name(),
                note: faker.commerce.productDescription(),
                brand_status: "deleted",
                deleted_at: null,
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
                                .not.null;
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

        it("should successfully update product brand to status active", () => {
            const request = {
                brand: faker.company.name(),
                note: faker.commerce.productDescription(),
                brand_status: "active",
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
                    expect(dbProductBrand.deletedAt).to.be.null;
                });
        });

        it("should successfully update product brand to status inactive", () => {
            const request = {
                brand: faker.company.name(),
                note: faker.commerce.productDescription(),
                brand_status: "inactive",
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
                    expect(dbProductBrand.deletedAt).to.be.null;
                });
        });

        it("should successfully update product brand to status deleted", () => {
            const request = {
                brand: faker.company.name(),
                note: faker.commerce.productDescription(),
                brand_status: "deleted",
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
                    expect(dbProductBrand.deletedAt).to.be.not.null;
                });
        });

        it("should fail to update product brand with missing required fields", () => {
            const request = {
                brand: "",
                note: "",
                brand_status: "",
            };

            cy.task("getRandomProductBrandId").then((randomId) => {
                cy.UpdateProductBrand(randomId, request).then((response) => {
                    expect(response.status).to.eq(400);

                    const requiredErrors = ["brand is required"];

                    requiredErrors.forEach((error) => {
                        expect(response.body.error).to.include(error);
                    });
                });
            });
        });

        it("should ensure deleted_at is null after successfully updating a product brand to status active", () => {
            const request = {
                brand: faker.company.name(),
                note: faker.commerce.productDescription(),
                brand_status: "active",
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

        it("should ensure deleted_at is null after successfully updating a product brand to status inactive", () => {
            const request = {
                brand: faker.company.name(),
                note: faker.commerce.productDescription(),
                brand_status: "inactive",
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

        it("should ensure deleted_at is not null after successfully updating a product brand to status deleted", () => {
            const request = {
                brand: faker.company.name(),
                note: faker.commerce.productDescription(),
                brand_status: "deleted",
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
                    expect(apiProductBrand.deleted_at).to.be.not.null;
                });
        });

        it("should ensure deleted_at is not null after successfully updating a product brand to status deleted", () => {
            const request = {
                brand: faker.company.name(),
                note: faker.commerce.productDescription(),
                brand_status: "deleted",
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
                    expect(apiProductBrand.deleted_at).to.be.not.null;
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
                brand: faker.company.name(),
                note: faker.commerce.productDescription(),
                brand_status: testData.text,
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
                                    expect(dbProductBrand.deletedAt).to.be.not.null;
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
