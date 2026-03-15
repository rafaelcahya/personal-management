describe("Trade All Options API", () => {
    beforeEach(() => {
        cy.setupApiAuthCookies();
    });

    it("should return 200 with correct structure matching real response", () => {
        cy.GetOption("all").then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.success).to.be.true;
            const options = response.body.options;
            expect(options).to.be.an("object");
            expect(options).to.have.all.keys([
                "stockType",
                "entrySession",
                "entryOccasion",
                "buyReason",
                "sellReason",
            ]);
        });
    });

    it("should return expected stock types", () => {
        cy.GetOption("all").then((response) => {
            const stockTypes = response.body.options.stockType;
            expect(stockTypes).to.be.an("array").length.gte(5);

            expect(
                stockTypes.map((t) => t.stock_type_option),
            ).to.deep.include.members([
                "E-IPO",
                "FCA",
                "Normal",
                "Suspended",
                "UMA",
            ]);
        });
    });

    it("should return expected entry sessions", () => {
        cy.GetOption("all").then((response) => {
            const sessions = response.body.options.entrySession;
            expect(sessions).to.have.length(3);

            expect(
                sessions.map((s) => s.entry_session_option),
            ).to.deep.include.members([
                "After-hours",
                "Mid-session",
                "Pre-market",
            ]);
        });
    });

    it("should return expected entry occasions", () => {
        cy.GetOption("all").then((response) => {
            const occasions = response.body.options.entryOccasion;
            expect(occasions).to.have.length.gte(5);

            expect(
                occasions.map((o) => o.entry_occasion_option),
            ).to.deep.include.members([
                "Post-Holiday",
                "Post-Weekend",
                "Pre-Holiday",
                "Pre-Weekend",
                "Weekday",
            ]);
        });
    });

    it("should return options for single user", () => {
        cy.GetOption("all").then((response) => {
            const allOptions = Object.values(response.body.options).flat();
            const userIds = new Set(allOptions.map((o) => o.user_id));
            expect(userIds.size).to.eq(1);
        });
    });

    it("should respond efficiently", () => {
        const start = Date.now();
        cy.GetOption("all").then(() => {
            const duration = Date.now() - start;
            expect(duration).to.be.lte(3000);
            cy.log(`Response time: ${duration}ms`);
        });
    });

    it("should work without authentication", () => {
        cy.clearApiAuth();
        cy.GetOption("all").then((response) => {
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
