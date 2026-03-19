import { faker } from "@faker-js/faker";

describe("Product Brand Add API and Database Comparison", () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.setupApiAuthCookies();
    });

    describe("Product Brand Add API", () => {
        describe("Authentication & Authorization", () => {
            it("should return 307 or 401 when user is not authenticated", () => {
                cy.clearApiAuth();

                const request = {
                    brand_status: faker.food.fruit(),
                    note: faker.word.words(25),
                    brand: faker.food.fruit(),
                };

                cy.AddProductBrandNoAuth(request).then((response) => {
                    expect(response.status).to.be.oneOf([307, 401]);

                    if (response.status === 401) {
                        expect(response.body.success).to.be.false;
                        expect(response.body.error).to.eq("Unauthorized");
                    }

                    const location = response.headers.location || response.body;
                    expect(String(location)).to.include("/login");
                });
            });

            it("should return 201 when user is authenticated", () => {
                const request = {
                    brand_status: faker.food.fruit(),
                    note: faker.word.words(25),
                    brand: faker.food.fruit(),
                };

                cy.AddProductBrand(request).then((response) => {
                    expect(response.status).to.eq(201);
                    expect(response.body.success).to.be.true;
                    expect(response.body.productBrand).to.exist;
                });
            });
        });

        describe("Request Body Validation", () => {
            it("should return 400 when body is missing", () => {
                cy.AddProductBrand().then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.eq(
                        "Invalid JSON in request body",
                    );
                });
            });

            it("should return 400 for invalid JSON", () => {
                const request = "NULL";

                cy.AddProductBrand(request).then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.eq(
                        "Invalid JSON in request body",
                    );
                });
            });

            it("should return 400 for empty body object", () => {
                const request = {};
                cy.AddProductBrand(request).then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.be.an("array");
                });
            });
        });

        describe("Required Fields Validation", () => {
            it("should return 400 when brand is missing", () => {
                const request = {
                    brand_status: faker.food.fruit(),
                    note: faker.word.words(25),
                };

                cy.AddProductBrand(request).then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.be.an("array");
                    expect(response.body.error).to.include("brand is required");
                });
            });

            it("should return 400 when brand is empty string", () => {
                const request = {
                    brand_status: faker.food.fruit(),
                    note: faker.word.words(25),
                    brand: "",
                };

                cy.AddProductBrand(request).then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.be.an("array");
                    expect(response.body.error).to.include("brand is required");
                });
            });

            it("should return 400 when brand is null", () => {
                const request = {
                    brand_status: faker.food.fruit(),
                    note: faker.word.words(25),
                    brand: null,
                };

                cy.AddProductBrand(request).then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.be.an("array");
                    expect(response.body.error).to.include("brand is required");
                });
            });

            it("should return 400 with multiple validation errors", () => {
                const request = {};

                cy.AddProductBrand(request).then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.be.an("array");
                    expect(response.body.error.length).to.be.greaterThan(0);
                    expect(response.body.error.length).to.be.eq(1);

                    cy.log(
                        `Validation errors: ${response.body.error.join(", ")}`,
                    );
                });
            });
        });
        describe("Product Brand Object Structure Scenarios", () => {
            it("should create product brand with all required fields", () => {
                const request = {
                    brand_status: faker.food.fruit(),
                    note: faker.word.words(25),
                    brand: faker.food.fruit(),
                };

                cy.AddProductBrand(request).then((response) => {
                    const productBrand = response.body.productBrand;
                    expect(productBrand).to.have.property("id");
                    expect(productBrand).to.have.property("brand_status");
                    expect(productBrand).to.have.property("brand");
                });
            });

            it("should return correct success response structure", () => {
                const request = {
                    brand_status: faker.food.fruit(),
                    note: faker.word.words(25),
                    brand: faker.food.fruit(),
                };

                cy.AddProductBrand(request).then((response) => {
                    expect(response.status).to.eq(201);
                    expect(response.body).to.have.all.keys(
                        "success",
                        "productBrand",
                    );
                    expect(response.body.success).to.be.true;
                    expect(response.body.productBrand).to.be.an("object");
                });
            });

            it("should return correct error response structure", () => {
                cy.AddProductBrand().then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body).to.have.all.keys("success", "error");
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.exist;
                });
            });
        });

        describe("Success Scenarios", () => {
            it("should create product brand with all required fields", () => {
                const request = {
                    brand_status: faker.food.fruit(),
                    note: faker.word.words(25),
                    brand: faker.food.fruit(),
                };

                cy.AddProductBrand(request).then((response) => {
                    expect(response.status).to.eq(201);
                    expect(response.body.success).to.be.true;
                    expect(response.body.productBrand).to.exist;
                });
            });

            it("should assign user_id from authenticated user", () => {
                const request = {
                    brand_status: faker.food.fruit(),
                    note: faker.word.words(25),
                    brand: faker.food.fruit(),
                };

                cy.AddProductBrand(request).then((response) => {
                    expect(response.status).to.eq(201);

                    const productBrand = response.body.productBrand;
                    expect(productBrand.user_id).to.exist;
                    expect(productBrand.user_id).to.be.a("string");
                    expect(productBrand.user_id.length).to.be.greaterThan(0);

                    cy.log(`✅ User ID assigned: ${productBrand.user_id}`);
                });
            });

            it("should generate timestamps (created_at, updated_at)", () => {
                const request = {
                    brand_status: faker.food.fruit(),
                    note: faker.word.words(25),
                    brand: faker.food.fruit(),
                };

                cy.AddProductBrand(request).then((response) => {
                    expect(response.status).to.eq(201);

                    const productBrand = response.body.productBrand;
                    expect(productBrand.created_at).to.exist;
                    expect(productBrand.updated_at).to.exist;

                    expect(
                        new Date(productBrand.created_at).toString(),
                    ).to.not.eq("Invalid Date");

                    cy.log("✅ Timestamps generated correctly");
                });
            });
        });
    });

    describe("Data Integrity - API vs Database Comparison", () => {
        let productBrandId;
        let userId;

        beforeEach(() => {
            const request = {
                brand_status: faker.food.fruit(),
                note: faker.word.words(25),
                brand: faker.food.fruit(),
            };

            cy.AddProductBrand(request).then((response) => {
                cy.log(
                    "AddProductBrand response:",
                    JSON.stringify(response.body),
                );
                expect(response.status).to.eq(201);
                productBrandId = response.body.productBrand.id;
                userId = response.body.productBrand.user_id;
                cy.log(`Created test Product Brand ID: ${response.body.productBrand.id}`);
            });
        });

        describe("Complete Field Comparison", () => {
            it("should match all fields between API and DB", function () {
                let apiProductBrand, dbProductBrand;

                cy.GetSingleProductBrand(productBrandId).then((response) => {
                    expect(response.status).to.eq(200);
                    apiProductBrand = response.body.data;
                    cy.log(
                        "API Product Brand:",
                        JSON.stringify(apiProductBrand),
                    );
                });

                cy.getSingleProductBrandFromDb(productBrandId, userId).then(
                    (rows) => {
                        dbProductBrand = rows[0];
                        cy.log(
                            "DB Product Brand:",
                            JSON.stringify(dbProductBrand),
                        );
                    },
                );
                cy.then(() => {
                    expect(apiProductBrand.id).to.eq(dbProductBrand.id);
                    expect(apiProductBrand.brand).to.eq(dbProductBrand.brand);
                    expect(apiProductBrand.note).to.eq(dbProductBrand.note);
                    expect(apiProductBrand.user_id).to.eq(
                        dbProductBrand.user_id,
                    );
                    expect(apiProductBrand.brand_status).to.eq(
                        dbProductBrand.brand_status,
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
                });
            });

            it("should have identical field count", function () {
                let apiProductBrand, dbProductBrand;

                cy.GetSingleProductBrand(productBrandId).then((response) => {
                    apiProductBrand = response.body.data;
                });

                cy.getSingleProductBrandFromDb(productBrandId, userId).then(
                    (rows) => {
                        dbProductBrand = rows[0];
                    },
                );

                cy.then(() => {
                    const apiFieldCount = Object.keys(apiProductBrand).length;
                    const dbFieldCount = Object.keys(dbProductBrand).length;

                    expect(apiFieldCount, "Field Count").to.eq(dbFieldCount);
                    cy.log(`✅ Both have ${apiFieldCount} fields`);
                });
            });

            it("should have valid ISO timestamp formats", function () {
                let apiProductBrand, dbProductBrand;

                cy.GetSingleProductBrand(productBrandId).then((response) => {
                    apiProductBrand = response.body.data;
                });

                cy.getSingleProductBrandFromDb(productBrandId, userId).then(
                    (rows) => {
                        dbProductBrand = rows[0];
                    },
                );

                cy.then(() => {
                    const apiCreatedDate = new Date(apiProductBrand.created_at);
                    const dbCreatedDate = new Date(dbProductBrand.created_at);

                    expect(apiCreatedDate.toString()).to.not.eq("Invalid Date");
                    expect(dbCreatedDate.toString()).to.not.eq("Invalid Date");
                    expect(apiProductBrand.created_at).to.eq(
                        dbProductBrand.created_at,
                    );

                    cy.log("✅ Timestamp formats valid and match");
                });
            });
        });
    });

    describe("Product Brand Creation - Summary Impact Tests", () => {
        describe("Total Active Product Brands Impact", () => {
            it("should increment totalProductBrands after creating a new product brand", () => {
                cy.GetProductBrandSummary().then((response) => {
                    expect(response.status).to.eq(200);
                    cy.wrap(response.body.data.totalProductBrands).as(
                        "initialCount",
                    );
                    cy.log(
                        `📊 Initial Product Brand count: ${response.body.data.totalProductBrands}`,
                    );
                });

                const request = {
                    brand_status: faker.food.fruit(),
                    note: faker.word.words(25),
                    brand: faker.food.fruit(),
                };

                cy.AddProductBrand(request).then((response) => {
                    expect(response.status).to.eq(201);
                    cy.log(
                        `Created test Product Brand ID: ${response.body.productBrand.id}`,
                    );
                });

                cy.GetProductBrandSummary().then(function (response) {
                    const newCount = response.body.data.totalProductBrands;
                    expect(newCount).to.eq(this.initialCount + 1);
                    cy.log(
                        `✅ Product Brand count increased: ${this.initialCount} → ${newCount}`,
                    );
                });
            });

            it("should match totalProductBrands with database count", function () {
                const request = {
                    brand_status: faker.food.fruit(),
                    note: faker.word.words(25),
                    brand: faker.food.fruit(),
                };

                cy.AddProductBrand(request)
                    .then((response) => {
                        expect(response.status).to.eq(201);
                    })
                    .then(() => cy.GetProductBrandSummary())
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
    });
});

describe("Add Product Brand Form - UI Tests", () => {
    describe("Desktop View", () => {
        beforeEach(() => {
            cy.viewport(1280, 720);
            cy.loginWithBypass();
            cy.visit("/main/inventory/product-brand");
            cy.wait(1000);
        });
        describe("Dialog Behavior", () => {
            it("should open dialog when Add Product Brand button is clicked", () => {
                cy.get("#addNewProductBrandForm_productBrandPage").should(
                    "not.exist",
                );
                cy.get("#addNewProductBrandBtn_productBrandPage")
                    .should("be.visible")
                    .click();
                cy.get("#addNewProductBrandForm_productBrandPage").should(
                    "be.visible",
                );
            });

            it("should close dialog when Cancel button is clicked", () => {
                cy.get("#addNewProductBrandBtn_productBrandPage").click();
                cy.wait(1000);
                cy.get("#addNewProductBrandForm_productBrandPage").should(
                    "be.visible",
                );
                cy.get("#cancelNewProductBrandBtn_productBrandPage").click();
                cy.get("#addNewProductBrandForm_productBrandPage").should(
                    "not.exist",
                );
            });

            it("should close dialog when clicking outside", () => {
                cy.get("#addNewProductBrandBtn_productBrandPage").click();
                cy.wait(1000);
                cy.get("#addNewProductBrandForm_productBrandPage").should(
                    "be.visible",
                );
                cy.get("body").click(0, 0, { force: true });
                cy.get("#addNewProductBrandForm_productBrandPage").should(
                    "not.exist",
                );
            });
        });

        describe("Required Fields Validation", () => {
            beforeEach(() => {
                cy.get("#addNewProductBrandBtn_productBrandPage").click();
                cy.wait(1000);
            });

            it("should show error when brand is empty", () => {
                cy.get("#submitNewProductBrandBtn_productBrandPage").click();
                cy.get("#brandField_errorMessage_productBrandPage")
                    .should("be.visible")
                    .should("contain", "Product brand cannot be empty");
            });
        });
    });

    describe("Tablet View", () => {
        beforeEach(() => {
            cy.viewport(768, 1024);
            cy.loginWithBypass();
            cy.visit("/main/inventory/product-brand");
            cy.wait(1000);
        });
        describe("Dialog Behavior", () => {
            it("should open dialog when Add Product Brand button is clicked", () => {
                cy.get("#addNewProductBrandForm_productBrandPage").should(
                    "not.exist",
                );
                cy.get("#addNewProductBrandBtn_productBrandPage")
                    .should("be.visible")
                    .click();
                cy.get("#addNewProductBrandForm_productBrandPage").should(
                    "be.visible",
                );
            });

            it("should close dialog when Cancel button is clicked", () => {
                cy.get("#addNewProductBrandBtn_productBrandPage").click();
                cy.wait(1000);
                cy.get("#addNewProductBrandForm_productBrandPage").should(
                    "be.visible",
                );
                cy.get("#cancelNewProductBrandBtn_productBrandPage").click();
                cy.get("#addNewProductBrandForm_productBrandPage").should(
                    "not.exist",
                );
            });

            it("should close dialog when clicking outside", () => {
                cy.get("#addNewProductBrandBtn_productBrandPage").click();
                cy.wait(1000);
                cy.get("#addNewProductBrandForm_productBrandPage").should(
                    "be.visible",
                );
                cy.get("body").click(0, 0, { force: true });
                cy.get("#addNewProductBrandForm_productBrandPage").should(
                    "not.exist",
                );
            });
        });

        describe("Required Fields Validation", () => {
            beforeEach(() => {
                cy.get("#addNewProductBrandBtn_productBrandPage").click();
                cy.wait(1000);
            });

            it("should show error when brand is empty", () => {
                cy.get("#submitNewProductBrandBtn_productBrandPage").click();
                cy.get("#brandField_errorMessage_productBrandPage")
                    .should("be.visible")
                    .should("contain", "Product brand cannot be empty");
            });
        });
    });

    describe("Mobile View", () => {
        beforeEach(() => {
            cy.viewport(375, 667);
            cy.loginWithBypass();
            cy.visit("/main/inventory/product-brand");
            cy.wait(1000);
        });
        describe("Dialog Behavior", () => {
            it("should open dialog when Add Product Brand button is clicked", () => {
                cy.get("#addNewProductBrandForm_productBrandPage").should(
                    "not.exist",
                );
                cy.get("#addNewProductBrandBtn_productBrandPage")
                    .should("be.visible")
                    .click();
                cy.get("#addNewProductBrandForm_productBrandPage").should(
                    "be.visible",
                );
            });

            it("should close dialog when Cancel button is clicked", () => {
                cy.get("#addNewProductBrandBtn_productBrandPage").click();
                cy.wait(1000);
                cy.get("#addNewProductBrandForm_productBrandPage").should(
                    "be.visible",
                );
                cy.get("#cancelNewProductBrandBtn_productBrandPage").click();
                cy.get("#addNewProductBrandForm_productBrandPage").should(
                    "not.exist",
                );
            });

            it("should close dialog when clicking outside", () => {
                cy.get("#addNewProductBrandBtn_productBrandPage").click();
                cy.wait(1000);
                cy.get("#addNewProductBrandForm_productBrandPage").should(
                    "be.visible",
                );
                cy.get("body").click(0, 0, { force: true });
                cy.get("#addNewProductBrandForm_productBrandPage").should(
                    "not.exist",
                );
            });
        });

        describe("Required Fields Validation", () => {
            beforeEach(() => {
                cy.get("#addNewProductBrandBtn_productBrandPage").click();
                cy.wait(1000);
            });

            it("should show error when brand is empty", () => {
                cy.get("#submitNewProductBrandBtn_productBrandPage").click();
                cy.get("#brandField_errorMessage_productBrandPage")
                    .should("be.visible")
                    .should("contain", "Product brand cannot be empty");
            });
        });
    });
});
