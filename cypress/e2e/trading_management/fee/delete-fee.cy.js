import { faker } from "@faker-js/faker";

describe("Fee Delete API", () => {
    let testFeeId;
    let testUserId;

    before(() => {
        cy.setupApiAuthCookies();
        
        const request = {
            fee_date: faker.date.recent(),
            fee: faker.string.numeric(5),
            fee_name: faker.animal.snake(),
        };

        cy.AddFee(request).then((response) => {
            expect(response.status).to.eq(201);
            testFeeId = response.body.fee.id;
            testUserId = response.body.fee.user_id;

            cy.log(`✅ Created test fee ID: ${testFeeId}`);
        });
    });

    beforeEach(() => {
        cy.setupApiAuthCookies();
    });

    it("should delete fee successfully (200)", () => {
        cy.DeleteFee(testFeeId).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.success).to.be.true;
            expect(response.body.message).to.eq("Fee deleted successfully");
        });

        cy.GetFeeDetail(testFeeId).then((detailResponse) => {
            expect(detailResponse.status).to.eq(404);
        });
    });

    it("should return 401 without authentication", () => {
        cy.clearCookies();
        cy.DeleteFeeNoAuth(testFeeId).then((response) => {
            cy.clearCookies();

            const updateData = { notes: "unauth test" };
            cy.UpdateFeeNoAuth(testFeeId, updateData).then((response) => {
                expect(response.status).to.be.oneOf([307, 401]);

                if (response.status === 401) {
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.eq("Unauthorized");
                }

                const location = response.headers.location || response.body;
                expect(String(location)).to.include("/login");
            });
        });
    });

    it("should return 400 for negative/zero fee ID", () => {
        cy.DeleteFee("0").then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body.error).to.eq("Invalid fee ID format");
        });
    });

    it("should update fee summary after deletion", () => {
        const request = {
            fee_date: faker.date.recent(),
            fee: faker.string.numeric(5),
            fee_name: faker.animal.snake(),
        };

        cy.AddFee(request).then((response) => {
            expect(response.status).to.eq(201);
            testFeeId = response.body.fee.id;
            testUserId = response.body.fee.user_id;

            cy.GetFeeSummary().then((beforeDelete) => {
                cy.DeleteFee(testFeeId).then(() => {
                    cy.wait(1000);
                    cy.GetFeeSummary().then((afterDelete) => {
                        expect(afterDelete.body.data.feeCount).to.eq(
                            beforeDelete.body.data.feeCount - 1,
                        );
                    });
                });
            });
        });
    });

    it("should delete within 1s", () => {
        const start = Date.now();
        cy.DeleteFee(testFeeId).then((response) => {
            const duration = Date.now() - start;
            expect(duration).to.be.lte(1000);
            cy.log(`Delete time: ${duration}ms`);
        });
    });

    it("should return correct success response", () => {
        cy.DeleteFee(testFeeId).then((response) => {
            expect(response.body).to.have.all.keys("success", "message");
            expect(response.body.success).to.be.true;
            expect(response.body.message).to.eq("Fee deleted successfully");
        });
    });
});
