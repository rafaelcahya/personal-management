import { faker } from "@faker-js/faker";

describe("Event List API", () => {
    let testUserId;
    let testEventIds = [];
    let testEventsData = [];

    const request = () => ({
        event_date: faker.date.recent(),
        impact_direction: faker.animal.snake(),
        event_description: faker.word.words(25),
    });

    before(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.setupApiAuthCookies();

        Cypress._.times(3, () => {
            cy.AddEvent(request()).then((response) => {
                expect(response.body.success).to.be.true;
                expect(response.body.event).to.exist;
                expect(response.status).to.eq(201);
                const event = response.body.event;
                testUserId = event.user_id;
                testEventIds.push(event.id);
                testEventsData.push(event);
            });
        });
    });

    beforeEach(() => {
        cy.setupApiAuthCookies();
    });

    it("should return 200 with event list for authenticated user", () => {
        cy.GetListEvent().then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.success).to.be.true;
            expect(response.body.events).to.be.an("array");
            expect(response.body.events.length).to.be.gte(testEventIds.length);
            testEventIds.forEach((id) => {
                expect(response.body.events.some((t) => t.id === id)).to.be.true;
            });
        });
    });

    it("should return only authenticated user's event", () => {
        cy.GetListEvent().then((response) => {
            response.body.events.forEach((event) => {
                expect(event.user_id).to.eq(testUserId);
            });
        });
    });

    it("should sort event by event_date DESC", () => {
        cy.GetListEvent().then((response) => {
            const events = response.body.events;
            for (let i = 0; i < events.length - 1; i++) {
                const date1 = new Date(events[i].event_date);
                const date2 = new Date(events[i + 1].event_date);
                expect(date1.getTime()).to.gte(date2.getTime());
            }
        });
    });

    it("should return 401 Unauthorized without auth", () => {
        cy.clearCookies();
        cy.GetListEventNoAuth().then((response) => {
            expect(response.status).to.be.oneOf([401, 307]);
            if (response.status === 401) {
                expect(response.body.success).to.be.false;
                expect(response.body.error).to.eq("Unauthorized");
            }
        });
    });

    it("should return correct response structure", () => {
        cy.GetListEvent().then((response) => {
            expect(response.body).to.have.all.keys("success", "events");
            expect(response.body.success).to.be.a("boolean");
            expect(response.body.events).to.be.an("array");

            if (response.body.events.length > 0) {
                const event = response.body.events[0];
                expect(event).to.have.all.keys([
                    "created_at",
                    "deleted_at",
                    "id",
                    "event_description",
                    "event_date",
                    "impact_direction",
                    "updated_at",
                    "user_id",
                    "uuid",
                ]);
            }
        });
    });

    it("should respond within 1000ms", () => {
        const start = Date.now();
        cy.GetListEvent().then(() => {
            const duration = Date.now() - start;
            expect(duration).to.be.lte(1000);
            cy.log(`Response time: ${duration}ms`);
        });
    });
});
