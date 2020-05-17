describe('Navigation (donor)', function() {
  beforeEach(function() {
    cy.fixture('api/v2/user/donor.json').as('donorLoggedInJSON');

    cy.server();
    cy.route('POST', '/api/v2/user.php', '@donorLoggedInJSON').as('userData');

    cy.visit('/');
    cy.wait('@userData');
  });

  it('applies the donor class to the navbar', function() {
    cy.get('[data-cy="Navigation"]').should('have.class', 'ows-donor');
  });
});
