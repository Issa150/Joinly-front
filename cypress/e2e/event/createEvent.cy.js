describe("Event Creation", () => {
  it("should allow creating an event with valid data", () => {
    cy.visit("http://localhost:5173/signin");

    cy.get('input#email').type("john.doe@example.com");
    cy.get('input#password').type("StrongPassword123");
    cy.get('button[type="submit"]').click();

    cy.url().should("not.include", "/signin");

    cy.get('div[aria-haspopup="menu"]').click();
    cy.contains("Créer un événement").click(); 

    cy.get('input#name', { timeout: 10000 }).should("be.visible");

    cy.get('input#name').type("Test Event");
    cy.get('textarea#description').type("This is a test description for the event.");
    cy.get('#categoryId').click();
    cy.contains("Concert").click();

    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1);
    const formattedStartDate = startDate.toISOString().slice(0, 16);
    cy.get('input#startDate').type(formattedStartDate);

    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 2);
    const formattedEndDate = endDate.toISOString().slice(0, 16);
    cy.get('input#endDate').type(formattedEndDate);

    cy.get('input#address').type("123 Test Street");
    cy.get('input#postalCode').type("75001");
    cy.get('input#city').type("Paris");
    cy.get('input#budget').type("500");
    cy.get('input#numberPlace').type("50");

    const imagePath = "images/test-image.jpg";
    cy.get('input#image').attachFile(imagePath);

    cy.get('label[for="isPublished"]').first().click();

    cy.get('[data-cy=event-button]').first().click();
  });
});