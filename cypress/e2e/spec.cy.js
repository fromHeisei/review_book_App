describe("template spec", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000/signin");
    cy.get('[type="email"]')
      .type("aiueomochi@gmail.com")
      .should("have.value", "aiueomochi@gmail.com");
  });
});
