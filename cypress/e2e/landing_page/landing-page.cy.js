describe("Landing Page - User Experience", () => {
    beforeEach(() => {
        cy.loginWithBypass();
        cy.visit("/main/landing");
    });

    it("should display user greeting with correct name", () => {
        cy.getSession().then((session) => {
            const fullName = session.user.user_metadata?.full_name;
            const email = session.user.email;

            const expectedName = fullName
                ? fullName.split(" ")[0]
                : email.split("@")[0];

            cy.get("#fullNameAuth_landingPage")
                .should("be.visible")
                .invoke("text")
                .should("eq", expectedName);
        });
    });

    it("should logout and clear session", () => {
        cy.disableBypass();
        cy.get("button").contains("Logout").should("be.visible").click();

        cy.getCookie("cypress-bypass").should("not.exist");
        cy.url().should("include", "/login");
        cy.get("#loginPage").should("be.visible");
    });

    it("should display trade management card", () => {
        cy.get("#tradeManagementCard_landingPage").should("be.visible");
    });

    it("should display inventory management card", () => {
        cy.get("#inventoryManagementCard_landingPage").should("be.visible");
    });
});

describe("Landing Page - Navigation", () => {
    beforeEach(() => {
        cy.loginWithBypass();
        cy.visit("/main/landing");
    });

    it("should navigate to Trading Dashboard when clicking Trade button", () => {
        cy.get("#tradeBtn_landingPage").should("be.visible").click();

        cy.location("pathname").should("eq", "/main/trading/dashboard");
        cy.url().should("include", "/main/trading/dashboard");
    });

    it("should navigate to Inventory List when clicking Inventory button", () => {
        cy.get("#inventoryBtn_landingPage").should("be.visible").click();

        cy.location("pathname").should("eq", "/main/inventory/product-list");
        cy.url().should("include", "/main/inventory/product-list");
    });
});

describe("Landing Page - Responsive Layout", () => {
    beforeEach(() => {
        cy.loginWithBypass();
    });

    it("should display correctly on mobile viewport", () => {
        cy.viewport("iphone-x");
        cy.visit("/main/landing");

        cy.get("#fullNameAuth_landingPage").should("be.visible");
        cy.get("#logoutBtn").should("be.visible");
        cy.get("#tradeManagementCard_landingPage").should("be.visible");
        cy.get("#inventoryManagementCard_landingPage").should("be.visible");
    });

    it("should display correctly on tablet viewport", () => {
        cy.viewport("ipad-2");
        cy.visit("/main/landing");

        cy.get("#fullNameAuth_landingPage").should("be.visible");
        cy.get("#logoutBtn").should("be.visible");
        cy.get("#tradeManagementCard_landingPage").should("be.visible");
        cy.get("#inventoryManagementCard_landingPage").should("be.visible");
    });

    it("should display correctly on desktop viewport", () => {
        cy.viewport(1920, 1080);
        cy.visit("/main/landing");

        cy.get("#fullNameAuth_landingPage").should("be.visible");
        cy.get("#logoutBtn").should("be.visible");
        cy.get("#tradeManagementCard_landingPage").should("be.visible");
        cy.get("#inventoryManagementCard_landingPage").should("be.visible");
    });
});

