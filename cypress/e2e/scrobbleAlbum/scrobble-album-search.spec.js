describe('Scrobble album (SRP)', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();

    cy.intercept('GET', '/api/v2/user.php', { fixture: 'api/v2/user/authenticated.json' }).as('userData');
    cy.intercept('GET', '/api/v2/settings.php', { fixture: 'api/v2/settings/authenticated.json' }).as('settings');

    cy.intercept('GET', 'https://ws.audioscrobbler.com/2.0/*method=artist.search*', {
      fixture: 'lastfm/artist/search.meteora.json',
    }).as('artistSearch');
    cy.intercept('GET', 'https://ws.audioscrobbler.com/2.0/*method=album.search*', {
      fixture: 'lastfm/album/search.meteora.json',
    }).as('albumSearch');

    cy.visit('/scrobble/album');
    cy.wait('@userData');
    cy.wait('@settings');
  });

  it('shows a proper search form', () => {
    cy.get('[data-cy="SearchForm-input"]').should('exist');
    cy.get('[data-cy="SearchForm-submit"]').should('exist');
    cy.get('[data-cy="SearchForm-submit"]').should('be.disabled');
  });

  it('allows autocomplete', () => {
    cy.get('[data-cy="SearchForm-input"]').should('have.attr', 'autocomplete', 'on');
  });

  it('lists possible data sources in the button', () => {
    cy.get('[data-cy="SearchForm-dropdown"]').should('exist');
    cy.get('[data-cy="SearchForm-input"]').type('Hybrid Theory', { delay: 0 });
    cy.get('[data-cy="SearchForm-submit"]').should('be.enabled');

    cy.get('[data-cy="SearchForm-dropdown-toggle"]').click();

    // Count the number of items in the dropdown menu
    cy.get('[data-cy="SearchForm-dropdown-menu"]').children().should('have.length', 2);
  });

  it.skip('focuses the search bar on load', () => {
    cy.focused().should('have.attr', 'data-cy', 'SearchForm-input');
  });

  describe('using Discogs', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/v2/discogs.php?method=artist.search*', {
        fixture: 'api/v2/discogs/artist.search.meteora.json',
      });
      cy.intercept('GET', '/api/v2/discogs.php?method=album.search*', {
        fixture: 'api/v2/discogs/album.search.meteora.json',
      });
    });

    it('shows a switch to expand Discogs results', () => {
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.get('[data-cy="SearchForm-input"]').rawInput('Meteora');
      cy.get('[data-cy="SearchForm-submit"]').should('be.enabled');

      cy.get('[data-cy="SearchForm-dropdown-toggle"]').click();
      cy.get('[data-cy="SearchForm-dropdown-menu"] .dropdown-item').contains('Discogs').click();
      cy.get('[data-cy="ScrobbleAlbumSearch-include-releases"]').should('exist');
    });

    it('navigates to the SRP when submitting the form', () => {
      cy.get('[data-cy="SearchForm-input"]').rawInput('Meteora');
      cy.get('[data-cy="SearchForm-submit"]').should('be.enabled');

      cy.get('[data-cy="SearchForm-dropdown-toggle"]').click();
      cy.get('[data-cy="SearchForm-dropdown-menu"] .dropdown-item').contains('Discogs').click();

      cy.get('[data-cy="SearchForm-submit"]').click();
      cy.location('pathname').should('equal', '/scrobble/album/search/Meteora');
    });
  });

  describe('using Last.fm', () => {
    it('hides Discogs switch when Lastfm is selected', () => {
      cy.get('[data-cy="SearchForm-input"]').rawInput('Meteora');
      cy.get('[data-cy="SearchForm-submit"]').should('be.enabled');

      cy.get('[data-cy="SearchForm-dropdown-toggle"]').click();
      cy.get('[data-cy="SearchForm-dropdown-menu"] .dropdown-item').contains('Last.fm').click();
      cy.get('[data-cy="ScrobbleAlbumSearch-include-releases"]').should('not.exist');
    });

    it('navigates to the SRP when submitting the form', () => {
      cy.get('[data-cy="SearchForm-input"]').rawInput('Meteora');
      cy.get('[data-cy="SearchForm-submit"]').should('be.enabled');

      cy.get('[data-cy="SearchForm-dropdown-toggle"]').click();
      cy.get('[data-cy="SearchForm-dropdown-menu"] .dropdown-item').contains('Last.fm').click();

      cy.get('[data-cy="SearchForm-submit"]').click();
      cy.location('pathname').should('equal', '/scrobble/album/search/Meteora');
    });
  });
});
