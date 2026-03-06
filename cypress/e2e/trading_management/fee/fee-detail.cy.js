import { faker } from "@faker-js/faker";

describe("Fee Detail API", () => {
    let testFeeId;
    let testUserId;
    let request;
    let responseFee;

    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.setupApiAuthCookies();

        request = {
            fee_date: faker.date.recent(),
            fee: faker.string.numeric(5),
            fee_name: faker.animal.snake(),
        };

        cy.AddFee(request).then((response) => {
            expect(response.body.success).to.be.true;
            expect(response.body.fee).to.exist;
            expect(response.status).to.eq(201);

            testUserId = response.body.fee.user_id;
            testFeeId = response.body.fee.id;
            responseFee = response.body.fee;
        });
    });

    describe("Authentication & Authorization", () => {
        it("should return 401 for unauthenticated requests", () => {
            cy.clearCookies();

            cy.GetFeeDetailNoAuth(testFeeId).then((response) => {
                expect(response.status).to.be.oneOf([307, 401]);

                if (response.status === 401) {
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.eq("Unauthorized");
                }

                const location = response.headers.location || response.body;
                expect(String(location)).to.include("/login");
            });
        });

        it("should return 200 for authenticated user", () => {
            cy.GetFeeDetail(testFeeId).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.success).to.be.true;
                expect(response.body.data).to.exist;
                expect(response.body.data.id).to.eq(testFeeId);
            });
        });
    });

    describe("Parameter Validation", () => {
        it("should return 400 for invalid fee ID (non-numeric)", () => {
            cy.GetFeeDetail("invalid-id").then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.include("Fee ID");
            });
        });

        it("should return 400 for empty fee ID", () => {
            cy.GetFeeDetail().then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.eq(
                    "Fee ID must be a valid number",
                );
            });
        });

        it("should return 400 for non-integer fee ID", () => {
            cy.GetFeeDetail("123.45").then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.eq(
                    "Fee ID must be an integer",
                );
            });
        });
    });

    describe("Valid Fee Retrieval", () => {
        it("should return correct fee data", () => {
            let apiFee;

            cy.GetFeeDetail(testFeeId).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.success).to.be.true;
                expect(response.body.data).to.exist;

                apiFee = response.body.data;

                expect(apiFee.id).to.eq(testFeeId);
                expect(apiFee.fee).to.eq(responseFee.fee);
                expect(apiFee.fee_date).to.eq(responseFee.fee_date);
                expect(apiFee.fee_name).to.eq(responseFee.fee_name);
            });
        });

        it("should return all fee fields", () => {
            cy.GetFeeDetail(testFeeId).then((response) => {
                const fee = response.body.data;
                expect(fee).to.have.property("id");
                expect(fee).to.have.property("fee");
                expect(fee).to.have.property("fee_date");
                expect(fee).to.have.property("fee_name");
            });
        });

        it("should return correct response structure", () => {
            cy.GetFeeDetail(testFeeId).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.all.keys("success", "data");
                expect(response.body.success).to.be.true;
                expect(response.body.data).to.be.an("object");
                expect(response.body.data.id).to.be.a("number");
            });
        });

        it("should return JSON content-type", () => {
            cy.GetFeeDetail(testFeeId).then((response) => {
                expect(response.headers["content-type"]).to.include(
                    "application/json",
                );
            });
        });
    });

    describe("Fee Not Found", () => {
        it("should return 404 for non-existent fee ID", () => {
            const fakeId = 999999999;

            cy.GetFeeDetail(fakeId).then((response) => {
                expect(response.status).to.eq(404);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.eq("Fee not found");
                expect(response.body.data).to.not.exist;
            });
        });

        it("should return 404 for fee owned by other user", () => {
            const otherUserFeeId = 72;

            cy.GetFeeDetail(otherUserFeeId).then((response) => {
                expect(response.status).to.eq(404);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.eq("Fee not found");
            });
        });
    });

    describe("Data Integrity", () => {
        it("should match database data exactly", () => {
            let apiFee, dbFee;

            cy.GetFeeDetail(testFeeId).then((response) => {
                apiFee = response.body.data;
            });

            cy.getSingleFeeFromDb(testFeeId.toString()).then((fee) => {
                dbFee = fee[0];
            });

            cy.then(() => {
                expect(apiFee.id).to.eq(dbFee.id);
                expect(apiFee.fee).to.eq(dbFee.fee);
                expect(apiFee.fee_date).to.eq(dbFee.fee_date);
                expect(apiFee.fee_name).to.eq(dbFee.fee_name);
                expect(apiFee.user_id).to.eq(dbFee.user_id);
                expect(apiFee.created_at).to.eq(dbFee.created_at);
            });
        });
    });

    describe("Performance", () => {
        it("should respond within 1 second", () => {
            const startTime = Date.now();

            cy.GetFeeDetail(testFeeId).then((response) => {
                const duration = Date.now() - startTime;

                expect(response.status).to.eq(200);
                expect(duration).to.be.lessThan(1000);

                cy.log(`⏱️ Response time: ${duration}ms`);
            });
        });

        it("should handle concurrent requests", () => {
            const requests = Array.from({ length: 5 }, () =>
                cy.GetFeeDetail(testFeeId),
            );

            requests.forEach((request) => {
                request.then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body.data.id).to.eq(testFeeId);
                });
            });
        });
    });

    describe("Caching & Consistency", () => {
        it("should return consistent data across multiple requests", () => {
            const feeIds = Array.from({ length: 3 }, () =>
                cy.GetFeeDetail(testFeeId),
            );

            let firstFee;

            feeIds.forEach((request, index) => {
                request.then((response) => {
                    const fee = response.body.data;

                    if (index === 0) {
                        firstFee = fee;
                    } else {
                        expect(fee.id).to.eq(firstFee.id);
                        expect(fee.fee).to.eq(firstFee.fee);
                        expect(fee.fee_name).to.eq(firstFee.fee_name);
                        expect(fee.fee_date).to.eq(firstFee.fee_date);
                    }
                });
            });
        });
    });
});
