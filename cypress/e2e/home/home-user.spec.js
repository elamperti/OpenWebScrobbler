describe('Home (authenticated user)', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('shows the user version of the home page', () => {
    cy.intercept('GET', '/api/v2/user.php', { fixture: 'api/v2/user/authenticated.json' }).as('userData');
    cy.intercept('GET', '/api/v2/settings.php', { fixture: 'api/v2/settings/authenticated.json' });

    cy.visit('/');
    cy.wait(['@userData']).then(() => {
      cy.get('[data-cy="HomeUser"]');
    });
  });
});
