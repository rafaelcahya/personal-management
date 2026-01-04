import { faker } from "@faker-js/faker";
import { randomString } from "../../support/common/helper";

describe("Fee API", () => {
    before(() => {
        cy.task("clearFixtureFile", "feeIds.json");
    });

    describe("Summary", () => {
        it("should display correct total transactions in summary", () => {
            cy.GetFeeSummary().then((summary) => {
                cy.task("getTotalTransactionsFromDbTask").then((dbCount) => {
                    expect(summary.feeCount).to.eq(dbCount.total_transactions);
                });
            });
        });

        it("should display correct total fees in summary", () => {
            cy.GetFeeSummary().then((summary) => {
                cy.task("getTotalFeeFromDbTask").then((dbTotalFee) => {
                    expect(summary.totalFee).to.eq(dbTotalFee.total_fee);
                });
            });
        });
    });

    describe("Create", () => {
        it("should successfully add new fee", () => {
            const request = {
                fee_name: faker.food.dish(),
                fee_date: faker.date.recent(),
                fee: faker.string.numeric(5),
            };

            cy.AddNewFee(request).then((response) => {
                expect(response.status).to.eq(200);

                cy.wrap(response.body.fee).as("apiFee");
                cy.wrap(response.body.fee.id).as("feeId");

                cy.get("@feeId").then((id) => {
                    cy.task("getFeeFromDbTask", id).then((dbFee) => {
                        cy.get("@apiFee").then((apiFee) => {
                            expect(apiFee.fee_name).to.eq(dbFee.feeName);
                            expect(apiFee.fee).to.eq(dbFee.fee);
                            expect(apiFee.fee_date).to.eq(dbFee.feeDate);
                        });
                    });
                });

                cy.saveFeeId(response.body.fee.id);
            });
        });

        it("should fail to add new fee with missing required fields", () => {
            const request = {
                fee_name: "",
                fee_date: "",
                fee: "",
            };

            cy.AddNewFee(request).then((response) => {
                expect(response.status).to.eq(400);

                cy.wrap(response.body.fee).as("apiFee");

                const requiredErrors = [
                    "fee name is required",
                    "fee date is required",
                    "fee is required",
                ];

                requiredErrors.forEach((error) => {
                    expect(response.body.error).to.include(error);
                });
            });
        });

        it("should fail to add new fee with invalid JSON", () => {
            cy.AddNewFee().then((response) => {
                expect(response.status).to.eq(400);

                cy.wrap(response.body.fee).as("apiFee");

                expect(response.body.error).to.include(
                    "Invalid JSON in request body"
                );
            });
        });

        it("should fail to add new fee with invalid number fields", () => {
            const testData = {
                text: randomString(4, "text").toUpperCase(),
                date: new Date().toISOString().replace("Z", "+00:00"),
                invalidNumber: "123ABC",
            };

            const request = {
                fee_name: faker.food.dish(),
                fee_date: faker.date.recent(),
                fee: faker.string.alphanumeric(5),
            };

            cy.AddNewFee(request).then((response) => {
                expect(response.status).to.eq(400);

                expect(response.body.error).to.include(
                    "fee must be a valid number"
                );
            });
        });

        it("should ensure deleted_at is null after successfully adding a new fee", () => {
            const testData = {
                date: new Date().toISOString().replace("Z", "+00:00"),
                text: randomString(10, "text").toUpperCase(),
                number: randomString(5, "number"),
            };

            const request = {
                fee_name: faker.food.dish(),
                fee_date: faker.date.recent(),
                fee: faker.string.numeric(5),
            };

            cy.AddNewFee(request).then((response) => {
                expect(response.status).to.eq(200);

                cy.wrap(response.body.fee.id).as("feeId");

                cy.get("@feeId").then((id) => {
                    cy.task("getFeeFromDbTask", id).then((dbFee) => {
                        expect(response.body.fee.deleted_at).to.eq(
                            dbFee.deletedAt
                        );
                        expect(response.body.fee.deleted_at).to.be.null;
                    });
                });

                cy.saveFeeId(response.body.fee.id);
            });
        });

        it("should Total Transactions in summary increase by 1 after adding a new fee", () => {
            const request = {
                fee_name: faker.food.dish(),
                fee_date: faker.date.recent(),
                fee: faker.string.numeric(5),
            };

            cy.GetFeeSummary()
                .then((summary) => {
                    cy.wrap(summary.feeCount).as("initialTotalFees");
                })
                .then(() => cy.AddNewFee(request))
                .then(() =>
                    cy.GetFeeSummary().then((finalSummary) => {
                        cy.get("@initialTotalFees").then((initialTotalFees) => {
                            expect(finalSummary.feeCount).to.eq(
                                initialTotalFees + 1
                            );
                        });
                    })
                );
        });

        it("should Total Fee in summary increase correctly after adding a new fee", () => {
            const testData = {
                date: new Date().toISOString().replace("Z", "+00:00"),
                text: randomString(10, "text").toUpperCase(),
                number: parseFloat(randomString(5, "number")),
            };

            const request = {
                fee_name: faker.food.dish(),
                fee_date: faker.date.recent(),
                fee: testData.number.toString(),
            };

            cy.GetFeeSummary()
                .then((summary) => {
                    cy.wrap(parseFloat(summary.totalFee)).as(
                        "initialTotalFees"
                    );
                })
                .then(() => cy.AddNewFee(request))
                .then(() =>
                    cy.GetFeeSummary().then((finalSummary) => {
                        cy.get("@initialTotalFees").then((initialTotalFees) => {
                            const expected = initialTotalFees + testData.number;
                            expect(parseFloat(finalSummary.totalFee)).to.eq(
                                expected
                            );
                        });
                    })
                );
        });
    });
});

