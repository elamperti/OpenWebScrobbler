describe('Navigation (visitor)', () => {
  beforeEach(() => {
    cy.fixture('api/v2/user/visitor.json').as('userIsVisitorJSON');

    cy.server();
    cy.route('POST', '/api/v2/user.php', '@userIsVisitorJSON').as('userData');

    cy.visit('/');
    cy.wait('@userData');
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
