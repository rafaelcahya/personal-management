import { faker } from "@faker-js/faker";
import { formatToRupiah } from "../../../support/common/helper";

describe("Fee Add API and Database Comparison", () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.setupApiAuthCookies();
    });

    describe('Fee Add API', () => {
    	describe("Authentication & Authorization", () => {
            it("should return 307 or 401 when user is not authenticated", () => {
                cy.clearApiAuth();

                const request = {
                    fee_date: faker.date.recent(),
                    fee: faker.string.numeric(5),
                    fee_name: faker.animal.snake(),
                };

                cy.AddFeeNoAuth(request).then((response) => {
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
                    fee_date: faker.date.recent(),
                    fee: faker.string.numeric(5),
                    fee_name: faker.animal.snake(),
                };

                cy.AddFee(request).then((response) => {
                    expect(response.status).to.eq(201);
                    expect(response.body.success).to.be.true;
                    expect(response.body.fee).to.exist;
                });
            });
        });

    	describe("Request Body Validation", () => {
            it("should return 400 when body is missing", () => {
                cy.AddFee().then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.eq(
                        "Invalid JSON in request body",
                    );
                });
            });

            it("should return 400 for invalid JSON", () => {
                const request = "NULL";

                cy.AddFee(request).then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.eq(
                        "Invalid JSON in request body",
                    );
                });
            });

            it("should return 400 for empty body object", () => {
                const request = {};
                cy.AddFee(request).then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.be.an("array");
                });
            });
        });

        describe("Required Fields Validation", () => {
            it("should return 400 when feee_date is missing", () => {
                const request = {
                    fee: faker.string.numeric(5),
                    fee_name: faker.animal.snake(),
                };

                cy.AddFee(request).then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.be.an("array");
                    expect(response.body.error).to.include(
                        "fee date is required",
                    );
                });
            });

            it("should return 400 when fee is missing", () => {
                const request = {
                    fee_date: faker.date.recent(),
                    fee_name: faker.animal.snake(),
                };

                cy.AddFee(request).then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.be.an("array");
                    expect(response.body.error).to.include(
                        "fee is required",
                    );
                });
            });

            it("should return 400 when fee name is missing", () => {
                const request = {
                    fee_date: faker.date.recent(),
                    fee: faker.string.numeric(5),
                };

                cy.AddFee(request).then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.be.an("array");
                    expect(response.body.error).to.include(
                        "fee name is required",
                    );
                });
            });

            it("should return 400 when fee_date is empty string", () => {
                const request = {
                    fee_date: "",
                    fee: faker.string.numeric(5),
                    fee_name: faker.animal.snake(),
                };

                cy.AddFee(request).then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.be.an("array");
                    expect(response.body.error).to.include(
                        "fee date is required",
                    );
                });
            });

            it("should return 400 when fee is empty string", () => {
                const request = {
                    fee_date: faker.date.recent(),
                    fee: "",
                    fee_name: faker.animal.snake(),
                };

                cy.AddFee(request).then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.be.an("array");
                    expect(response.body.error).to.include(
                        "fee is required",
                    );
                });
            });

            it("should return 400 when fee name is empty string", () => {
                const request = {
                    fee_date: faker.date.recent(),
                    fee: faker.string.numeric(5),
                    fee_name: "",
                };

                cy.AddFee(request).then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.be.an("array");
                    expect(response.body.error).to.include(
                        "fee name is required",
                    );
                });
            });

            it("should return 400 when fee_date is null", () => {
                const request = {
                    fee_date: null,
                    fee: faker.string.numeric(5),
                    fee_name: faker.animal.snake(),
                };

                cy.AddFee(request).then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.be.an("array");
                    expect(response.body.error).to.include(
                        "fee date is required",
                    );
                });
            });

            it("should return 400 when fee is null", () => {
                const request = {
                    fee_date: faker.date.recent(),
                    fee: null,
                    fee_name: faker.animal.snake(),
                };

                cy.AddFee(request).then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.be.an("array");
                    expect(response.body.error).to.include(
                        "fee is required",
                    );
                });
            });

            it("should return 400 when fee name is null", () => {
                const request = {
                    fee_date: faker.date.recent(),
                    fee: faker.string.numeric(5),
                    fee_name: null,
                };

                cy.AddFee(request).then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.be.an("array");
                    expect(response.body.error).to.include(
                        "fee name is required",
                    );
                });
            });

            it("should return 400 with multiple validation errors", () => {
                const request = {};

                cy.AddFee(request).then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.be.an("array");
                    expect(response.body.error.length).to.be.greaterThan(1);
                    expect(response.body.error.length).to.be.eq(3);

                    cy.log(
                        `Validation errors: ${response.body.error.join(", ")}`,
                    );
                });
            });
        });
    	describe("Fee Object Structure Scenarios", () => {
            it("should create fee with all required fields", () => {
                const request = {
                    fee_date: faker.date.recent(),
                    fee: faker.string.numeric(5),
                    fee_name: faker.animal.snake(),
                };

                cy.AddFee(request).then((response) => {
                    const fee = response.body.fee;
                    expect(fee).to.have.property("id");
                    expect(fee).to.have.property("fee_date");
                    expect(fee).to.have.property("fee");
                    expect(fee).to.have.property("fee_name");
                });
            });

            it("should return correct success response structure", () => {
                const request = {
                    fee_date: faker.date.recent(),
                    fee: faker.string.numeric(5),
                    fee_name: faker.animal.snake(),
                };

                cy.AddFee(request).then((response) => {
                    expect(response.status).to.eq(201);
                    expect(response.body).to.have.all.keys("success", "fee");
                    expect(response.body.success).to.be.true;
                    expect(response.body.fee).to.be.an("object");
                });
            });

            it("should return correct error response structure", () => {
                cy.AddFee().then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body).to.have.all.keys("success", "error");
                    expect(response.body.success).to.be.false;
                    expect(response.body.error).to.exist;
                });
            });
        });

        describe("Success Scenarios", () => {
            it("should create fee with all required fields", () => {
                const request = {
                    fee_date: faker.date.recent(),
                    fee: faker.string.numeric(5),
                    fee_name: faker.animal.snake(),
                };

                cy.AddFee(request).then((response) => {
                    expect(response.status).to.eq(201);
                    expect(response.body.success).to.be.true;
                    expect(response.body.fee).to.exist;
                });
            });

            it("should assign user_id from authenticated user", () => {
                const request = {
                    fee_date: faker.date.recent(),
                    fee: faker.string.numeric(5),
                    fee_name: faker.animal.snake(),
                };

                cy.AddFee(request).then((response) => {
                    expect(response.status).to.eq(201);

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

                cy.AddFee(request).then((response) => {
                    expect(response.status).to.eq(201);

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
    });

    describe("Data Integrity - API vs Database Comparison", () => {
        let feeId;
        let userId;

        beforeEach(() => {
            const request = {
                fee_date: faker.date.recent(),
                fee: faker.string.numeric(5),
                fee_name: faker.animal.snake(),
            };

            cy.AddFee(request).then((response) => {
                cy.log("AddFee response:", JSON.stringify(response.body));
                expect(response.status).to.eq(201);
                feeId = response.body.fee.id;
                userId = response.body.fee.user_id;
                cy.log(`Created test fee ID: ${response.body.fee.id}`);
            });
        });

        describe("Complete Field Comparison", () => {
            it("should match all fields between API and DB", function () {
                let apiFee, dbFee;

                cy.GetSingleFee(feeId).then((response) => {
                    expect(response.status).to.eq(200);
                    apiFee = response.body.data;
                    cy.log("API Fee:", JSON.stringify(apiFee));
                });

                cy.getSingleFeeFromDb(feeId, userId).then((rows) => {
                    dbFee = rows[0];
                    cy.log("DB Fee:", JSON.stringify(dbFee));
                });
                cy.then(() => {
                    expect(apiFee.id, "Id").to.eq(dbFee.id);
                    expect(apiFee.fee_date, "Fee Date").to.eq(dbFee.fee_date);
                    expect(apiFee.fee, "Fee").to.eq(dbFee.fee);
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
                let apiFee, dbFee;

                cy.GetSingleFee(feeId).then((response) => {
                    apiFee = response.body.data;
                });

                cy.getSingleFeeFromDb(feeId, userId).then((rows) => {
                    dbFee = rows[0];
                });

                cy.then(() => {
                    const apiFieldCount = Object.keys(apiFee).length;
                    const dbFieldCount = Object.keys(dbFee).length;

                    expect(apiFieldCount, "Field Count").to.eq(dbFieldCount);
                    cy.log(`✅ Both have ${apiFieldCount} fields`);
                });
            });

            it("should have valid ISO timestamp formats", function () {
                let apiFee, dbFee;

                cy.GetSingleFee(feeId).then((response) => {
                    apiFee = response.body.data;
                });

                cy.getSingleFeeFromDb(feeId, userId).then((rows) => {
                    dbFee = rows[0];
                });

                cy.then(() => {
                    const apiCreatedDate = new Date(apiFee.created_at);
                    const dbCreatedDate = new Date(dbFee.created_at);

                    expect(apiCreatedDate.toString()).to.not.eq("Invalid Date");
                    expect(dbCreatedDate.toString()).to.not.eq("Invalid Date");
                    expect(apiFee.created_at).to.eq(dbFee.created_at);

                    cy.log("✅ Timestamp formats valid and match");
                });
            });

            it("should match fee values with exact precision", function () {
                let apiFee, dbFee;

                cy.GetSingleFee(feeId).then((response) => {
                    apiFee = response.body.data;
                });

                cy.getSingleFeeFromDb(feeId, userId).then((rows) => {
                    dbFee = rows[0];
                });

                cy.then(() => {
                    const apiFeeValue = parseFloat(apiFee.fee);
                    const dbFeeValue = parseFloat(dbFee.fee);

                    expect(apiFeeValue).to.eq(dbFeeValue);
                    cy.log(`✅ Fee matches: ${apiFeeValue}`);
                });
            });
        });
    });

    describe("Fee Creation - Summary Impact Tests", () => {
        describe("Total Fees Count Impact", () => {
            it("should increment feeCount after creating a new fee", () => {
                cy.GetFeeSummary().then((response) => {
                    expect(response.status).to.eq(200);
                    cy.wrap(response.body.data.feeCount).as("initialCount");
                    cy.log(`📊 Initial fee count: ${response.body.feeCount}`);
                });

                const request = {
                    fee_date: faker.date.recent().toISOString().split("T")[0],
                    fee: faker.string.numeric(5),
                    fee_name: faker.animal.snake(),
                };

                cy.AddFee(request).then((response) => {
                    expect(response.status).to.eq(201);
                    cy.log(`Created test fee ID: ${response.body.fee.id}`);
                });

                cy.GetFeeSummary().then(function (response) {
                    const newCount = response.body.data.feeCount;
                    expect(newCount).to.eq(this.initialCount + 1);
                    cy.log(
                        `✅ Fee count increased: ${this.initialCount} → ${newCount}`,
                    );
                });
            });

            it("should match feeCount with database count", () => {
                cy.GetFeeSummary().then((response) => {
                    expect(response.status).to.eq(200);
                    cy.wrap(response.body.data.feeCount).as("apiCount");
                });

                cy.getTotalFeesFromDb().then((count) => {
                    cy.wrap(count).as("dbCount");
                });

                cy.then(function () {
                    expect(this.apiCount).to.eq(this.dbCount);
                    cy.log(`✅ API and DB counts match: ${this.apiCount}`);
                });
            });
        });

        describe("Total Fees Paid Impact", () => {
            it("should increment totalFeesPaid after creating a new fee", () => {
                cy.GetFeeSummary().then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body.success).to.eq(true);
                    cy.wrap(response.body.data.totalFee).as(
                        "initialTotalFeesPaid",
                    );
                    cy.log(
                        `📊 Initial total fees paid: ${response.body.totalFee}`,
                    );
                });

                const request = {
                    fee_date: faker.date.recent().toISOString().split("T")[0],
                    fee: faker.string.numeric(5),
                    fee_name: faker.animal.snake(),
                };

                cy.AddFee(request).then((addResponse) => {
                    expect(addResponse.status).to.eq(201);
                    const fee = parseFloat(addResponse.body.fee.fee);
                    cy.wrap(fee).as("addedFee");
                    cy.log(
                        `✅ Created fee ID: ${addResponse.body.fee.id}, amount: ${fee}`,
                    );
                });

                cy.GetFeeSummary().then(function (summaryResponse) {
                    expect(summaryResponse.status).to.eq(200);
                    const newTotalFeesPaid = summaryResponse.body.data.totalFee;

                    expect(newTotalFeesPaid).to.eq(
                        this.initialTotalFeesPaid + this.addedFee,
                    );
                    cy.log(
                        `✅ Total fees paid increased: ${this.initialTotalFeesPaid} → ${newTotalFeesPaid}`,
                    );
                });
            });

            it("should match totalFeesPaid with database count", () => {
                cy.GetFeeSummary().then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body.success).to.eq(true);
                    cy.wrap(response.body.data.totalFee).as("apiTotal");
                });

                cy.getTotalFeesPaidFromDb().then((count) => {
                    cy.wrap(count).as("dbTotal");
                });

                cy.then(function () {
                    expect(this.apiTotal).to.eq(this.dbTotal);
                    cy.log(`✅ API and DB totals match: ${this.apiTotal}`);
                });
            });
        });
    });

});