describe("Landing Page - Mobile Interactions", () => {
    beforeEach(() => {
        cy.viewport("iphone-x");
        cy.loginWithBypass();
        cy.visit("/main/landing");
    });

    it("should display user greeting with correct name on mobile viewport", () => {
        cy.getSession().then((session) => {
            const fullName = session.user.user_metadata?.full_name;
            const email = session.user.email;

            const expectedName = fullName
                ? fullName.split(" ")[0]
                : email.split("@")[0];

            cy.get("#fullNameAuth_landingPage")
                .should("be.visible")
                .invoke("text")
                .should("eq", expectedName);
        });
    });

    it("should logout and clear session on mobile viewport", () => {
        cy.disableBypass();
        cy.get("button").contains("Logout").should("be.visible").click();

        cy.getCookie("cypress-bypass").should("not.exist");
        cy.url().should("include", "/login");
        cy.get("#loginPage").should("be.visible");
    });

    it("should navigate to Trading Dashboard when clicking Trade button on mobile viewport", () => {
        cy.get("#tradeBtn_landingPage").should("be.visible").click();

        cy.location("pathname").should("eq", "/main/trading/dashboard");
        cy.url().should("include", "/main/trading/dashboard");
    });

    it("should navigate to Inventory List when clicking Inventory button on mobile viewport", () => {
        cy.get("#inventoryBtn_landingPage").should("be.visible").click();

        cy.location("pathname").should("eq", "/main/inventory/product-list");
        cy.url().should("include", "/main/inventory/product-list");
    });
});

describe("Landing Page - Tablet Interactions", () => {
    beforeEach(() => {
        cy.viewport("ipad-2");
        cy.loginWithBypass();
        cy.visit("/main/landing");
    });

    it("should display user greeting with correct name on tablet viewport", () => {
        cy.getSession().then((session) => {
            const fullName = session.user.user_metadata?.full_name;
            const email = session.user.email;

            const expectedName = fullName
                ? fullName.split(" ")[0]
                : email.split("@")[0];

            cy.get("#fullNameAuth_landingPage")
                .should("be.visible")
                .invoke("text")
                .should("eq", expectedName);
        });
    });

    it("should logout and clear session on tablet viewport", () => {
        cy.disableBypass();
        cy.get("button").contains("Logout").should("be.visible").click();

        cy.getCookie("cypress-bypass").should("not.exist");
        cy.url().should("include", "/login");
        cy.get("#loginPage").should("be.visible");
    });

    it("should navigate to Trading Dashboard when clicking Trade button on tablet viewport", () => {
        cy.get("#tradeBtn_landingPage").should("be.visible").click();

        cy.location("pathname").should("eq", "/main/trading/dashboard");
        cy.url().should("include", "/main/trading/dashboard");
    });

    it("should navigate to Inventory List when clicking Inventory button on tablet viewport", () => {
        cy.get("#inventoryBtn_landingPage").should("be.visible").click();

        cy.location("pathname").should("eq", "/main/inventory/product-list");
        cy.url().should("include", "/main/inventory/product-list");
    });
});

describe("Landing Page - Desktop Interactions", () => {
    beforeEach(() => {
        cy.viewport(1920, 1080);
        cy.loginWithBypass();
        cy.visit("/main/landing");
    });

    it("should display user greeting with correct name on desktop viewport", () => {
        cy.getSession().then((session) => {
            const fullName = session.user.user_metadata?.full_name;
            const email = session.user.email;

            const expectedName = fullName
                ? fullName.split(" ")[0]
                : email.split("@")[0];

            cy.get("#fullNameAuth_landingPage")
                .should("be.visible")
                .invoke("text")
                .should("eq", expectedName);
        });
    });

    it("should logout and clear session on desktop viewport", () => {
        cy.disableBypass();
        cy.get("button").contains("Logout").should("be.visible").click();

        cy.getCookie("cypress-bypass").should("not.exist");
        cy.url().should("include", "/login");
        cy.get("#loginPage").should("be.visible");
    });

    it("should navigate to Trading Dashboard when clicking Trade button on desktop viewport", () => {
        cy.get("#tradeBtn_landingPage").should("be.visible").click();

        cy.location("pathname").should("eq", "/main/trading/dashboard");
        cy.url().should("include", "/main/trading/dashboard");
    });

    it("should navigate to Inventory List when clicking Inventory button on desktop viewport", () => {
        cy.get("#inventoryBtn_landingPage").should("be.visible").click();

        cy.location("pathname").should("eq", "/main/inventory/product-list");
        cy.url().should("include", "/main/inventory/product-list");
    });
});
