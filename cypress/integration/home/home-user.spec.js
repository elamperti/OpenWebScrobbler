describe('Home (authenticated user)', function() {
  beforeEach(function() {
    cy.fixture('api/v2/user/visitor.json').as('userIsVisitorJSON');
    cy.fixture('api/v2/user/authenticated.json').as('userLoggedInJSON');
    cy.fixture('api/v2/callback/success.json').as('callbackSuccessJSON');

    cy.server();
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('redirects to song scrobble after validating a token', function() {
    cy.route('POST', '/api/v2/user.php', '@userIsVisitorJSON').as('userData');
    cy.route('POST', '/api/v2/callback.php', '@callbackSuccessJSON').as('callback');

    cy.visit('/?token=aTestValue-withNumbers1234and_x1');
    cy.wait(['@callback', '@userData']);
    cy.location('pathname').should('equal', '/scrobble/song');
  });

  it('shows the user version of the home page', function() {
    cy.route('POST', '/api/v2/user.php', '@userLoggedInJSON').as('userData');

    cy.visit('/');
    cy.wait(['@userData']);
    cy.get('[data-cy="HomeUser"]');
  });
});
