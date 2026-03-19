import { faker } from "@faker-js/faker";

describe("Product Brand Update API", () => {
    let testProductBrandId;
    let testUserId;

    before(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
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

    describe("Authentication & Authorization", () => {
        it("should update product brand successfully (200)", () => {
            const request = {
                brand_status: faker.food.fruit(),
                note: faker.word.words(25),
                brand: faker.food.fruit(),
            };

            cy.UpdateProductBrand(testProductBrandId, request).then(
                (response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body.success).to.be.true;
                    expect(response.body.productBrand).to.exist;
                },
            );
        });

        it("should return 307 or 401 without authentication", () => {
            cy.clearCookies();
            cy.UpdateProductBrandNoAuth(testProductBrandId, {
                brand: faker.food.fruit(),
                brand_status: "active",
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
            cy.UpdateProductBrand("abc", {
                brand: faker.food.fruit(),
                brand_status: "active",
            }).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.eq(
                    "Invalid product brand ID provided",
                );
            });
        });

        it("should return 400 for missing ID", () => {
            cy.UpdateProductBrand(null, {
                brand: faker.food.fruit(),
                brand_status: "active",
            }).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.eq(
                    "Invalid product brand ID provided",
                );
            });
        });
    });

    describe("Product Brand Object Structure Scenarios", () => {
        it("should update product brand with all required fields", () => {
            const request = {
                brand_status: faker.food.fruit(),
                note: faker.word.words(25),
                brand: faker.food.fruit(),
            };

            cy.UpdateProductBrand(testProductBrandId, request).then(
                (response) => {
                    const productBrand = response.body.productBrand;
                    expect(productBrand).to.have.property("id");
                    expect(productBrand).to.have.property("brand");
                    expect(productBrand).to.have.property("brand_status");
                    expect(productBrand).to.have.property("note");
                    expect(productBrand).to.have.property("user_id");
                    expect(productBrand).to.have.property("created_at");
                    expect(productBrand).to.have.property("updated_at");
                    expect(productBrand).to.have.property("deleted_at");
                    expect(productBrand).to.have.property("uuid");
                },
            );
        });

        it("should return complete updated product brand object", () => {
            const request = {
                brand_status: faker.food.fruit(),
                note: faker.word.words(25),
                brand: faker.food.fruit(),
            };

            cy.UpdateProductBrand(testProductBrandId, request).then(
                (response) => {
                    const productBrand = response.body.productBrand;
                    expect(productBrand).to.have.all.keys([
                        "created_at",
                        "deleted_at",
                        "brand",
                        "brand_status",
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
                brand_status: faker.food.fruit(),
                note: faker.word.words(25),
                brand: faker.food.fruit(),
            };

            cy.UpdateProductBrand(testProductBrandId, request).then(
                (response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body).to.have.all.keys(
                        "success",
                        "productBrand",
                    );
                    expect(response.body.success).to.be.true;
                    expect(response.body.productBrand).to.be.an("object");
                },
            );
        });

        it("should return correct error response structure", () => {
            cy.UpdateProductBrand().then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body).to.have.all.keys("success", "error");
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.exist;
            });
        });
    });

    describe("Success Scenario", () => {
        it("should update product brand successfully (200)", () => {
            const request = {
                brand_status: faker.food.fruit(),
                note: faker.word.words(25),
                brand: faker.food.fruit(),
            };

            cy.UpdateProductBrand(testProductBrandId, request).then(
                (response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body.success).to.be.true;

                    const exactFields = ["brand_status", "note", "brand"];
                    exactFields.forEach((field) => {
                        expect(response.body.productBrand[field]).to.eq(
                            request[field],
                        );
                    });

                    cy.log("✅ All fields updated:", JSON.stringify(request));
                },
            );
        });

        it("should assign user_id from authenticated user", () => {
            const request = {
                brand_status: faker.food.fruit(),
                note: faker.word.words(25),
                brand: faker.food.fruit(),
            };

            cy.UpdateProductBrand(testProductBrandId, request).then(
                (response) => {
                    expect(response.status).to.eq(200);

                    const productBrand = response.body.productBrand;
                    expect(productBrand.user_id).to.exist;
                    expect(productBrand.user_id).to.be.a("string");
                    expect(productBrand.user_id.length).to.be.greaterThan(0);

                    cy.log(`✅ User ID assigned: ${productBrand.user_id}`);
                },
            );
        });

        it("should generate timestamps (created_at, updated_at)", () => {
            const request = {
                brand_status: faker.food.fruit(),
                note: faker.word.words(25),
                brand: faker.food.fruit(),
            };

            cy.UpdateProductBrand(testProductBrandId, request).then(
                (response) => {
                    expect(response.status).to.eq(200);

                    const productBrand = response.body.productBrand;
                    expect(productBrand.created_at).to.exist;
                    expect(productBrand.updated_at).to.exist;

                    expect(
                        new Date(productBrand.created_at).toString(),
                    ).to.not.eq("Invalid Date");

                    cy.log("✅ Timestamps generated correctly");
                },
            );
        });

        it("should not change user_id after update", () => {
            cy.UpdateProductBrand(testProductBrandId, {
                brand: faker.food.fruit(),
                brand_status: "active",
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.productBrand.user_id).to.eq(testUserId);
            });
        });

        it("updated_at should be more recent than created_at after update", () => {
            cy.UpdateProductBrand(testProductBrandId, {
                brand: faker.food.fruit(),
                brand_status: "active",
            }).then((response) => {
                expect(response.status).to.eq(200);
                const { created_at, updated_at } = response.body.productBrand;
                expect(new Date(updated_at).getTime()).to.be.gte(
                    new Date(created_at).getTime(),
                );
            });
        });
    });

    describe("Data Integrity - API vs Database Comparison", () => {
        beforeEach(() => {
            const request = {
                brand_status: faker.food.fruit(),
                note: faker.word.words(25),
                brand: faker.food.fruit(),
            };

            cy.UpdateProductBrand(testProductBrandId, request).then(
                (response) => {
                    expect(response.status).to.eq(200);
                    cy.wrap(response.body.productBrand).as("productBrandData");
                },
            );
        });

        describe("Complete Field Comparison", () => {
            it("should match all fields between API and DB", function () {
                const productBrandId = this.productBrandData.id;
                let apiProductBrand, dbProductBrand;

                cy.GetSingleProductBrand(productBrandId).then((response) => {
                    expect(response.status).to.eq(200);
                    apiProductBrand = response.body.data;
                    cy.log(
                        "API product brand:",
                        JSON.stringify(apiProductBrand),
                    );
                });

                cy.getSingleProductBrandFromDb(productBrandId.toString()).then(
                    (rows) => {
                        dbProductBrand = rows[0];
                        cy.log(
                            "DB product brand:",
                            JSON.stringify(dbProductBrand),
                        );

                        expect(apiProductBrand.id).to.eq(dbProductBrand.id);
                        expect(apiProductBrand.brand_status).to.eq(
                            dbProductBrand.brand_status,
                        );
                        expect(apiProductBrand.note).to.eq(dbProductBrand.note);
                        expect(apiProductBrand.user_id).to.eq(
                            dbProductBrand.user_id,
                        );
                        expect(apiProductBrand.brand).to.eq(
                            dbProductBrand.brand,
                        );
                        expect(apiProductBrand.created_at).to.eq(
                            dbProductBrand.created_at,
                        );
                        expect(apiProductBrand.updated_at).to.eq(
                            dbProductBrand.updated_at,
                        );
                        expect(apiProductBrand.deleted_at).to.eq(
                            dbProductBrand.deleted_at,
                        );

                        cy.log("✅ All fields match between API and DB");
                    },
                );
            });

            it("should have identical field count", function () {
                const productBrandId = this.productBrandData.id;
                let apiProductBrand, dbProductBrand;

                cy.GetSingleProductBrand(productBrandId).then((response) => {
                    apiProductBrand = response.body.data;
                });

                cy.getSingleProductBrandFromDb(productBrandId.toString()).then(
                    (rows) => {
                        dbProductBrand = rows[0];

                        const apiFieldCount =
                            Object.keys(apiProductBrand).length;
                        const dbFieldCount = Object.keys(dbProductBrand).length;

                        expect(apiFieldCount, "Field Count").to.eq(
                            dbFieldCount,
                        );
                        cy.log(`✅ Both have ${apiFieldCount} fields`);
                    },
                );
            });

            it("should have valid ISO timestamp formats", function () {
                const productBrandId = this.productBrandData.id;
                let apiProductBrand, dbProductBrand;

                cy.GetSingleProductBrand(productBrandId).then((response) => {
                    apiProductBrand = response.body.data;
                });

                cy.getSingleProductBrandFromDb(productBrandId.toString()).then(
                    (rows) => {
                        dbProductBrand = rows[0];

                        const apiCreatedDate = new Date(
                            apiProductBrand.created_at,
                        );
                        const dbCreatedDate = new Date(
                            dbProductBrand.created_at,
                        );

                        expect(apiCreatedDate.toString()).to.not.eq(
                            "Invalid Date",
                        );
                        expect(dbCreatedDate.toString()).to.not.eq(
                            "Invalid Date",
                        );
                        expect(apiProductBrand.created_at).to.eq(
                            dbProductBrand.created_at,
                        );

                        cy.log("✅ Timestamp formats valid and match");
                    },
                );
            });
        });
    });

    describe("Business Logic — brand_status deleted", () => {
        it("should auto-set deleted_at when brand_status is deleted", () => {
            cy.UpdateProductBrand(testProductBrandId, {
                brand: faker.food.fruit(),
                brand_status: "deleted",
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.productBrand.deleted_at).to.not.be.null;
                expect(
                    new Date(response.body.productBrand.deleted_at).toString(),
                ).to.not.eq("Invalid Date");
            });
        });

        it("should return 400 when deleted_at is invalid ISO date", () => {
            cy.UpdateProductBrand(testProductBrandId, {
                brand: faker.food.fruit(),
                brand_status: "deleted",
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
            cy.UpdateProductBrand(testProductBrandId, {
                brand: faker.food.fruit(),
                brand_status: "deleted",
                deleted_at: new Date().toISOString(),
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.productBrand.deleted_at).to.not.be.null;
            });
        });
    });

    describe("Request Body Validation", () => {
        it("should return 400 when body is missing", () => {
            cy.UpdateProductBrand(testProductBrandId).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.eq(
                    "Invalid JSON in request body",
                );
            });
        });

        it("should return 400 for invalid JSON string", () => {
            cy.UpdateProductBrand(testProductBrandId, "NULL").then(
                (response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.eq(
                        "Invalid JSON in request body",
                    );
                },
            );
        });

        it("should return 400 when brand is missing", () => {
            cy.UpdateProductBrand(testProductBrandId, {
                brand_status: "active",
                note: faker.word.words(5),
            }).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.be.an("array");
                expect(response.body.error).to.include("brand is required");
            });
        });

        it("should return 400 when brand_status is missing", () => {
            cy.UpdateProductBrand(testProductBrandId, {
                brand: faker.food.fruit(),
                note: faker.word.words(5),
            }).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.be.an("array");
                expect(response.body.error).to.include(
                    "brand status is required",
                );
            });
        });

        it("should return 400 with all errors when brand and brand_status missing", () => {
            cy.UpdateProductBrand(testProductBrandId, {
                note: faker.word.words(5),
            }).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.be.an("array");
                expect(response.body.error).to.have.length(2);
                expect(response.body.error).to.include("brand is required");
                expect(response.body.error).to.include(
                    "brand status is required",
                );
            });
        });

        it("should return 400 when brand is empty string", () => {
            cy.UpdateProductBrand(testProductBrandId, {
                brand: "   ",
                brand_status: "active",
            }).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.include("brand is required");
            });
        });
    });

    describe("Performance", () => {
        it("should update within 2000ms", () => {
            const start = Date.now();
            cy.UpdateProductBrand(testProductBrandId, {
                brand: faker.food.fruit(),
                brand_status: "active",
                note: faker.word.words(5),
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(Date.now() - start).to.be.lte(2000);
            });
        });
    });
});
