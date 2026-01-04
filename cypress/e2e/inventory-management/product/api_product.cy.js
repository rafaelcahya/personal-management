import { faker } from "@faker-js/faker";
import { randomString } from "../../../support/common/helper";

describe("Product API", () => {
    before(() => {
        cy.task("clearFixtureFile", "productIds.json");
    });

	describe("Summary", () => {
        it("should display correct total products summary", () => {
            cy.GetProductSummary().then((summary) => {
                const metrics = ["totalProducts"];
                metrics.forEach((metric) => {
                    cy.task("getTotalProductSummaryFromDbTask", metric).then(
                        (dbCount) => {
                            expect(summary[metric]).to.eq(dbCount);
                        }
                    );
                });
            });
        });
    });

    describe("Create", () => {
        it("should successfully add new product", () => {
            const request = {
                product: faker.company.name(),
                brand: faker.commerce.product(),
                type: faker.commerce.productAdjective(),
                product_status: "active",
                quantity: faker.string.numeric(),
                on_hand_quantity: faker.string.numeric(),
                note: faker.commerce.productDescription(),
                product_image: faker.image.urlPicsumPhotos(),
            };

            cy.AddNewProduct(request).then((response) => {
                expect(response.status).to.eq(200);

                cy.wrap(response.body.product).as("apiProduct");
                cy.wrap(response.body.product.id).as("productId");

                cy.get("@productId").then((id) => {
                    cy.task("getProductListFromDbTask", id).then(
                        (dbProduct) => {
                            cy.get("@apiProduct").then((apiProduct) => {
                                expect(apiProduct.product).to.eq(
                                    dbProduct.product
                                );
                                expect(apiProduct.brand).to.eq(dbProduct.brand);
                                expect(apiProduct.type).to.eq(dbProduct.type);
                                expect(apiProduct.product_status).to.eq(
                                    dbProduct.productStatus
                                );
                                expect(apiProduct.quantity).to.eq(
                                    dbProduct.quantity
                                );
                                expect(apiProduct.on_hand_quantity).to.eq(
                                    dbProduct.onHandQuantity
                                );
                                expect(apiProduct.note).to.eq(dbProduct.note);
                                expect(apiProduct.product_image).to.eq(
                                    dbProduct.productImage
                                );
                            });
                        }
                    );
                });

                cy.saveProductId(response.body.product.id);
            });
        });

        it("should fail to add new product with missing required fields", () => {
            const request = {
                product: "",
                brand: "",
                type: "",
                product_status: "",
                quantity: "",
                on_hand_quantity: "",
                product_image: "",
            };

            cy.AddNewProduct(request).then((response) => {
                expect(response.status).to.eq(400);

                cy.wrap(response.body.trade).as("apiProduct");

                const requiredErrors = [
                    "product is required",
                    "brand is required",
                    "type is required",
                    "product status is required",
                    "quantity is required",
                    "on hand quantity is required",
                    "product image is required",
                ];

                requiredErrors.forEach((error) => {
                    expect(response.body.error).to.include(error);
                });
            });
        });

        it("should fail to add new product with invalid JSON", () => {
            cy.AddNewProduct().then((response) => {
                expect(response.status).to.eq(400);

                cy.wrap(response.body.trade).as("apiProduct");

                expect(response.body.error).to.include(
                    "Invalid JSON in request body"
                );
            });
        });

        it("should fail to add new product with invalid number fields", () => {
            const request = {
                product: faker.company.name(),
                brand: faker.commerce.product(),
                type: faker.commerce.productAdjective(),
                product_status: "active",
                quantity: faker.string.alphanumeric(5),
                on_hand_quantity: faker.string.alphanumeric(5),
                note: faker.commerce.productDescription(),
                product_image: faker.image.urlPicsumPhotos(),
            };

            cy.AddNewProduct(request).then((response) => {
                expect(response.status).to.eq(400);

                const requiredErrors = [
                    "quantity must be a valid number",
                    "on hand quantity must be a valid number",
                ];

                requiredErrors.forEach((error) => {
                    expect(response.body.error).to.include(error);
                });
            });
        });

        it("should ensure deleted_at is null after successfully adding a new product", () => {
            const request = {
                product: faker.company.name(),
                brand: faker.commerce.product(),
                type: faker.commerce.productAdjective(),
                product_status: "active",
                quantity: faker.string.numeric(),
                on_hand_quantity: faker.string.numeric(),
                note: faker.commerce.productDescription(),
                product_image: faker.image.urlPicsumPhotos(),
            };

            cy.AddNewProduct(request).then((response) => {
                expect(response.status).to.eq(200);

                cy.wrap(response.body.product.id).as("productId");

                cy.get("@productId").then((id) => {
                    cy.task("getProductListFromDbTask", id).then((dbUser) => {
                        expect(response.body.product.deleted_at).to.eq(
                            dbUser.deletedAt
                        );
                        expect(response.body.product.deleted_at).to.be.null;
                    });
                });
            });
        });

        it("should Total Products increase by 1 after adding a new product", () => {
            const request = {
                product: faker.company.name(),
                brand: faker.commerce.product(),
                type: faker.commerce.productAdjective(),
                product_status: "active",
                quantity: faker.string.numeric(),
                on_hand_quantity: faker.string.numeric(),
                note: faker.commerce.productDescription(),
                product_image: faker.image.urlPicsumPhotos(),
            };

            cy.GetProductSummary()
                .then((summary) => {
                    cy.wrap(summary.totalProducts).as("initialTotalProducts");
                })

                .then(() => cy.AddNewProduct(request))

                .then(() =>
                    cy.GetProductSummary().then((finalSummary) => {
                        cy.get("@initialTotalProducts").then(
                            (initialTotalProducts) => {
                                expect(finalSummary.totalProducts).to.eq(
                                    initialTotalProducts + 1
                                );
                            }
                        );
                    })
                );
        });
    });

    describe("Update", () => {
        it("should fail to update product with invalid ID", () => {
            const text = randomString(4, "text").toUpperCase();
            const invalidId = text;

            cy.UpdateProduct(invalidId).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.error).to.include(
                    "Invalid product ID provided"
                );
            });
        });

        it("should successfully update product", () => {
            const request = {
                product: faker.company.name(),
                brand: faker.commerce.product(),
                type: faker.commerce.productAdjective(),
                product_status: "active",
                quantity: faker.string.numeric(),
                on_hand_quantity: faker.string.numeric(),
                note: faker.commerce.productDescription(),
                product_image: faker.image.urlPicsumPhotos(),
            };

            cy.task("getRandomProductId")
                .then((id) => cy.UpdateProduct(id, request))
                .then((response) => {
                    expect(response.status).to.eq(200);

                    const apiProduct = response.body.product;
                    cy.wrap(apiProduct).as("apiProduct");
                    cy.wrap(apiProduct.id).as("productId");
                })
                .then(() => {
                    cy.get("@productId").then((productId) => {
                        return cy.task("getProductListFromDbTask", productId);
                    });
                })
                .then((dbProduct) => {
                    cy.get("@apiProduct").then((apiProduct) => {
                        expect(apiProduct.product).to.eq(dbProduct.product);
                        expect(apiProduct.brand).to.eq(dbProduct.brand);
                        expect(apiProduct.type).to.eq(dbProduct.type);
                        expect(apiProduct.product_status).to.eq(
                            dbProduct.productStatus
                        );
                        expect(apiProduct.quantity).to.eq(dbProduct.quantity);
                        expect(apiProduct.on_hand_quantity).to.eq(
                            dbProduct.onHandQuantity
                        );
                        expect(apiProduct.note).to.eq(dbProduct.note);
                        expect(apiProduct.product_image).to.eq(
                            dbProduct.productImage
                        );
                    });
                });
        });

        it("should fail to update product with missing required fields", () => {
            const request = {
                product: "",
                brand: "",
                type: "",
                product_status: "",
                quantity: "",
                on_hand_quantity: "",
                product_image: "",
            };

            cy.task("getRandomProductId").then((randomId) => {
                cy.UpdateProduct(randomId, request).then((response) => {
                    expect(response.status).to.eq(400);

                    const requiredErrors = [
                        "product is required",
                        "brand is required",
                        "type is required",
                        "product status is required",
                        "quantity is required",
                        "on hand quantity is required",
                        "product image is required",
                    ];

                    requiredErrors.forEach((error) => {
                        expect(response.body.error).to.include(error);
                    });
                });
            });
        });

        it("should fail to update product with invalid number fields", () => {
            const testData = {
                invalidNumber: "123ABC",
            };

            const request = {
                product: faker.company.name(),
                brand: faker.commerce.product(),
                type: faker.commerce.productAdjective(),
                product_status: "active",
                quantity: faker.string.alphanumeric(5),
                on_hand_quantity: faker.string.alphanumeric(5),
                note: faker.commerce.productDescription(),
                product_image: faker.image.urlPicsumPhotos(),
            };

            cy.task("getRandomProductId").then((randomId) => {
                cy.UpdateProduct(randomId, request).then((response) => {
                    expect(response.status).to.eq(400);

                    const requiredErrors = [
                        "quantity must be a valid number",
                        "on hand quantity must be a valid number",
                    ];

                    requiredErrors.forEach((error) => {
                        expect(response.body.error).to.include(error);
                    });
                });
            });
        });

        it("should ensure deleted_at is null after successfully updating a product", () => {
            const request = {
                product: faker.company.name(),
                brand: faker.commerce.product(),
                type: faker.commerce.productAdjective(),
                product_status: "active",
                quantity: faker.string.numeric(),
                on_hand_quantity: faker.string.numeric(),
                note: faker.commerce.productDescription(),
                product_image: faker.image.urlPicsumPhotos(),
            };

            let apiProduct;

            cy.task("getRandomProductId")
                .then((id) => cy.UpdateProduct(id, request))
                .then((response) => {
                    expect(response.status).to.eq(200);
                    apiProduct = response.body.product;
                    return cy.task("getProductListFromDbTask", apiProduct.id);
                })
                .then((dbProduct) => {
                    expect(apiProduct.deleted_at).to.eq(dbProduct.deletedAt);
                    expect(apiProduct.deleted_at).to.be.null;
                });
        });

        it("should fail to update product with invalid JSON", () => {
            cy.task("getRandomProductId").then((randomId) => {
                cy.UpdateProduct(randomId).then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body.error).to.include(
                        "Invalid JSON in request body"
                    );
                });
            });
        });
    });

    describe("Delete", () => {
        it("should successfully delete product", () => {
            const request = {
                product: faker.company.name(),
                brand: faker.commerce.product(),
                type: faker.commerce.productAdjective(),
                product_status: "active",
                quantity: faker.string.numeric(),
                on_hand_quantity: faker.string.numeric(),
                note: faker.commerce.productDescription(),
                product_image: faker.image.urlPicsumPhotos(),
            };

            cy.AddNewProduct(request)
                .then((response) => {
                    cy.wrap(response.body.product.id).as("productIdToDelete");
                })
                .then(() => {
                    cy.get("@productIdToDelete").then((id) => {
                        cy.DeleteProduct(id).then((deleteResponse) => {
                            expect(deleteResponse.status).to.eq(200);
                            cy.task("getProductListFromDbTask", id).then(
                                (dbProduct) => {
                                    expect(dbProduct).to.be.null;
                                }
                            );
                        });
                    });
                });
        });

        it("should Total Products decrease by 1 after deleting a product", () => {
            let baselineTotalProducts;

            const request = {
                product: faker.company.name(),
                brand: faker.commerce.product(),
                type: faker.commerce.productAdjective(),
                product_status: "active",
                quantity: faker.string.numeric(),
                on_hand_quantity: faker.string.numeric(),
                note: faker.commerce.productDescription(),
                product_image: faker.image.urlPicsumPhotos(),
            };

            cy.GetProductSummary()
                .then((summary) => {
                    baselineTotalProducts = summary.totalProducts;
                    return cy.AddNewProduct(request);
                })
                .then((response) => {
                    const productId = response.body.product.id;
                    return cy.DeleteProduct(productId);
                })
                .then(() => cy.GetProductSummary())
                .then((summary) => {
                    expect(summary.totalProducts).to.eq(baselineTotalProducts);
                });
        });

        it("should fail with invalid ID", () => {
            cy.DeleteProduct("abc").then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.error).to.eq("Invalid product ID provided");
            });
        });
    });
});
