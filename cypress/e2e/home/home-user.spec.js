describe('Home (authenticated user)', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('redirects to song scrobble after validating a token', () => {
    cy.intercept('GET', '/api/v2/user.php', { fixture: 'api/v2/user/visitor.json' }).as('userData');
    cy.intercept('POST', '/api/v2/callback.php', { fixture: 'api/v2/callback/success.json' }).as('callback');

    cy.visit('/?token=aTestValue-withNumbers1234and_x1');
    cy.wait(['@callback', '@userData']).then(() => {
      cy.location('pathname').should('equal', '/scrobble/song');
    });
  });

  it('shows the user version of the home page', () => {
    cy.intercept('GET', '/api/v2/user.php', { fixture: 'api/v2/user/authenticated.json' }).as('userData');

    cy.visit('/');
    cy.wait(['@userData']).then(() => {
      cy.get('[data-cy="HomeUser"]');
    });
  });
});