describe("Add Fee Form - UI Tests", () => {
    describe("Desktop View", () => {
        beforeEach(() => {
            cy.viewport(1280, 720);
            cy.loginWithBypass();
            cy.visit("/main/trading/fee");
            cy.wait(1000);
        });
        describe("Dialog Behavior", () => {
            it("should open dialog when Add Fee button is clicked", () => {
                cy.get("#addNewFeeForm_feePage").should("not.exist");
                cy.get("#addNewFeeBtn_feePage")
                    .should("be.visible")
                    .click();
                cy.get("#addNewFeeForm_feePage").should("be.visible");
            });

            it("should close dialog when Cancel button is clicked", () => {
                cy.get("#addNewFeeBtn_feePage").click();
                cy.wait(1000);
                cy.get("#addNewFeeForm_feePage").should("be.visible");
                cy.get("#cancelNewFeeBtn_feePage").click();
                cy.get("#addNewFeeForm_feePage").should("not.exist");
            });

            it("should close dialog when clicking outside", () => {
                cy.get("#addNewFeeBtn_feePage").click();
                cy.wait(1000);
                cy.get("#addNewFeeForm_feePage").should("be.visible");
                cy.get("body").click(0, 0, { force: true });
                cy.get("#addNewFeeForm_feePage").should("not.exist");
            });
        });

        describe("Required Fields Validation", () => {
            beforeEach(() => {
                cy.get("#addNewFeeBtn_feePage").click();
                cy.wait(1000);
            });

            it("should show error when fee name is empty", () => {
                cy.get("#submitNewFeeBtn_feePage").click();
                cy.get("#feeNameField_errorMessage_feePage")
                    .should("be.visible")
                    .should(
                        "contain",
                        "Fee name must be at least 3 characters",
                    );
            });

            it("should show error when fee amount is empty", () => {
                cy.get("#feeNameField_feePage").type(
                    faker.word.noun(4).toUpperCase(),
                );
                cy.get("#submitNewFeeBtn_feePage").click();
                cy.get("#feeAmountField_errorMessage_feePage")
                    .should("be.visible")
                    .should("contain", "Fee amount is required");
            });
        });

        describe("Field Input Behavior", () => {
            beforeEach(() => {
                cy.get("#addNewFeeBtn_feePage").click();
                cy.wait(1009);
            });

            it("should accept numeric input for fee amount", () => {
                const feeAmount = faker.string.numeric(7);
                cy.get("#feeAmountField_feePage").type(feeAmount);

                cy.get("#feeAmountField_feePage").should(
                    "have.value",
                    formatToRupiah(feeAmount),
                );
            });
        });

        describe("Fee Date Picker", () => {
            beforeEach(() => {
                cy.get("#addNewFeeBtn_feePage").click();
                cy.wait(1000);
            });

            it("should open calendar when date field is clicked", () => {
                cy.get("#feeDateField_feePage").click();
                cy.get("#feeDatePicker_feePage").should("be.visible");
            });

            it("should select a date from calendar", () => {
                cy.get("#feeDateField_feePage").click();
                cy.get("#feeDatePicker_feePage")
                    .contains("button", "15")
                    .click();
                cy.get("#feeDateField_feePage").should(
                    "not.contain",
                    "Pick a date",
                );
            });

            it("should display selected date in correct format", () => {
                cy.get("#feeDateField_feePage").click();
                cy.get("#feeDatePicker_feePage")
                    .contains("button", "10")
                    .click();
                cy.get("#feeDateField_feePage")
                    .should("not.contain", "Pick a date")
                    .should("contain", "2026");
            });

            it("should format large numbers correctly", () => {
                const largeValue = "50000000";

                cy.get("#feeAmountField_feePage").type(
                    largeValue,
                );

                cy.get("#feeAmountField_feePage").should(
                    "have.value",
                    formatToRupiah(largeValue),
                );
            });

            it("should handle different value ranges", () => {
                const testCases = [
                    { input: "100000", expected: formatToRupiah("100000") },
                    { input: "5000000", expected: formatToRupiah("5000000") },
                    { input: "25000000", expected: formatToRupiah("25000000") },
                    {
                        input: "100000000",
                        expected: formatToRupiah("100000000"),
                    },
                ];

                testCases.forEach(({ input, expected }) => {
                    cy.get("#feeAmountField_feePage").clear().type(input);

                    cy.get("#feeAmountField_feePage").should(
                        "have.value",
                        expected,
                    );
                });
            });
        });
    });

    describe("Tablet View", () => {
        beforeEach(() => {
            cy.viewport(768, 1024);
            cy.loginWithBypass();
            cy.visit("/main/trading/fee");
            cy.wait(1000);
        });
        describe("Dialog Behavior", () => {
            it("should open dialog when Add Fee button is clicked", () => {
                cy.get("#addNewFeeForm_feePage").should("not.exist");
                cy.get("#addNewFeeBtn_feePage").should("be.visible").click();
                cy.get("#addNewFeeForm_feePage").should("be.visible");
            });

            it("should close dialog when Cancel button is clicked", () => {
                cy.get("#addNewFeeBtn_feePage").click();
                cy.wait(1000);
                cy.get("#addNewFeeForm_feePage").should("be.visible");
                cy.get("#cancelNewFeeBtn_feePage").click();
                cy.get("#addNewFeeForm_feePage").should("not.exist");
            });

            it("should close dialog when clicking outside", () => {
                cy.get("#addNewFeeBtn_feePage").click();
                cy.wait(1000);
                cy.get("#addNewFeeForm_feePage").should("be.visible");
                cy.get("body").click(0, 0, { force: true });
                cy.get("#addNewFeeForm_feePage").should("not.exist");
            });
        });

        describe("Required Fields Validation", () => {
            beforeEach(() => {
                cy.get("#addNewFeeBtn_feePage").click();
                cy.wait(1000);
            });

            it("should show error when fee name is empty", () => {
                cy.get("#submitNewFeeBtn_feePage").click();
                cy.get("#feeNameField_errorMessage_feePage")
                    .should("be.visible")
                    .should(
                        "contain",
                        "Fee name must be at least 3 characters",
                    );
            });

            it("should show error when fee amount is empty", () => {
                cy.get("#feeNameField_feePage").type(
                    faker.word.noun(4).toUpperCase(),
                );
                cy.get("#submitNewFeeBtn_feePage").click();
                cy.get("#feeAmountField_errorMessage_feePage")
                    .should("be.visible")
                    .should("contain", "Fee amount is required");
            });
        });

        describe("Field Input Behavior", () => {
            beforeEach(() => {
                cy.get("#addNewFeeBtn_feePage").click();
                cy.wait(1009);
            });

            it("should accept numeric input for fee amount", () => {
                const feeAmount = faker.string.numeric(7);
                cy.get("#feeAmountField_feePage").type(feeAmount);

                cy.get("#feeAmountField_feePage").should(
                    "have.value",
                    formatToRupiah(feeAmount),
                );
            });
        });

        describe("Fee Date Picker", () => {
            beforeEach(() => {
                cy.get("#addNewFeeBtn_feePage").click();
                cy.wait(1000);
            });

            it("should open calendar when date field is clicked", () => {
                cy.get("#feeDateField_feePage").click();
                cy.get("#feeDatePicker_feePage").should("be.visible");
            });

            it("should select a date from calendar", () => {
                cy.get("#feeDateField_feePage").click();
                cy.get("#feeDatePicker_feePage")
                    .contains("button", "15")
                    .click();
                cy.get("#feeDateField_feePage").should(
                    "not.contain",
                    "Pick a date",
                );
            });

            it("should display selected date in correct format", () => {
                cy.get("#feeDateField_feePage").click();
                cy.get("#feeDatePicker_feePage")
                    .contains("button", "10")
                    .click();
                cy.get("#feeDateField_feePage")
                    .should("not.contain", "Pick a date")
                    .should("contain", "2026");
            });

            it("should format large numbers correctly", () => {
                const largeValue = "50000000";

                cy.get("#feeAmountField_feePage").type(
                    largeValue,
                );

                cy.get("#feeAmountField_feePage").should(
                    "have.value",
                    formatToRupiah(largeValue),
                );
            });

            it("should handle different value ranges", () => {
                const testCases = [
                    { input: "100000", expected: formatToRupiah("100000") },
                    { input: "5000000", expected: formatToRupiah("5000000") },
                    { input: "25000000", expected: formatToRupiah("25000000") },
                    {
                        input: "100000000",
                        expected: formatToRupiah("100000000"),
                    },
                ];

                testCases.forEach(({ input, expected }) => {
                    cy.get("#feeAmountField_feePage").clear().type(input);

                    cy.get("#feeAmountField_feePage").should(
                        "have.value",
                        expected,
                    );
                });
            });
        });
    });

    describe("Mobile View", () => {
        beforeEach(() => {
            cy.viewport(375, 667);
            cy.loginWithBypass();
            cy.visit("/main/trading/fee");
            cy.wait(1000);
        });
        describe("Dialog Behavior", () => {
            it("should open dialog when Add Fee button is clicked", () => {
                cy.get("#addNewFeeForm_feePage").should("not.exist");
                cy.get("#addNewFeeBtn_feePage").should("be.visible").click();
                cy.get("#addNewFeeForm_feePage").should("be.visible");
            });

            it("should close dialog when Cancel button is clicked", () => {
                cy.get("#addNewFeeBtn_feePage").click();
                cy.wait(1000);
                cy.get("#addNewFeeForm_feePage").should("be.visible");
                cy.get("#cancelNewFeeBtn_feePage").click();
                cy.get("#addNewFeeForm_feePage").should("not.exist");
            });

            it("should close dialog when clicking outside", () => {
                cy.get("#addNewFeeBtn_feePage").click();
                cy.wait(1000);
                cy.get("#addNewFeeForm_feePage").should("be.visible");
                cy.get("body").click(0, 0, { force: true });
                cy.get("#addNewFeeForm_feePage").should("not.exist");
            });
        });

        describe("Required Fields Validation", () => {
            beforeEach(() => {
                cy.get("#addNewFeeBtn_feePage").click();
                cy.wait(1000);
            });

            it("should show error when fee name is empty", () => {
                cy.get("#submitNewFeeBtn_feePage").click();
                cy.get("#feeNameField_errorMessage_feePage")
                    .should("be.visible")
                    .should(
                        "contain",
                        "Fee name must be at least 3 characters",
                    );
            });

            it("should show error when fee amount is empty", () => {
                cy.get("#feeNameField_feePage").type(
                    faker.word.noun(4).toUpperCase(),
                );
                cy.get("#submitNewFeeBtn_feePage").click();
                cy.get("#feeAmountField_errorMessage_feePage")
                    .should("be.visible")
                    .should("contain", "Fee amount is required");
            });
        });

        describe("Field Input Behavior", () => {
            beforeEach(() => {
                cy.get("#addNewFeeBtn_feePage").click();
                cy.wait(1009);
            });

            it("should accept numeric input for fee amount", () => {
                const feeAmount = faker.string.numeric(7);
                cy.get("#feeAmountField_feePage").type(feeAmount);

                cy.get("#feeAmountField_feePage").should(
                    "have.value",
                    formatToRupiah(feeAmount),
                );
            });
        });

        describe("Fee Date Picker", () => {
            beforeEach(() => {
                cy.get("#addNewFeeBtn_feePage").click();
                cy.wait(1000);
            });

            it("should open calendar when date field is clicked", () => {
                cy.get("#feeDateField_feePage").click();
                cy.get("#feeDatePicker_feePage").should("be.visible");
            });

            it("should select a date from calendar", () => {
                cy.get("#feeDateField_feePage").click();
                cy.get("#feeDatePicker_feePage")
                    .contains("button", "15")
                    .click();
                cy.get("#feeDateField_feePage").should(
                    "not.contain",
                    "Pick a date",
                );
            });

            it("should display selected date in correct format", () => {
                cy.get("#feeDateField_feePage").click();
                cy.get("#feeDatePicker_feePage")
                    .contains("button", "10")
                    .click();
                cy.get("#feeDateField_feePage")
                    .should("not.contain", "Pick a date")
                    .should("contain", "2026");
            });

            it("should format large numbers correctly", () => {
                const largeValue = "50000000";

                cy.get("#feeAmountField_feePage").type(
                    largeValue,
                );

                cy.get("#feeAmountField_feePage").should(
                    "have.value",
                    formatToRupiah(largeValue),
                );
            });

            it("should handle different value ranges", () => {
                const testCases = [
                    { input: "100000", expected: formatToRupiah("100000") },
                    { input: "5000000", expected: formatToRupiah("5000000") },
                    { input: "25000000", expected: formatToRupiah("25000000") },
                    {
                        input: "100000000",
                        expected: formatToRupiah("100000000"),
                    },
                ];

                testCases.forEach(({ input, expected }) => {
                    cy.get("#feeAmountField_feePage").clear().type(input);

                    cy.get("#feeAmountField_feePage").should(
                        "have.value",
                        expected,
                    );
                });
            });
        });
    });
});