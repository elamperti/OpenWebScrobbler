describe("Home", function() {
  beforeEach(function() {
    cy.visit("/")
  })

  it("renders the name in the navbar", function() {
    cy.get(".navbar-brand").should("contain", "Open Scrobbler")
  })
})
