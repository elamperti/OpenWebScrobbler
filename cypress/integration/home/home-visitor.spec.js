describe("Home", function() {
  beforeEach(function() {
    cy.visit("/")
  })

  it("shows the visitor version of the home page", function() {
    cy.get('[data-cy="HomeVisitor"]')
  })

  it("is using translations", function() {
    cy.get('[data-cy="HomeVisitor-about"] p').should("not.contain", "about.description")
  })
})
