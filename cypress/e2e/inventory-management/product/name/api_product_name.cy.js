import { faker } from "@faker-js/faker";
import { randomString } from "../../../../support/common/helper";

describe("Product Name API", () => {
    before(() => {
        cy.task("clearFixtureFile", "productNameIds.json");
    });

    describe("Summary", () => {
        it("should display correct total product names summary", () => {
            cy.GetProductNameSummary().then((apiSummary) => {
                cy.task("getProductNameSummaryFromDbTask").then((dbSummary) => {
                    expect(apiSummary.totalProductNames).to.eq(
                        dbSummary.totalProductNames
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
                });
            });
        });
    });

    describe("Create", () => {
        it("should successfully add new product name with active", () => {
            const request = {
                product_name: faker.book.title(),
                product_name_status: "active",
                note: faker.book.format(),
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
                                expect(
                                    apiProductName.product_name_status
                                ).to.eq(dbProductName.productNameStatus);
                                expect(apiProductName.note).to.eq(
                                    dbProductName.note
                                );
                                expect(dbProductName.deletedAt).to.be.null;
                            });
                        }
                    );
                });

                cy.saveProductNameId(response.body.productName.id);
            });
        });

        it("should total active product name is increase by 1 after add new product name with active status", () => {
            const request = {
                product_name: faker.book.title(),
                note: faker.book.format(),
                product_name_status: "active",
            };

            cy.GetProductNameSummary()
                .then((summary) => {
                    cy.wrap(summary.totalStatus.active).as(
                        "initialTotalActive"
                    );
                })

                .then(() => cy.AddNewProductName(request))

                .then(() =>
                    cy.GetProductNameSummary().then((finalSummary) => {
                        cy.get("@initialTotalActive").then(
                            (initialTotalActive) => {
                                expect(finalSummary.totalStatus.active).to.eq(
                                    initialTotalActive + 1
                                );
                            }
                        );
                    })
                );
        });

        it("should total product name is increase by 1 after add new product name with active status", () => {
            const request = {
                product_name: faker.book.title(),
                note: faker.book.format(),
                product_name_status: "active",
            };

            cy.GetProductNameSummary()
                .then((summary) => {
                    cy.wrap(summary.totalProductNames).as(
                        "initialTotalProductNames"
                    );
                })

                .then(() => cy.AddNewProductName(request))

                .then(() =>
                    cy.GetProductNameSummary().then((finalSummary) => {
                        cy.get("@initialTotalProductNames").then(
                            (initialTotalProductNames) => {
                                expect(finalSummary.totalProductNames).to.eq(
                                    initialTotalProductNames + 1
                                );
                            }
                        );
                    })
                );
        });

        it("should successfully add new product name with inactive", () => {
            const request = {
                product_name: faker.book.title(),
                product_name_status: "inactive",
                note: faker.book.format(),
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
                                expect(
                                    apiProductName.product_name_status
                                ).to.eq(dbProductName.productNameStatus);
                                expect(apiProductName.note).to.eq(
                                    dbProductName.note
                                );
                                expect(dbProductName.deletedAt).to.be.null;
                            });
                        }
                    );
                });

                cy.saveProductNameId(response.body.productName.id);
            });
        });

        it("should total active product name is increase by 1 after add new product name with inactive status", () => {
            const request = {
                product_name: faker.book.title(),
                note: faker.book.format(),
                product_name_status: "inactive",
            };

            cy.GetProductNameSummary()
                .then((summary) => {
                    cy.wrap(summary.totalStatus.inactive).as(
                        "initialTotalInactive"
                    );
                })

                .then(() => cy.AddNewProductName(request))

                .then(() =>
                    cy.GetProductNameSummary().then((finalSummary) => {
                        cy.get("@initialTotalInactive").then(
                            (initialTotalInactive) => {
                                expect(finalSummary.totalStatus.inactive).to.eq(
                                    initialTotalInactive + 1
                                );
                            }
                        );
                    })
                );
        });

        it("should total product name is increase by 1 after add new product name with inactive status", () => {
            const request = {
                product_name: faker.book.title(),
                note: faker.book.format(),
                product_name_status: "inactive",
            };

            cy.GetProductNameSummary()
                .then((summary) => {
                    cy.wrap(summary.totalProductNames).as(
                        "initialTotalProductNames"
                    );
                })

                .then(() => cy.AddNewProductName(request))

                .then(() =>
                    cy.GetProductNameSummary().then((finalSummary) => {
                        cy.get("@initialTotalProductNames").then(
                            (initialTotalProductNames) => {
                                expect(finalSummary.totalProductNames).to.eq(
                                    initialTotalProductNames + 1
                                );
                            }
                        );
                    })
                );
        });

        it("should successfully add new product name with deleted status", () => {
            const request = {
                product_name: faker.book.title(),
                product_name_status: "deleted",
                note: faker.book.format(),
                deleted_at: new Date().toISOString().replace("Z", "+00:00"),
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
                                expect(
                                    apiProductName.product_name_status
                                ).to.eq(dbProductName.productNameStatus);
                                expect(apiProductName.note).to.eq(
                                    dbProductName.note
                                );
                                expect(dbProductName.deletedAt).to.be.not.null;
                            });
                        }
                    );
                });

                cy.saveProductNameId(response.body.productName.id);
            });
        });

        it("should total active product name is increase by 1 after add new product name with deleted status", () => {
            const request = {
                product_name: faker.book.title(),
                note: faker.book.format(),
                product_name_status: "deleted",
            };

            cy.GetProductNameSummary()
                .then((summary) => {
                    cy.wrap(summary.totalStatus.deleted).as(
                        "initialTotalDeleted"
                    );
                })

                .then(() => cy.AddNewProductName(request))

                .then(() =>
                    cy.GetProductNameSummary().then((finalSummary) => {
                        cy.get("@initialTotalDeleted").then(
                            (initialTotalDeleted) => {
                                expect(finalSummary.totalStatus.deleted).to.eq(
                                    initialTotalDeleted + 1
                                );
                            }
                        );
                    })
                );
        });

        it("should total product name is increase by 1 after add new product name with deleted status", () => {
            const request = {
                product_name: faker.book.title(),
                note: faker.book.format(),
                product_name_status: "deleted",
            };

            cy.GetProductNameSummary()
                .then((summary) => {
                    cy.wrap(summary.totalProductNames).as(
                        "initialTotalProductNames"
                    );
                })

                .then(() => cy.AddNewProductName(request))

                .then(() =>
                    cy.GetProductNameSummary().then((finalSummary) => {
                        cy.get("@initialTotalProductNames").then(
                            (initialTotalProductNames) => {
                                expect(finalSummary.totalProductNames).to.eq(
                                    initialTotalProductNames + 1
                                );
                            }
                        );
                    })
                );
        });

        it("should fail to add new product name with missing required fields", () => {
            const request = {
                product_name: "",
            };

            cy.AddNewProductName(request).then((response) => {
                expect(response.status).to.eq(400);

                cy.wrap(response.body.productName).as("apiProductName");

                const requiredErrors = ["product name is required"];

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

        it("should ensure deleted_at is null after successfully adding a new product name with status active", () => {
            const request = {
                product_name: faker.book.title(),
                product_name_status: "active",
                note: faker.book.format(),
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

        it("should ensure deleted_at is null after successfully adding a new product name with status inactive", () => {
            const request = {
                product_name: faker.book.title(),
                product_name_status: "inactive",
                note: faker.book.format(),
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

        it("should ensure deleted_at is not null after successfully adding a new product name with status deleted", () => {
            const request = {
                product_name: faker.book.title(),
                product_name_status: "deleted",
                note: faker.book.format(),
                deleted_at: null,
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
                                .not.null;
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

        it("should successfully update product name with status active", () => {
            const request = {
                product_name: faker.book.title(),
                product_name_status: "active",
                note: faker.book.format(),
            };

            let apiProductName;

            cy.task("getRandomProductNameId")
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
                    expect(apiProductName.product_name).to.eq(
                        dbProductName.productName
                    );
                    expect(apiProductName.product_name_status).to.eq(
                        dbProductName.productNameStatus
                    );
                    expect(apiProductName.note).to.eq(dbProductName.note);
                    expect(dbProductName.deletedAt).to.be.null;
                });
        });

        it("should successfully update product name with status inactive", () => {
            const request = {
                product_name: faker.book.title(),
                product_name_status: "inactive",
                note: faker.book.format(),
            };

            let apiProductName;

            cy.task("getRandomProductNameId")
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
                    expect(apiProductName.product_name).to.eq(
                        dbProductName.productName
                    );
                    expect(apiProductName.product_name_status).to.eq(
                        dbProductName.productNameStatus
                    );
                    expect(apiProductName.note).to.eq(dbProductName.note);
                    expect(dbProductName.deletedAt).to.be.null;
                });
        });

        it("should successfully update product name with status deleted", () => {
            const request = {
                product_name: faker.book.title(),
                product_name_status: "deleted",
                note: faker.book.format(),
            };

            let apiProductName;

            cy.task("getRandomProductNameId")
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
                    expect(apiProductName.product_name).to.eq(
                        dbProductName.productName
                    );
                    expect(apiProductName.product_name_status).to.eq(
                        dbProductName.productNameStatus
                    );
                    expect(apiProductName.note).to.eq(dbProductName.note);
                    expect(dbProductName.deletedAt).to.be.null;
                });
        });

        it("should fail to update product name with missing required fields", () => {
            const request = {
                product_name: "",
            };

            cy.task("getRandomProductNameId").then((randomId) => {
                cy.UpdateProductName(randomId, request).then((response) => {
                    expect(response.status).to.eq(400);

                    const requiredErrors = ["product name is required"];

                    requiredErrors.forEach((error) => {
                        expect(response.body.error).to.include(error);
                    });
                });
            });
        });

        it("should ensure deleted_at is null after successfully updating a product name with status active", () => {
            const request = {
                product_name: faker.book.title(),
                product_name_status: "active",
                note: faker.book.format(),
            };

            let apiProductName;

            cy.task("getRandomProductNameId")
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

        it("should ensure deleted_at is null after successfully updating a product name with status inactive", () => {
            const request = {
                product_name: faker.book.title(),
                product_name_status: "inactive",
                note: faker.book.format(),
            };

            let apiProductName;

            cy.task("getRandomProductNameId")
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

        it("should ensure deleted_at is null after successfully updating a product name with status deleted", () => {
            const request = {
                product_name: faker.book.title(),
                product_name_status: "deleted",
                note: faker.book.format(),
            };

            let apiProductName;

            cy.task("getRandomProductNameId")
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
            cy.task("getRandomProductNameId").then((randomId) => {
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
            const request = {
                product_name: faker.book.title(),
                product_name_status: faker.book.genre(),
                note: faker.book.format(),
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
                                    expect(dbProductName).to.be.not.null;
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
