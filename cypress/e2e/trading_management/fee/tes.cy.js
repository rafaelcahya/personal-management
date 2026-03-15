import { faker } from "@faker-js/faker";
describe("test", () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.setupApiAuthCookies();
    });
    it(
        "should match totalFeesPaid with database count",
        { tags: "@test" },
        function () {
            const request = {
                fee_date: faker.date.recent().toISOString().split("T")[0],
                fee: faker.string.numeric(5),
                fee_name: faker.animal.snake(),
            };

            cy.AddFee(request).then((response) => {
                expect(response.status).to.eq(201);
            });

            cy.GetFeeSummary().then((response) => {
                expect(response.status).to.eq(200);
                cy.wrap(response.body.data.totalFee).as("apiTotal");
            });

            cy.getTotalFeesPaidFromDb().then((total) => {
                cy.wrap(total).as("dbTotal");
            });

            cy.then(function () {
                expect(this.apiTotal).to.eq(this.dbTotal);
            });
        },
    );
});
