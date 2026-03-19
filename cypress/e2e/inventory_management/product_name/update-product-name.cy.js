import { faker } from "@faker-js/faker";

describe("Product Name Update API", () => {
    let testProductNameId;
    let testUserId;

    before(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
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

    describe("Authentication & Authorization", () => {
        it("should update product name successfully (200)", () => {
            const request = {
                product_name: faker.food.fruit(),
                note: faker.word.words(25),
                product_name_status: "active",
            };

            cy.UpdateProductName(testProductNameId, request).then(
                (response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body.success).to.be.true;
                    expect(response.body.productName).to.exist;
                },
            );
        });

        it("should return 307 or 401 without authentication", () => {
            cy.clearCookies();
            cy.UpdateProductNameNoAuth(testProductNameId, {
                product_name: faker.food.fruit(),
                note: faker.word.words(25),
                product_name_status: "active",
            }).then((response) => {
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

    describe("ID Validation", () => {
        it("should return 400 for non-numeric ID", () => {
            cy.UpdateProductName("abc", {
                product_name: faker.food.fruit(),
                note: faker.word.words(25),
                product_name_status: "active",
            }).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.eq(
                    "Invalid product name ID provided",
                );
            });
        });

        it("should return 400 for missing ID", () => {
            cy.UpdateProductName(null, {
                product_name: faker.food.fruit(),
                note: faker.word.words(25),
                product_name_status: "active",
            }).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.eq(
                    "Invalid product name ID provided",
                );
            });
        });
    });

    describe("Product Name Object Structure Scenarios", () => {
        it("should update product name with all required fields", () => {
            const request = {
                product_name: faker.food.fruit(),
                note: faker.word.words(25),
                product_name_status: "active",
            };

            cy.UpdateProductName(testProductNameId, request).then(
                (response) => {
                    const productName = response.body.productName;
                    expect(productName).to.have.property("id");
                    expect(productName).to.have.property("product_name");
                    expect(productName).to.have.property("product_name_status");
                    expect(productName).to.have.property("note");
                    expect(productName).to.have.property("user_id");
                    expect(productName).to.have.property("created_at");
                    expect(productName).to.have.property("updated_at");
                    expect(productName).to.have.property("deleted_at");
                    expect(productName).to.have.property("uuid");
                },
            );
        });

        it("should return complete updated product name object", () => {
            const request = {
                product_name: faker.food.fruit(),
                note: faker.word.words(25),
                product_name_status: "active",
            };

            cy.UpdateProductName(testProductNameId, request).then(
                (response) => {
                    const productName = response.body.productName;
                    expect(productName).to.have.all.keys([
                        "created_at",
                        "deleted_at",
                        "product_name",
                        "product_name_status",
                        "id",
                        "note",
                        "updated_at",
                        "user_id",
                        "uuid",
                    ]);
                },
            );
        });

        it("should return correct success response structure", () => {
            const request = {
                product_name: faker.food.fruit(),
                note: faker.word.words(25),
                product_name_status: "active",
            };

            cy.UpdateProductName(testProductNameId, request).then(
                (response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body).to.have.all.keys(
                        "success",
                        "productName",
                    );
                    expect(response.body.success).to.be.true;
                    expect(response.body.productName).to.be.an("object");
                },
            );
        });

        it("should return correct error response structure", () => {
            cy.UpdateProductName().then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body).to.have.all.keys("success", "error");
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.exist;
            });
        });
    });

    describe("Success Scenario", () => {
        it("should update product name successfully (200)", () => {
            const request = {
                product_name: faker.food.fruit(),
                note: faker.word.words(25),
                product_name_status: "active",
            };

            cy.UpdateProductName(testProductNameId, request).then(
                (response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body.success).to.be.true;

                    const exactFields = [
                        "product_name_status",
                        "note",
                        "product_name",
                    ];
                    exactFields.forEach((field) => {
                        expect(response.body.productName[field]).to.eq(
                            request[field],
                        );
                    });

                    cy.log("✅ All fields updated:", JSON.stringify(request));
                },
            );
        });

        it("should assign user_id from authenticated user", () => {
            const request = {
                product_name: faker.food.fruit(),
                note: faker.word.words(25),
                product_name_status: "active",
            };

            cy.UpdateProductName(testProductNameId, request).then(
                (response) => {
                    expect(response.status).to.eq(200);

                    const productName = response.body.productName;
                    expect(productName.user_id).to.exist;
                    expect(productName.user_id).to.be.a("string");
                    expect(productName.user_id.length).to.be.greaterThan(0);

                    cy.log(`✅ User ID assigned: ${productName.user_id}`);
                },
            );
        });

        it("should generate timestamps (created_at, updated_at)", () => {
            const request = {
                product_name: faker.food.fruit(),
                note: faker.word.words(25),
                product_name_status: "active",
            };

            cy.UpdateProductName(testProductNameId, request).then(
                (response) => {
                    expect(response.status).to.eq(200);

                    const productName = response.body.productName;
                    expect(productName.created_at).to.exist;
                    expect(productName.updated_at).to.exist;

                    expect(
                        new Date(productName.created_at).toString(),
                    ).to.not.eq("Invalid Date");

                    cy.log("✅ Timestamps generated correctly");
                },
            );
        });

        it("should not change user_id after update", () => {
            cy.UpdateProductName(testProductNameId, {
                product_name: faker.food.fruit(),
                product_name_status: "active",
                note: faker.word.words(25),
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.productName.user_id).to.eq(testUserId);
            });
        });

        it("updated_at should be more recent than created_at after update", () => {
            cy.UpdateProductName(testProductNameId, {
                product_name: faker.food.fruit(),
                product_name_status: "active",
            }).then((response) => {
                expect(response.status).to.eq(200);
                const { created_at, updated_at } = response.body.productName;
                expect(new Date(updated_at).getTime()).to.be.gte(
                    new Date(created_at).getTime(),
                );
            });
        });
    });

    describe("Data Integrity - API vs Database Comparison", () => {
        beforeEach(() => {
            const request = {
                product_name: faker.food.fruit(),
                note: faker.word.words(25),
                product_name_status: "active",
            };

            cy.UpdateProductName(testProductNameId, request).then(
                (response) => {
                    expect(response.status).to.eq(200);
                    cy.wrap(response.body.productName).as("productNameData");
                },
            );
        });

        describe("Complete Field Comparison", () => {
            it("should match all fields between API and DB", function () {
                const productNameId = this.productNameData.id;
                let apiProductName, dbProductName;

                cy.GetSingleProductName (productNameId).then((response) => {
                    expect(response.status).to.eq(200);
                    apiProductName = response.body.data;
                    cy.log("API product name:", JSON.stringify(apiProductName));
                });

                cy.getSingleProductNameFromDb(productNameId.toString()).then(
                    (rows) => {
                        dbProductName = rows[0];
                        cy.log(
                            "DB product name:",
                            JSON.stringify(dbProductName),
                        );

                        expect(apiProductName.id).to.eq(dbProductName.id);
                        expect(apiProductName.product_name_status).to.eq(
                            dbProductName.product_name_status,
                        );
                        expect(apiProductName.note).to.eq(dbProductName.note);
                        expect(apiProductName.user_id).to.eq(
                            dbProductName.user_id,
                        );
                        expect(apiProductName.product_name).to.eq(
                            dbProductName.product_name,
                        );
                        expect(apiProductName.created_at).to.eq(
                            dbProductName.created_at,
                        );
                        expect(apiProductName.updated_at).to.eq(
                            dbProductName.updated_at,
                        );
                        expect(apiProductName.deleted_at).to.eq(
                            dbProductName.deleted_at,
                        );

                        cy.log("✅ All fields match between API and DB");
                    },
                );
            });

            it("should have identical field count", function () {
                const productNameId = this.productNameData.id;
                let apiProductName, dbProductName;

                cy.GetSingleProductName (productNameId).then((response) => {
                    apiProductName = response.body.data;
                });

                cy.getSingleProductNameFromDb(productNameId.toString()).then(
                    (rows) => {
                        dbProductName = rows[0];

                        const apiFieldCount =
                            Object.keys(apiProductName).length;
                        const dbFieldCount = Object.keys(dbProductName).length;

                        expect(apiFieldCount, "Field Count").to.eq(
                            dbFieldCount,
                        );
                        cy.log(`✅ Both have ${apiFieldCount} fields`);
                    },
                );
            });

            it("should have valid ISO timestamp formats", function () {
                const productNameId = this.productNameData.id;
                let apiProductName, dbProductName;

                cy.GetSingleProductName (productNameId).then((response) => {
                    apiProductName = response.body.data;
                });

                cy.getSingleProductNameFromDb(productNameId.toString()).then(
                    (rows) => {
                        dbProductName = rows[0];

                        const apiCreatedDate = new Date(
                            apiProductName.created_at,
                        );
                        const dbCreatedDate = new Date(
                            dbProductName.created_at,
                        );

                        expect(apiCreatedDate.toString()).to.not.eq(
                            "Invalid Date",
                        );
                        expect(dbCreatedDate.toString()).to.not.eq(
                            "Invalid Date",
                        );
                        expect(apiProductName.created_at).to.eq(
                            dbProductName.created_at,
                        );

                        cy.log("✅ Timestamp formats valid and match");
                    },
                );
            });
        });
    });

    describe("Business Logic — product name is deleted", () => {
        it("should auto-set deleted_at when product name is deleted", () => {
            cy.UpdateProductName(testProductNameId, {
                product_name: faker.food.fruit(),
                note: faker.word.words(25),
                product_name_status: "deleted",
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.productName.deleted_at).to.not.be.null;
                expect(
                    new Date(response.body.productName.deleted_at).toString(),
                ).to.not.eq("Invalid Date");
            });
        });

        it("should return 400 when deleted_at is invalid ISO date", () => {
            cy.UpdateProductName(testProductNameId, {
                product_name: faker.food.fruit(),
                note: faker.word.words(25),
                product_name_status: "deleted",
                deleted_at: "bukan-tanggal",
            }).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.include(
                    "deleted_at must be valid ISO date",
                );
            });
        });

        it("should accept valid deleted_at ISO date", () => {
            cy.UpdateProductName(testProductNameId, {
                product_name: faker.food.fruit(),
                note: faker.word.words(25),
                product_name_status: "deleted",
                deleted_at: new Date().toISOString(),
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.productName.deleted_at).to.not.be.null;
            });
        });
    });

    describe("Request Body Validation", () => {
        it("should return 400 when body is missing", () => {
            cy.UpdateProductName(testProductNameId).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.eq(
                    "Invalid JSON in request body",
                );
            });
        });

        it("should return 400 for invalid JSON string", () => {
            cy.UpdateProductName(testProductNameId, "NULL").then(
                (response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.eq(
                        "Invalid JSON in request body",
                    );
                },
            );
        });

        it("should return 400 when product name is missing", () => {
            cy.UpdateProductName(testProductNameId, {
                note: faker.word.words(25),
                product_name_status: "active",
            }).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.be.an("array");
                expect(response.body.error).to.include(
                    "product name is required",
                );
            });
        });

        it("should return 400 when product name status is missing", () => {
            cy.UpdateProductName(testProductNameId, {
                product_name: faker.food.fruit(),
                note: faker.word.words(25),
            }).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.be.an("array");
                expect(response.body.error).to.include(
                    "product name status is required",
                );
            });
        });

        it("should return 400 with all errors when product name and product name status missing", () => {
            cy.UpdateProductName(testProductNameId, {
                note: faker.word.words(25),
            }).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.be.an("array");
                expect(response.body.error).to.have.length(2);
                expect(response.body.error).to.include(
                    "product name is required",
                );
                expect(response.body.error).to.include(
                    "product name status is required",
                );
            });
        });

        it("should return 400 when product name is empty string", () => {
            cy.UpdateProductName(testProductNameId, {
                product_name: "   ",
                note: faker.word.words(25),
                product_name_status: "active",
            }).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.include(
                    "product name is required",
                );
            });
        });
    });

    describe("Performance", () => {
        it("should update within 2000ms", () => {
            const start = Date.now();
            cy.UpdateProductName(testProductNameId, {
                product_name: faker.food.fruit(),
                note: faker.word.words(25),
                product_name_status: "active",
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(Date.now() - start).to.be.lte(2000);
            });
        });
    });
});
