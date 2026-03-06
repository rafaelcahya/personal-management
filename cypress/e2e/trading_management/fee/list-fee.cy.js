import { faker } from "@faker-js/faker";

describe("Fee List API", () => {
    let testUserId;
    let testFeeIds = [];
    let testFeesData = [];

    const request = () => ({
        fee_date: faker.date.recent(),
        fee: faker.string.numeric(5),
        fee_name: faker.animal.snake(),
    });

    before(async () => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.setupApiAuthCookies();

        await Promise.all(
            Array.from({ length: 3 }).map(() =>
                cy.AddFee(request()).then((response) => {
                    expect(response.body.success).to.be.true;
                    expect(response.body.fee).to.exist;
                    expect(response.status).to.eq(201);
                    const fee = response.body.fee;
                    testUserId = fee.user_id;
                    testFeeIds.push(fee.id);
                    testFeesData.push(fee);
                }),
            ),
        );
    });

    beforeEach(() => {
        cy.setupApiAuthCookies();
    });

    it("should return 200 with fees list for authenticated user", () => {
        cy.GetListFee().then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.success).to.be.true;
            expect(response.body.fees).to.be.an("array");
            expect(response.body.fees.length).to.be.gte(testFeeIds.length);
            testFeeIds.forEach((id) => {
                expect(response.body.fees.some((t) => t.id === id)).to.be
                    .true;
            });
        });
    });

    it("should return only authenticated user's fees", () => {
        cy.GetListFee().then((response) => {
            response.body.fees.forEach((fee) => {
                expect(fee.user_id).to.eq(testUserId);
            });
        });
    });

    it("should sort fees by fee_date DESC", () => {
        cy.GetListFee().then((response) => {
            const fees = response.body.fees;
            for (let i = 0; i < fees.length - 1; i++) {
                const date1 = new Date(fees[i].fee_date);
                const date2 = new Date(fees[i + 1].fee_date);
                expect(date1.getTime()).to.gte(date2.getTime());
            }
        });
    });

    it("should return 401 Unauthorized without auth", () => {
        cy.clearCookies();
        cy.GetListFeeNoAuth().then((response) => {
            expect(response.status).to.be.oneOf([401, 307]);
            if (response.status === 401) {
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.eq("Unauthorized");
            }
        });
    });

    it("should return correct response structure", () => {
        cy.GetListFee().then((response) => {
            expect(response.body).to.have.all.keys("success", "fees");
            expect(response.body.success).to.be.a("boolean");
            expect(response.body.fees).to.be.an("array");

            if (response.body.fees.length > 0) {
                const fee = response.body.fees[0];
                expect(fee).to.have.all.keys([
                    "created_at",
                    "deleted_at",
                    "id",
                    "fee",
                    "fee_name",
                    "fee_date",
                    "updated_at",
                    "user_id",
                    "uuid",
                ]);
            }
        });
    });

    it("should respond within 1000ms", () => {
        const start = Date.now();
        cy.GetListFee().then(() => {
            const duration = Date.now() - start;
            expect(duration).to.be.lte(1000);
            cy.log(`Response time: ${duration}ms`);
        });
    });
});
