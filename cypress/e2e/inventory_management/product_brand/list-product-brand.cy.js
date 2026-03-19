import { faker } from "@faker-js/faker";

describe("Product Brand List API", () => {
    let testUserId;
    let testProductBrandIds = [];
    let testProductBrandsData = [];

    const request = () => ({
        brand_status: faker.food.fruit(),
        note: faker.word.words(25),
        brand: faker.food.fruit(),
    });

    before(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.setupApiAuthCookies();

        Cypress._.times(3, () => {
            cy.AddProductBrand(request()).then((response) => {
                expect(response.body.success).to.be.true;
                expect(response.body.productBrand).to.exist;
                expect(response.status).to.eq(201);
                const productBrand = response.body.productBrand;
                testUserId = productBrand.user_id;
                testProductBrandIds.push(productBrand.id);
                testProductBrandsData.push(productBrand);
            });
        });
    });

    beforeEach(() => {
        cy.setupApiAuthCookies();
    });

    it("should return 200 with product brand list for authenticated user", () => {
        cy.GetListProductBrand().then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.success).to.be.true;
            expect(response.body.data).to.be.an("array");
            expect(response.body.data.length).to.be.gte(
                testProductBrandIds.length,
            );
            testProductBrandIds.forEach((id) => {
                expect(response.body.data.some((t) => t.id === id)).to.be.true;
            });
        });
    });

    it("should return only authenticated user's product brand", () => {
        cy.GetListProductBrand().then((response) => {
            response.body.data.forEach((productBrand) => {
                expect(productBrand.user_id).to.eq(testUserId);
            });
        });
    });

    it("should sort product brand by brand ASC", () => {
        cy.GetListProductBrand().then((response) => {
            const productBrands = response.body.data;
            for (let i = 0; i < productBrands.length - 1; i++) {
                const brand1 = productBrands[i].brand.toLowerCase();
                const brand2 = productBrands[i + 1].brand.toLowerCase();
                expect(brand1.localeCompare(brand2)).to.be.lte(0);
            }
        });
    });

    it("should include all product brands created in before()", () => {
        cy.GetListProductBrand().then((response) => {
            expect(response.body.data.length).to.be.gte(
                testProductBrandIds.length,
            );
            testProductBrandIds.forEach((id) => {
                expect(response.body.data.some((t) => t.id === id)).to.be.true;
            });
        });
    });

    it("should return created product brands with correct field values", () => {
        cy.GetListProductBrand().then((response) => {
            testProductBrandsData.forEach((created) => {
                const found = response.body.data.find(
                    (t) => t.id === created.id,
                );
                expect(found).to.exist;
                expect(found.brand).to.eq(created.brand);
                expect(found.brand_status).to.eq(created.brand_status);
                expect(found.note).to.eq(created.note);
                expect(found.user_id).to.eq(created.user_id);
            });
        });
    });

    it("should return 401 Unauthorized without auth", () => {
        cy.clearCookies();
        cy.GetListProductBrandNoAuth().then((response) => {
            expect(response.status).to.be.oneOf([401, 307]);
            if (response.status === 401) {
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.eq("Unauthorized");
            }
        });
    });

    it("should return correct response structure", () => {
        cy.GetListProductBrand().then((response) => {
            expect(response.body).to.have.all.keys("success", "data");
            expect(response.body.success).to.be.a("boolean");
            expect(response.body.data).to.be.an("array");

            if (response.body.data.length > 0) {
                const productBrands = response.body.data[0];
                expect(productBrands).to.have.all.keys([
                    "created_at",
                    "deleted_at",
                    "id",
                    "brand",
                    "brand_status",
                    "note",
                    "updated_at",
                    "user_id",
                    "uuid",
                ]);
            }
        });
    });

    it("should return data as array even when no product brands exist", () => {
        cy.GetListProductBrand().then((response) => {
            expect(response.body.data).to.be.an("array");
        });
    });

    it("should return valid timestamps for each product brand", () => {
        cy.GetListProductBrand().then((response) => {
            response.body.data.forEach((item) => {
                expect(Date.parse(item.created_at)).to.not.be.NaN;
                expect(Date.parse(item.updated_at)).to.not.be.NaN;
            });
        });
    });

    it("should respond within 1000ms", () => {
        const start = Date.now();
        cy.GetListProductBrand().then(() => {
            const duration = Date.now() - start;
            expect(duration).to.be.lte(1000);
            cy.log(`Response time: ${duration}ms`);
        });
    });
});
