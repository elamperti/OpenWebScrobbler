describe('Scrobble user (search)', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();

    cy.intercept('GET', 'https://ws.audioscrobbler.com/2.0/*method=user.getRecentTracks*', {
      fixture: 'lastfm/user/getRecentTracks.chairmandore.json',
    }).as('recentTracks');
    cy.intercept('GET', '/api/v2/user.php', { fixture: 'api/v2/user/authenticated.json' }).as('userData');
    cy.intercept('GET', '/api/v2/settings.php', { fixture: 'api/v2/settings/authenticated.json' }).as('settings');

    cy.visit('/scrobble/user');
    cy.wait('@userData');
    cy.wait('@settings');
  });

  it('shows a proper search form', () => {
    cy.get('[data-cy="SearchForm-input"]').should('exist');
    cy.get('[data-cy="SearchForm-submit"]').should('exist');
    cy.get('[data-cy="SearchForm-submit"]').should('be.disabled');
  });

  it("doesn't allow searching for invalid users", () => {
    cy.get('[data-cy="SearchForm-input"]').type('1111');
    cy.get('[data-cy="SearchForm-submit"]').should('be.disabled');

    cy.get('[data-cy="SearchForm-input"]').clear();
    cy.get('[data-cy="SearchForm-input"]').type('_abc');
    cy.get('[data-cy="SearchForm-submit"]').should('be.disabled');
  });

  it('enables the search button after a username is entered', () => {
    cy.get('[data-cy="SearchForm-submit"]').should('be.disabled');
    cy.get('[data-cy="SearchForm-input"]').type('chairmandore');
    cy.get('[data-cy="SearchForm-submit"]').should('be.enabled');
  });

  it('navigates to a user SRP when the search button is clicked', () => {
    cy.get('[data-cy="SearchForm-input"]').type('chairmandore');
    cy.get('[data-cy="SearchForm-submit"]').click();

    cy.location('pathname').should('equal', '/scrobble/user/chairmandore');
  });

  it('navigates to a user SRP when enter key is pressed', () => {
    cy.get('[data-cy="SearchForm-input"]').type('chairmandore{enter}');

    cy.location('pathname').should('equal', '/scrobble/user/chairmandore');
  });

  it("doesn't show an empty list of recent users", () => {
    // shouldn't find the recent users list
    cy.get('[data-cy="RecentUsers-list"]').should('not.exist');
  });

  it('remembers a recently searched user', () => {
    cy.get('[data-cy="SearchForm-input"]').type('chairmandore');
    cy.get('[data-cy="SearchForm-submit"]').click();
    cy.wait('@recentTracks').then(() => {
      cy.go('back');
      cy.location('pathname').should('equal', '/scrobble/user');
    });

    cy.get('[data-cy="RecentUsers-list"]').should('exist');
    cy.get('[data-cy="RecentUsers-list"] > li:nth-child(1)').should('have.text', 'chairmandore');
  });

  it('returns back to search when the user is not found (search form)', () => {
    cy.intercept(
      {
        method: 'GET',
        url: 'https://ws.audioscrobbler.com/2.0/*method=user.getRecentTracks*',
        middleware: true,
      },
      (req) => {
        req.reply({ fixture: 'lastfm/user/getRecentTracks.invalid.json', statusCode: 404 });
      }
    ).as('invalidRecentTracks');

    cy.get('[data-cy="SearchForm-input"]').type('invalidUser');
    cy.get('[data-cy="SearchForm-submit"]').click();

    cy.wait('@invalidRecentTracks');

    cy.location('pathname').should('equal', '/scrobble/user');
    cy.get('[data-cy="SearchForm-input"]').should('have.value', 'invalidUser').and('have.attr', 'aria-invalid', 'true');
    cy.get('[data-cy="SongForm-invalid-feedback"]').should('have.text', 'User not found');
  });

  it('returns back to search when the user is not found (user view)', () => {
    cy.visit('/scrobble/user/chairmandore');
    cy.wait('@recentTracks');

    cy.intercept(
      {
        method: 'GET',
        url: 'https://ws.audioscrobbler.com/2.0/*method=user.getRecentTracks*',
        middleware: true,
      },
      (req) => {
        req.reply({ fixture: 'lastfm/user/getRecentTracks.invalid.json', statusCode: 404 });
      }
    ).as('invalidRecentTracks');

    cy.get('[data-cy="SearchForm-input"]').type('invalidUser{enter}');

    cy.wait('@invalidRecentTracks');

    cy.location('pathname').should('equal', '/scrobble/user');
    cy.get('[data-cy="SearchForm-input"]').should('have.value', 'invalidUser').and('have.attr', 'aria-invalid', 'true');
    cy.get('[data-cy="SongForm-invalid-feedback"]').should('have.text', 'User not found');
  });
});
