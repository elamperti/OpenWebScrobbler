describe('Home (visitor)', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/v2/user.php', { fixture: 'api/v2/user/visitor.json' });
    cy.visit('/');
  });

  it('shows the visitor version of the home page', () => {
    cy.get('[data-cy="HomeVisitor"]');
  });
});