describe("Update", () => {
    it("should successfully update fee", () => {
        const request = {
            fee_name: faker.food.dish(),
            fee_date: faker.date.recent(),
            fee: faker.string.numeric(5),
        };

        cy.task("getRandomFeeId")
            .then((id) => cy.UpdateFee(id, request))
            .then((response) => {
                expect(response.status).to.eq(200);

                const apiFee = response.body.fee;
                cy.wrap(apiFee).as("apiFee");
                cy.wrap(apiFee.id).as("feeId");
            })
            .then(() => {
                cy.get("@feeId").then((feeId) => {
                    return cy.task("getFeeFromDbTask", feeId);
                });
            })
            .then((dbFee) => {
                cy.get("@apiFee").then((apiFee) => {
                    expect(apiFee.fee_name).to.eq(dbFee.feeName);
                    expect(apiFee.fee_date).to.eq(dbFee.feeDate);
                    expect(apiFee.fee).to.eq(dbFee.fee);
                });
            });
    });

    it("should fail to update fee with missing required fields", () => {
        const request = {
            fee_name: "",
            fee_date: "",
            fee: "",
        };

        cy.task("getRandomFeeId").then((randomId) => {
            cy.UpdateFee(randomId, request).then((response) => {
                expect(response.status).to.eq(400);

                cy.wrap(response.body.fee).as("apiFee");

                const requiredErrors = [
                    "fee name is required",
                    "fee date is required",
                    "fee is required",
                ];

                requiredErrors.forEach((error) => {
                    expect(response.body.error).to.include(error);
                });
            });
        });
    });

    it("should fail to update fee with invalid JSON", () => {
        cy.task("getRandomFeeId").then((randomId) => {
            cy.UpdateFee(randomId).then((response) => {
                expect(response.status).to.eq(400);

                cy.wrap(response.body.fee).as("apiFee");

                expect(response.body.error).to.include(
                    "Invalid JSON in request body"
                );
            });
        });
    });

    it("should fail to update fee with invalid ID", () => {
        cy.UpdateFee("QWE123").then((response) => {
            expect(response.status).to.eq(400);

            cy.wrap(response.body.fee).as("apiFee");

            expect(response.body.error).to.include("Invalid fee ID provided");
        });
    });

    it("should fail to update fee with invalid number fields", () => {
        const request = {
            fee_name: faker.food.dish(),
            fee_date: faker.date.recent(),
            fee: faker.string.alphanumeric(5),
        };

        cy.task("getRandomFeeId").then((randomId) => {
            cy.UpdateFee(randomId, request).then((response) => {
                expect(response.status).to.eq(400);

                expect(response.body.error).to.include(
                    "fee must be a valid number"
                );
            });
        });
    });

    it("should ensure deleted_at is null after successfully updating a event", () => {
        const request = {
            fee_name: faker.food.dish(),
            fee_date: faker.date.recent(),
            fee: faker.string.numeric(5),
        };

        let apiFee;

        cy.task("getRandomFeeId")
            .then((id) => cy.UpdateFee(id, request))
            .then((response) => {
                expect(response.status).to.eq(200);
                apiFee = response.body.fee;
                return cy.task("getFeeFromDbTask", apiFee.id);
            })
            .then((dbFee) => {
                expect(apiFee.deleted_at).to.eq(dbFee.deletedAt);
                expect(apiFee.deleted_at).to.be.null;
            });
    });

    it("should fail to update fee with invalid ID", () => {
        const text = randomString(4, "text").toUpperCase();
        const invalidId = text;

        cy.UpdateFee(invalidId).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body).to.have.property(
                "error",
                "Invalid fee ID provided"
            );
        });
    });

    it("should fail to update fee with invalid JSON", () => {
        cy.task("getRandomFeeId").then((randomId) => {
            cy.UpdateFee(randomId).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.error).to.include(
                    "Invalid JSON in request body"
                );
            });
        });
    });
});

describe("Delete", () => {
    it("should successfully delete fee", () => {
        const request = {
            fee_name: faker.food.dish(),
            fee_date: faker.date.recent(),
            fee: faker.string.numeric(5),
        };

        cy.AddNewFee(request)
            .then((response) => {
                cy.wrap(response.body.fee.id).as("feeIdToDelete");
            })
            .then(() => {
                cy.get("@feeIdToDelete").then((id) => {
                    cy.DeleteFee(id).then((deleteResponse) => {
                        expect(deleteResponse.status).to.eq(200);
                        cy.task("getFeeFromDbTask", id).then((dbFee) => {
                            expect(dbFee).to.be.null;
                        });
                    });
                });
            });
    });

    it("should Total Transactions in summary decrease by 1 after deleting a fee", () => {
        let baselineTotalFees;
        
        const request = {
            fee_name: faker.food.dish(),
            fee_date: faker.date.recent(),
            fee: faker.string.numeric(5),
        };

        cy.GetFeeSummary()
            .then((summary) => {
                baselineTotalFees = summary.feeCount;
                return cy.AddNewFee(request);
            })
            .then((response) => {
                const feeId = response.body.fee.id;
                return cy.DeleteFee(feeId);
            })
            .then(() => cy.GetFeeSummary())
            .then((summary) => {
                expect(summary.feeCount).to.eq(baselineTotalFees);
            });
    });

    it("should fail with invalid ID", () => {
        cy.DeleteFee("abc").then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body.error).to.eq("Invalid fee ID provided");
        });
    });
});
