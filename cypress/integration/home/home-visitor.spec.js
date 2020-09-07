describe('Home (visitor)', () => {
  beforeEach(() => {
    cy.fixture('api/v2/user/visitor.json').as('userIsVisitorJSON');
    cy.fixture('api/v2/callback/failure.json').as('callbackFailureJSON');

    cy.server();
    cy.route('POST', '/api/v2/user.php', '@userIsVisitorJSON');

    cy.visit('/');
  });

  it('shows the visitor version of the home page', () => {
    cy.get('[data-cy="HomeVisitor"]');
  });

  it('is using translations', () => {
    cy.get('[data-cy="HomeVisitor-about"] p').should('not.contain', 'about.description');
  });

  it('shows an error if token was invalid', () => {
    cy.route('POST', '/api/v2/callback.php', '@callbackFailureJSON');

    cy.visit('/?token=aTestValue-withNumbers1234and_x1');
    cy.get('.alert-danger').should('exist');
  });
});
