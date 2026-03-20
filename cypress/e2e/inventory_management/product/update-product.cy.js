import { faker } from "@faker-js/faker";

describe("PATCH Update Product API - /api/inventory/v1/product/update/[id]", () => {
    let validBrandId;
    let validProductId;
    let productWithStock;

    const buildProductRequest = (overrides = {}) => ({
        product_id: validProductId,
        brand_id: validBrandId,
        type: faker.word.noun(),
        usage_quantity: 0,
        note: faker.word.words(5),
        product_image: "",
        ...overrides,
    });

    const buildUpdateRequest = (overrides = {}) => ({
        usage_quantity: 1,
        start_usage_date: new Date().toISOString(),
        note: faker.word.words(5),
        ...overrides,
    });

    const createProductWithStock = (quantity = 10) => {
        return cy.AddProduct(buildProductRequest()).then((res) => {
            expect(res.status).to.eq(201);
            const product = res.body.product;

            return cy
                .setProductQuantityInDb(product.id, quantity)
                .then((updatedProduct) => updatedProduct);
        });
    };

    before(() => {
        cy.setupApiAuthCookies();

        cy.AddProductBrand({
            brand: faker.food.fruit(),
            brand_status: "active",
            note: faker.word.words(5),
        }).then((res) => {
            expect(res.status).to.eq(201);
            validBrandId = res.body.productBrand.id;
        });

        cy.AddProductName({
            product_name: faker.food.ingredient(),
            product_name_status: "active",
        }).then((res) => {
            expect(res.status).to.eq(201);
            validProductId = res.body.productName.id;
        });

        cy.then(() => {
            createProductWithStock(10).then((product) => {
                productWithStock = product;
            });
        });
    });

    beforeEach(() => {
        cy.setupApiAuthCookies();
    });

    describe("Authentication", () => {
        it("should return 200 for authenticated user with valid request", () => {
            createProductWithStock(10).then((product) => {
                cy.UpdateProduct(product.id, buildUpdateRequest()).then(
                    (response) => {
                        expect(response.status).to.eq(200);
                        expect(response.body.success).to.be.true;
                    },
                );
            });
        });

        it("should return 307 or 401 without authentication", () => {
            cy.clearApiAuth();
            cy.UpdateProductNoAuth(
                productWithStock.id,
                buildUpdateRequest(),
            ).then((response) => {
                expect(response.status).to.be.oneOf([307, 401]);

                if (response.status === 401) {
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.eq("Unauthorized");
                }

                if (response.status === 307) {
                    const location = response.headers.location || response.body;
                    expect(String(location)).to.include("/login");
                }
            });
        });
    });

    describe("ID Validation", () => {
        it("should return 400 when id is non-numeric", () => {
            cy.UpdateProduct("abc", buildUpdateRequest()).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.eq(
                    "Product ID must be a valid number",
                );
            });
        });

        it("should return 400 when id is float", () => {
            cy.UpdateProduct("1.5", buildUpdateRequest()).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.eq(
                    "Product ID must be an integer",
                );
            });
        });

        it("should return 400 when id is zero", () => {
            cy.UpdateProduct(0, buildUpdateRequest()).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.eq(
                    "Product ID must be a positive integer",
                );
            });
        });

        it("should return 400 when id is negative", () => {
            cy.UpdateProduct(-1, buildUpdateRequest()).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.eq(
                    "Product ID must be a positive integer",
                );
            });
        });
    });

    describe("Required Field Validation", () => {
        it("should return 400 when usage_quantity is missing", () => {
            cy.UpdateProduct(
                productWithStock.id,
                buildUpdateRequest({ usage_quantity: undefined }),
            ).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.be.an("array");
                expect(response.body.error).to.include(
                    "usage quantity is required",
                );
            });
        });

        it("should return 400 when start_usage_date is missing", () => {
            cy.UpdateProduct(
                productWithStock.id,
                buildUpdateRequest({ start_usage_date: undefined }),
            ).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.be.an("array");
                expect(response.body.error).to.include(
                    "start usage date is required",
                );
            });
        });

        it("should return 400 when all required fields are missing", () => {
            cy.UpdateProduct(productWithStock.id, {}).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.be.an("array");
                expect(response.body.error).to.have.length(2);
            });
        });
    });

    describe("Usage Quantity Validation", () => {
        it("should return 400 when usage_quantity is non-numeric", () => {
            cy.UpdateProduct(
                productWithStock.id,
                buildUpdateRequest({ usage_quantity: "abc" }),
            ).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.include(
                    "Usage quantity must be a valid number",
                );
            });
        });

        it("should return 400 when usage_quantity is negative", () => {
            cy.UpdateProduct(
                productWithStock.id,
                buildUpdateRequest({ usage_quantity: -1 }),
            ).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.include(
                    "Usage quantity cannot be negative",
                );
            });
        });

        it("should return 400 when usage_quantity is zero", () => {
            cy.UpdateProduct(
                productWithStock.id,
                buildUpdateRequest({ usage_quantity: 0 }),
            ).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error[0]).to.include(
                    "Usage quantity must be greater than 0",
                );
            });
        });

        it("should return 400 when usage_quantity is float", () => {
            cy.UpdateProduct(
                productWithStock.id,
                buildUpdateRequest({ usage_quantity: 1.5 }),
            ).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.include(
                    "Usage quantity must be a whole number",
                );
            });
        });
    });

    describe("Date Validation", () => {
        it("should return 400 when start_usage_date is invalid format", () => {
            cy.UpdateProduct(
                productWithStock.id,
                buildUpdateRequest({ start_usage_date: "not-a-date" }),
            ).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.include(
                    "Start usage date must be valid ISO date",
                );
            });
        });

        it("should accept valid ISO date format", () => {
            createProductWithStock(10).then((product) => {
                cy.UpdateProduct(
                    product.id,
                    buildUpdateRequest({
                        start_usage_date: "2026-03-20T00:00:00.000Z",
                    }),
                ).then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body.success).to.be.true;
                });
            });
        });

        it("should accept valid date string format", () => {
            createProductWithStock(10).then((product) => {
                cy.UpdateProduct(
                    product.id,
                    buildUpdateRequest({ start_usage_date: "2026-03-20" }),
                ).then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body.success).to.be.true;
                });
            });
        });
    });

    describe("Not Found & Business Logic Error", () => {
        it("should return 404 when product id does not exist", () => {
            cy.UpdateProduct(999999999, buildUpdateRequest()).then(
                (response) => {
                    expect(response.status).to.eq(404);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.include("not found");
                },
            );
        });

        it("should return 422 when usage_quantity exceeds available stock", () => {
            createProductWithStock(2).then((product) => {
                cy.UpdateProduct(
                    product.id,
                    buildUpdateRequest({ usage_quantity: 999 }),
                ).then((response) => {
                    expect(response.status).to.eq(422);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.include(
                        "Insufficient stock",
                    );
                });
            });
        });

        it("should return 422 error message containing available and requested qty", () => {
            createProductWithStock(3).then((product) => {
                cy.UpdateProduct(
                    product.id,
                    buildUpdateRequest({ usage_quantity: 999 }),
                ).then((response) => {
                    expect(response.status).to.eq(422);
                    expect(response.body.error).to.include("Available: 3");
                    expect(response.body.error).to.include("Requested: 999");
                });
            });
        });
    });

    describe("Response Structure", () => {
        it("should return correct top-level keys", () => {
            createProductWithStock(10).then((product) => {
                cy.UpdateProduct(product.id, buildUpdateRequest()).then(
                    (response) => {
                        expect(response.body).to.have.all.keys(
                            "success",
                            "product",
                            "message",
                        );
                        expect(response.body.success).to.be.true;
                        expect(response.body.product).to.be.an("object");
                        expect(response.body.message).to.be.a("string");
                    },
                );
            });
        });

        it("should return correct success message", () => {
            createProductWithStock(10).then((product) => {
                cy.UpdateProduct(product.id, buildUpdateRequest()).then(
                    (response) => {
                        expect(response.body.message).to.eq(
                            "Product activated",
                        );
                    },
                );
            });
        });

        it("should return updated product with correct keys", () => {
            createProductWithStock(10).then((product) => {
                cy.UpdateProduct(product.id, buildUpdateRequest()).then(
                    (response) => {
                        expect(response.body.product).to.include.all.keys([
                            "id",
                            "uuid",
                            "user_id",
                            "product",
                            "brand",
                            "type",
                            "product_status",
                            "usage_quantity",
                            "quantity",
                            "note",
                            "usage_date",
                            "is_favorite",
                            "updated_at",
                            "created_at",
                            "deleted_at",
                            "product_id",
                            "brand_id",
                        ]);
                    },
                );
            });
        });

        it("should return application/json content-type", () => {
            createProductWithStock(10).then((product) => {
                cy.UpdateProduct(product.id, buildUpdateRequest()).then(
                    (response) => {
                        expect(response.headers["content-type"]).to.include(
                            "application/json",
                        );
                    },
                );
            });
        });
    });

    describe("Update Logic", () => {
        it("product_status should be active after update", () => {
            createProductWithStock(10).then((product) => {
                cy.UpdateProduct(product.id, buildUpdateRequest()).then(
                    (response) => {
                        expect(response.body.product.product_status).to.eq(
                            "active",
                        );
                    },
                );
            });
        });

        it("quantity should decrease by usage_quantity", () => {
            const initialQuantity = 10;
            const usageQty = 3;

            createProductWithStock(initialQuantity).then((product) => {
                cy.UpdateProduct(
                    product.id,
                    buildUpdateRequest({ usage_quantity: usageQty }),
                ).then((response) => {
                    expect(response.body.product.quantity).to.eq(
                        initialQuantity - usageQty,
                    );
                });
            });
        });

        it("usage_quantity in response should increase by amount used", () => {
            createProductWithStock(10).then((product) => {
                const initialUsageQty = Number(product.usage_quantity) || 0;
                const usageQty = 4;

                cy.UpdateProduct(
                    product.id,
                    buildUpdateRequest({ usage_quantity: usageQty }),
                ).then((response) => {
                    expect(response.body.product.usage_quantity).to.eq(
                        initialUsageQty + usageQty,
                    );
                });
            });
        });

        it("usage_date should be set to start_usage_date from request", () => {
            const usageDate = "2026-03-20T00:00:00.000Z";

            createProductWithStock(10).then((product) => {
                cy.UpdateProduct(
                    product.id,
                    buildUpdateRequest({ start_usage_date: usageDate }),
                ).then((response) => {
                    const responseDate = new Date(
                        response.body.product.usage_date,
                    ).toISOString();
                    expect(responseDate).to.eq(usageDate);
                });
            });
        });

        it("note should be updated when provided", () => {
            const newNote = "Updated note for testing";

            createProductWithStock(10).then((product) => {
                cy.UpdateProduct(
                    product.id,
                    buildUpdateRequest({ note: newNote }),
                ).then((response) => {
                    expect(response.body.product.note).to.eq(newNote);
                });
            });
        });

        it("note should be null when not provided", () => {
            createProductWithStock(10).then((product) => {
                cy.UpdateProduct(product.id, {
                    usage_quantity: 1,
                    start_usage_date: new Date().toISOString(),
                }).then((response) => {
                    expect(response.body.product.note).to.be.null;
                });
            });
        });

        it("updated_at should be more recent after update", () => {
            createProductWithStock(10).then((product) => {
                const originalUpdatedAt = product.updated_at;

                cy.UpdateProduct(product.id, buildUpdateRequest()).then(
                    (response) => {
                        const newUpdatedAt = response.body.product.updated_at;
                        expect(new Date(newUpdatedAt).getTime()).to.be.gte(
                            new Date(originalUpdatedAt).getTime(),
                        );
                    },
                );
            });
        });
    });

    describe("API vs Database Comparison", () => {
        it("DB quantity should match API response quantity after update", () => {
            const usageQty = 2;

            createProductWithStock(10).then((product) => {
                cy.UpdateProduct(
                    product.id,
                    buildUpdateRequest({ usage_quantity: usageQty }),
                )
                    .then((response) => response.body.product)
                    .then((apiProduct) => {
                        cy.getProductWithQuantityFromDb(product.id).then(
                            (dbProduct) => {
                                expect(dbProduct).to.not.be.null;
                                expect(dbProduct.quantity).to.eq(
                                    apiProduct.quantity,
                                );
                                expect(dbProduct.usage_quantity).to.eq(
                                    apiProduct.usage_quantity,
                                );
                                expect(dbProduct.product_status).to.eq(
                                    apiProduct.product_status,
                                );
                                expect(dbProduct.note).to.eq(apiProduct.note);
                            },
                        );
                    });
            });
        });

        it("product history should be recorded after update", () => {
            const usageQty = 2;
            const initialStock = 10;

            createProductWithStock(initialStock).then((product) => {
                cy.getProductWithQuantityFromDb(product.id).then(
                    (dbProduct) => {
                        expect(dbProduct.quantity).to.eq(initialStock);
                    },
                );

                cy.UpdateProduct(
                    product.id,
                    buildUpdateRequest({ usage_quantity: usageQty }),
                ).then((res) => {
                    expect(res.status).to.eq(200);

                    cy.getLatestProductHistoryFromDb(product.id).then(
                        (history) => {
                            expect(history).to.not.be.null;
                            expect(Number(history.depleted_quantity)).to.eq(
                                usageQty,
                            );
                            expect(Number(history.remaining_quantity)).to.eq(
                                initialStock - usageQty,
                            );
                            expect(Number(history.quantity)).to.eq(
                                initialStock,
                            );
                            expect(history.status).to.eq("active");
                        },
                    );
                });
            });
        });

        it("history depleted_quantity should match request usage_quantity", () => {
            const usageQty = 5;

            createProductWithStock(10).then((product) => {
                cy.UpdateProduct(
                    product.id,
                    buildUpdateRequest({ usage_quantity: usageQty }),
                ).then((res) => {
                    expect(res.status).to.eq(200);

                    cy.getLatestProductHistoryFromDb(product.id).then(
                        (history) => {
                            expect(history).to.not.be.null;
                            expect(Number(history.depleted_quantity)).to.eq(
                                usageQty,
                            );
                        },
                    );
                });
            });
        });

        it("history remaining_quantity + depleted_quantity should equal quantity", () => {
            createProductWithStock(10).then((product) => {
                cy.UpdateProduct(
                    product.id,
                    buildUpdateRequest({ usage_quantity: 3 }),
                ).then((res) => {
                    expect(res.status).to.eq(200);

                    cy.getLatestProductHistoryFromDb(product.id).then(
                        (history) => {
                            expect(history).to.not.be.null;
                            const qty = Number(history.quantity);
                            const depleted = Number(history.depleted_quantity);
                            const remaining = Number(
                                history.remaining_quantity,
                            );
                            expect(remaining + depleted).to.eq(qty);
                        },
                    );
                });
            });
        });

        it("history remaining_quantity should match product quantity in DB after update", () => {
            createProductWithStock(10).then((product) => {
                cy.UpdateProduct(
                    product.id,
                    buildUpdateRequest({ usage_quantity: 3 }),
                ).then((res) => {
                    expect(res.status).to.eq(200);

                    cy.getLatestProductHistoryFromDb(product.id).then(
                        (history) => {
                            cy.getProductWithQuantityFromDb(product.id).then(
                                (dbProduct) => {
                                    expect(
                                        Number(history.remaining_quantity),
                                    ).to.eq(dbProduct.quantity);
                                },
                            );
                        },
                    );
                });
            });
        });

        it("history product_status should be active after update", () => {
            createProductWithStock(10).then((product) => {
                cy.UpdateProduct(
                    product.id,
                    buildUpdateRequest({ usage_quantity: 1 }),
                ).then((res) => {
                    expect(res.status).to.eq(200);

                    cy.getLatestProductHistoryFromDb(product.id).then(
                        (history) => {
                            expect(history).to.not.be.null;
                            expect(history.status).to.eq("active");
                        },
                    );
                });
            });
        });

        it("history user_id should match authenticated user", () => {
            createProductWithStock(10).then((product) => {
                cy.UpdateProduct(
                    product.id,
                    buildUpdateRequest({ usage_quantity: 1 }),
                ).then((res) => {
                    expect(res.status).to.eq(200);

                    cy.getTestUserId().then((userId) => {
                        cy.getLatestProductHistoryFromDb(product.id).then(
                            (history) => {
                                expect(history).to.not.be.null;
                                expect(history.user_id).to.eq(userId);
                            },
                        );
                    });
                });
            });
        });

        it("multiple updates should each create separate history records", () => {
            createProductWithStock(20).then((product) => {
                cy.UpdateProduct(
                    product.id,
                    buildUpdateRequest({ usage_quantity: 3 }),
                ).then((res) => {
                    expect(res.status).to.eq(200);
                });

                cy.UpdateProduct(
                    product.id,
                    buildUpdateRequest({ usage_quantity: 2 }),
                ).then((res) => {
                    expect(res.status).to.eq(200);
                });

                // ✅ Gunakan Cypress command, bukan cy.task langsung
                cy.getProductHistoryCountFromDb(product.id).then((count) => {
                    expect(count).to.be.gte(2);
                });
            });
        });
    });

    describe("Performance", () => {
        it("should respond within 2000ms", () => {
            createProductWithStock(10).then((product) => {
                const start = Date.now();
                cy.UpdateProduct(product.id, buildUpdateRequest()).then(
                    (response) => {
                        expect(response.status).to.eq(200);
                        expect(Date.now() - start).to.be.lte(2000);
                    },
                );
            });
        });
    });
});
