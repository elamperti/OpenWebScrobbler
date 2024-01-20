describe('Navigation (visitor)', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/v2/user.php', { fixture: 'api/v2/user/visitor.json' });
    cy.intercept('GET', '/api/v2/settings.php', { fixture: 'api/v2/settings/visitor.json', statusCode: 401 });

    cy.visit('/');
  });

  it('Shows the logo', () => {
    cy.get('[data-cy="Navigation-logo"]').should('exist');
  });

  it('links to login page', () => {
    cy.get('[data-cy="NavigationItem-logIn"] a')
      .should('have.attr', 'href')
      .and('match', /^https:\/\/www.last.fm\/api\//);
  });
});
