describe('Navigation (authenticated user)', () => {
  beforeEach(() => {
    cy.fixture('api/v2/user/authenticated.json').as('userLoggedInJSON');

    cy.server();
    cy.route('POST', '/api/v2/user.php', '@userLoggedInJSON').as('userData');

    cy.visit('/');
    cy.wait('@userData');
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
    cy.get('[data-cy="UserDropdown"] .user-avatar')
      .should('have.attr', 'src')
      .and('contain', '.png');
  });

  describe('User dropdown menu', () => {
    beforeEach(() => {
      cy.get('[data-cy="UserDropdown"]').click();
    });

    it('should link to the last.fm profile', () => {
      cy.get('[data-cy="UserDropdown-profileLink"]')
        .should('have.attr', 'href')
        .and('equal', 'https://www.last.fm/user/cypress');
    });

    it.skip('opens the settings window');
    it.skip('triggers logout successfuly');
  });
});
