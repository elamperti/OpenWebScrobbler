describe('Navigation (authenticated user)', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/v2/user.php', { fixture: 'api/v2/user/authenticated.json' });
    cy.intercept('GET', '/api/v2/settings.php', { fixture: 'api/v2/settings/authenticated.json' });
    cy.visit('/');
  });

  it('has a link to scrobble songs', () => {
    cy.get('[data-cy="NavigationItem-song"]').should('exist');
  });

  it('has a link to scrobble albums', () => {
    cy.get('[data-cy="NavigationItem-album"]').should('exist');
  });

  it('has a link to scrobble from users', () => {
    cy.get('[data-cy="NavigationItem-otherUser"]').should('exist');
  });

  it('displays the logged in user along with its avatar', () => {
    cy.get('[data-cy="UserDropdown-username"]').should('contain', 'cypress');
    cy.get('[data-cy="UserDropdown"] .user-avatar').should('have.attr', 'src').and('contain', '.png');
  });

  describe('User dropdown menu', () => {
    beforeEach(() => {
      cy.get('[data-cy="UserDropdown"]').click();
    });

    it('links to the last.fm profile', () => {
      cy.get('[data-cy="UserDropdown-profileLink"]')
        .should('have.attr', 'href')
        .and('equal', 'https://www.last.fm/user/cypress');
    });

    it('opens the settings window', () => {
      cy.get('[data-cy="SettingsModal"]').should('not.exist');
      cy.get('[data-cy="UserDropdown-settings"]').click();
      cy.get('[data-cy="SettingsModal"]').should('exist');
    });

    it('triggers logout successfuly', () => {
      cy.intercept('GET', '/api/v2/user.php', { fixture: 'api/v2/user/visitor.json' });
      cy.intercept('GET', '/api/v2/settings.php', { fixture: 'api/v2/settings/visitor.json' });
      cy.intercept('POST', '/api/v2/logout.php', { fixture: 'api/v2/logout/success.json' }).as('logout');

      cy.get('[data-cy="UserDropdown-logout"]').click();

      cy.wait('@logout').then(() => {
        cy.get('[data-cy="UserDropdown-username"]').should('not.exist');
      });
    });
  });
});
