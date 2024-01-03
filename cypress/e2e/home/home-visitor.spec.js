describe('Home (visitor)', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/v2/user.php', { fixture: 'api/v2/user/visitor.json' });
    cy.visit('/');
  });

  it('shows the visitor version of the home page', () => {
    cy.get('[data-cy="HomeVisitor"]');
  });

  it('shows an error if token was invalid', () => {
    cy.intercept('POST', '/api/v2/callback.php', { statusCode: 503, fixture: 'api/v2/callback/failure.json' });

    cy.visit('/?token=aTestValue-withNumbers1234and_x1');
    cy.get('.alert-danger').should('exist');
  });
});
