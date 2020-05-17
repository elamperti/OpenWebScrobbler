describe('Navigation (visitor)', function() {
  beforeEach(function() {
    cy.fixture('api/v2/user/visitor.json').as('userIsVisitorJSON');

    cy.server();
    cy.route('POST', '/api/v2/user.php', '@userIsVisitorJSON').as('userData');

    cy.visit('/');
    cy.wait('@userData');
  });

  it('Shows the logo', function() {
    cy.get('[data-cy="Navigation-logo"]').should('exist');
  });
});
