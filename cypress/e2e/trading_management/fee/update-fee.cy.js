import { faker } from "@faker-js/faker";

describe("Fee Update API", () => {
    let testFeeId;
    let testUserId;

    before(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
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

    describe("Authentication & Authorization", () => {
        it("should update fee successfully (200)", () => {
            const request = {
                fee_date: faker.date.recent(),
                fee: faker.string.numeric(5),
                fee_name: faker.animal.snake(),
            };

            cy.UpdateFee(testFeeId, request).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.success).to.be.true;
                expect(response.body.fee).to.exist;
            });
        });

        it("should return 401 without authentication", () => {
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

    describe("Fee Object Structure Scenarios", () => {
        it("should update fee with all required fields", () => {
            const request = {
                fee_date: faker.date.recent(),
                fee: faker.string.numeric(5),
                fee_name: faker.animal.snake(),
            };

            cy.UpdateFee(testFeeId, request).then((response) => {
                const fee = response.body.fee;
                expect(fee).to.have.property("id");
                expect(fee).to.have.property("fee");
                expect(fee).to.have.property("fee_date");
                expect(fee).to.have.property("fee_name");
                expect(fee).to.have.property("user_id");
                expect(fee).to.have.property("created_at");
                expect(fee).to.have.property("updated_at");
                expect(fee).to.have.property("deleted_at");
                expect(fee).to.have.property("uuid");
            });
        });

        it("should return complete updated fee object", () => {
            const request = {
                fee_date: faker.date.recent(),
                fee: faker.string.numeric(5),
                fee_name: faker.animal.snake(),
            };

            cy.UpdateFee(testFeeId, request).then((response) => {
                const fee = response.body.fee;
                expect(fee).to.have.all.keys([
                    "created_at",
                    "deleted_at",
                    "fee_date",
                    "fee",
                    "id",
                    "fee_name",
                    "updated_at",
                    "user_id",
                    "uuid",
                ]);
            });
        });

        it("should return correct success response structure", () => {
            const request = {
                fee_date: faker.date.recent(),
                fee: faker.string.numeric(5),
                fee_name: faker.animal.snake(),
            };

            cy.UpdateFee(testFeeId, request).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.all.keys("success", "fee");
                expect(response.body.success).to.be.true;
                expect(response.body.fee).to.be.an("object");
            });
        });

        it("should return correct error response structure", () => {
            cy.UpdateFee().then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body).to.have.all.keys("success", "error");
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.exist;
            });
        });
    });

    describe("Success Scenario", () => {
        it("should update fee successfully (200)", () => {
            const today = new Date().toISOString().split("T")[0];

            const request = {
                fee_date: today,
                fee: faker.string.numeric(5),
                fee_name: faker.animal.snake(),
            };

            cy.UpdateFee(testFeeId, request).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.success).to.be.true;

                const exactFields = ["fee", "fee_name"];
                exactFields.forEach((field) => {
                    expect(response.body.fee[field]).to.eq(request[field]);
                });

                expect(response.body.fee.fee_date).to.include(request.fee_date);

                cy.log("✅ All fields updated:", JSON.stringify(request));
            });
        });


        it("should assign user_id from authenticated user", () => {
            const request = {
                fee_date: faker.date.recent(),
                fee: faker.string.numeric(5),
                fee_name: faker.animal.snake(),
            };

            cy.UpdateFee(testFeeId, request).then((response) => {
                expect(response.status).to.eq(200);

                const fee = response.body.fee;
                expect(fee.user_id).to.exist;
                expect(fee.user_id).to.be.a("string");
                expect(fee.user_id.length).to.be.greaterThan(0);

                cy.log(`✅ User ID assigned: ${fee.user_id}`);
            });
        });

        it("should generate timestamps (created_at, updated_at)", () => {
            const request = {
                fee_date: faker.date.recent(),
                fee: faker.string.numeric(5),
                fee_name: faker.animal.snake(),
            };

            cy.UpdateFee(testFeeId, request).then((response) => {
                expect(response.status).to.eq(200);

                const fee = response.body.fee;
                expect(fee.created_at).to.exist;
                expect(fee.updated_at).to.exist;

                expect(new Date(fee.created_at).toString()).to.not.eq(
                    "Invalid Date",
                );

                cy.log("✅ Timestamps generated correctly");
            });
        });
    });

    describe("Data Integrity - API vs Database Comparison", () => {
        beforeEach(() => {
            const request = {
                fee_date: faker.date.recent().toISOString().split("T")[0],
                fee: faker.string.numeric(5),
                fee_name: faker.animal.snake(),
            };

            cy.UpdateFee(testFeeId, request).then((response) => {
                expect(response.status).to.eq(200);
                cy.wrap(response.body.fee).as("feeData");
            });
        });

        describe("Complete Field Comparison", () => {
            it("should match all fields between API and DB", function () {
                const feeId = this.feeData.id;
                let apiFee, dbFee;

                cy.GetSingleFee(feeId).then((response) => {
                    expect(response.status).to.eq(200);
                    apiFee = response.body.data;
                    cy.log("API Fee:", JSON.stringify(apiFee));
                });

                cy.getSingleFeeFromDb(feeId.toString()).then((rows) => {
                    dbFee = rows[0];
                    cy.log("DB Fee:", JSON.stringify(dbFee));

                    expect(apiFee.id, "ID").to.eq(dbFee.id);
                    expect(apiFee.fee, "Fee").to.eq(dbFee.fee);
                    expect(apiFee.fee_date, "Fee Date").to.eq(dbFee.fee_date);
                    expect(apiFee.user_id, "User ID").to.eq(dbFee.user_id);
                    expect(apiFee.fee_name, "Fee Name").to.eq(dbFee.fee_name);
                    expect(apiFee.created_at, "Created At").to.eq(
                        dbFee.created_at,
                    );
                    expect(apiFee.updated_at, "Updated At").to.eq(
                        dbFee.updated_at,
                    );
                    expect(apiFee.deleted_at, "Deleted At").to.eq(
                        dbFee.deleted_at,
                    );

                    cy.log("✅ All fields match between API and DB");
                });
            });

            it("should have identical field count", function () {
                const feeId = this.feeData.id;
                let apiFee, dbFee;

                cy.GetSingleFee(feeId).then((response) => {
                    apiFee = response.body.data;
                });

                cy.getSingleFeeFromDb(feeId.toString()).then((rows) => {
                    dbFee = rows[0];

                    const apiFieldCount = Object.keys(apiFee).length;
                    const dbFieldCount = Object.keys(dbFee).length;

                    expect(apiFieldCount, "Field Count").to.eq(dbFieldCount);
                    cy.log(`✅ Both have ${apiFieldCount} fields`);
                });
            });

            it("should have valid ISO timestamp formats", function () {
                const feeId = this.feeData.id;
                let apiFee, dbFee;

                cy.GetSingleFee(feeId).then((response) => {
                    apiFee = response.body.data;
                });

                cy.getSingleFeeFromDb(feeId.toString()).then((rows) => {
                    dbFee = rows[0];

                    const apiCreatedDate = new Date(apiFee.created_at);
                    const dbCreatedDate = new Date(dbFee.created_at);

                    expect(apiCreatedDate.toString()).to.not.eq("Invalid Date");
                    expect(dbCreatedDate.toString()).to.not.eq("Invalid Date");
                    expect(apiFee.created_at).to.eq(dbFee.created_at);

                    cy.log("✅ Timestamp formats valid and match");
                });
            });

            it("should match fee values with exact precision", function () {
                const feeId = this.feeData.id;
                let apiFee, dbFee;

                cy.GetSingleFee(feeId).then((response) => {
                    apiFee = response.body.data;
                });

                cy.getSingleFeeFromDb(feeId.toString()).then((rows) => {
                    dbFee = rows[0];

                    const apiFeeValue = parseFloat(apiFee.fee);
                    const dbFeeValue = parseFloat(dbFee.fee);

                    expect(apiFeeValue).to.eq(dbFeeValue);
                    cy.log(`✅ Fee matches: ${apiFeeValue}`);
                });
            });
        });
    });

    describe("Fee Update - Summary Impact Tests", () => {
        describe("Total Fees Paid Impact", () => {
            beforeEach(() => {
                const request = {
                    fee_date: faker.date.recent().toISOString().split("T")[0],
                    fee: faker.string.numeric(5),
                    fee_name: faker.animal.snake(),
                };

                cy.AddFee(request).then((response) => {
                    expect(response.status).to.eq(201);
                    cy.wrap(response.body.fee).as("feeData");
                });
            });

            it("should reflect updated fee in total fees paid", function () {
                cy.GetFeeSummary().then((summaryResponse) => {
                    expect(summaryResponse.status).to.eq(200);
                    cy.wrap(summaryResponse.body.data.totalFee).as("initialTotal");
                    cy.log(
                        `📊 Initial total: ${summaryResponse.body.totalFee}`,
                    );
                });

                const updateRequest = {
                    fee_date: faker.date.recent().toISOString().split("T")[0],
                    fee: faker.string.numeric(6),
                    fee_name: faker.animal.snake(),
                };

                cy.UpdateFee(this.feeData.id, updateRequest).then(
                    (updateResponse) => {
                        expect(updateResponse.status).to.eq(200);
                        cy.wrap(parseFloat(updateResponse.body.fee.fee)).as(
                            "newFee",
                        );
                    },
                );

                cy.GetFeeSummary().then((newSummaryResponse) => {
                    expect(newSummaryResponse.status).to.eq(200);
                    const newTotal = newSummaryResponse.body.data.totalFee;
                    const oldFee = parseFloat(this.feeData.fee);
                    const expectedTotal =
                        this.initialTotal - oldFee + this.newFee;

                    expect(newTotal).to.eq(expectedTotal);
                    cy.log(
                        `✅ Total updated: ${this.initialTotal} → ${newTotal}`,
                    );
                });
            });

            it("should reflect decreased fee in total fees paid", function () {
                cy.GetFeeSummary().then((summaryResponse) => {
                    expect(summaryResponse.status).to.eq(200);
                    cy.wrap(summaryResponse.body.data.totalFee).as(
                        "initialTotal",
                    );
                    cy.log(
                        `📊 Initial total: ${summaryResponse.body.totalFee}`,
                    );
                });

                const updateRequest = {
                    fee_date: faker.date.recent().toISOString().split("T")[0],
                    fee: faker.string.numeric(3),
                    fee_name: faker.animal.snake(),
                };

                cy.UpdateFee(this.feeData.id, updateRequest).then(
                    (updateResponse) => {
                        expect(updateResponse.status).to.eq(200);
                        cy.wrap(parseFloat(updateResponse.body.fee.fee)).as(
                            "newFee",
                        );
                    },
                );

                cy.GetFeeSummary().then((newSummaryResponse) => {
                    expect(newSummaryResponse.status).to.eq(200);
                    const newTotal = newSummaryResponse.body.data.totalFee;
                    const oldFee = parseFloat(this.feeData.fee);
                    const expectedTotal =
                        this.initialTotal - oldFee + this.newFee;

                    expect(newTotal).to.be.lessThan(this.initialTotal);
                    expect(newTotal).to.eq(expectedTotal);
                    cy.log(
                        `✅ Total decreased: ${this.initialTotal} → ${newTotal}`,
                    );
                });
            });
        });
    });


    describe("Request Body Validation", () => {
        it("should return 400 when body is missing", () => {
            cy.UpdateFee(testFeeId).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.eq(
                    "Invalid JSON in request body",
                );
            });
        });

        it("should return 400 for invalid JSON", () => {
            const request = "NULL";

            cy.UpdateFee(testFeeId, request).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.eq(
                    "Invalid JSON in request body",
                );
            });
        });

        it("should return 400 for invalid fee ID format", () => {
            cy.UpdateFee("abc", {}).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
            });
        });

        it("should return 400 for empty body object", () => {
            const request = {};
            cy.UpdateFee(testFeeId, request).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.be.an("array");
            });
        });
    });

    describe("Update Fee Performance", () => {
        it("should update within 2s", () => {
            const start = Date.now();
            cy.UpdateFee(testFeeId, { notes: "perf test" }).then((response) => {
                const duration = Date.now() - start;
                expect(duration).to.be.lte(2000);
                cy.log(`Update time: ${duration}ms`);
            });
        });
    });
});
