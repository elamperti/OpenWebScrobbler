describe('Scrobble album (SRP)', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();

    cy.intercept('GET', '/api/v2/user.php', { fixture: 'api/v2/user/authenticated.json' }).as('userData');
    cy.intercept('GET', '/api/v2/settings.php', { fixture: 'api/v2/settings/authenticated.json' });
  });

  describe('using Discogs', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/v2/discogs.php?method=artist.search&type=artist*', {
        fixture: 'api/v2/discogs/artist.search.meteora.json',
      }).as('artistSearch');
      cy.intercept('GET', '/api/v2/discogs.php?method=album.search&type=master*', {
        fixture: 'api/v2/discogs/album.search.meteora.json',
      }).as('albumSearch');

      cy.visit('/scrobble/album/search/Meteora?source=discogs');
      cy.wait('@userData');
    });

    it('lists all albums', () => {
      cy.get('[data-cy="AlbumCard"]').should('have.length', 49);
    });

    it('lists all artists', () => {
      cy.get('[data-cy="ArtistCard"]').should('have.length', 14);
    });

    it('links albums to their corresponding Discogs URL', () => {
      cy.get('[data-cy="AlbumCard"]')
        .first()
        .parent()
        .should('have.attr', 'href')
        .and('match', /https:\/\/www.discogs.com\/master\/.*/);
    });

    it('links artists to their corresponding Discogs URL', () => {
      cy.get('[data-cy="ArtistCard"]')
        .first() // First artist card
        .children()
        .first() // Only child (the link)
        .should('have.attr', 'href')
        .and('match', /https:\/\/www.discogs.com\/artist\/\d+-.*/);
    });

    it('displays the correct data source in the breadcrumb', () => {
      cy.get('[data-cy="AlbumBreadcrumb-provider"]').should('contain', 'Discogs');
    });
  });

  describe('using Last.fm', () => {
    beforeEach(() => {
      cy.intercept('GET', 'https://ws.audioscrobbler.com/2.0/*method=artist.search*', {
        fixture: 'lastfm/artist/search.meteora.json',
      }).as('artistSearch');
      cy.intercept('GET', 'https://ws.audioscrobbler.com/2.0/*method=album.search*', {
        fixture: 'lastfm/album/search.meteora.json',
      }).as('albumSearch');

      cy.visit('/scrobble/album/search/Meteora?source=lastfm');
      cy.wait('@userData');
    });

    it('lists all albums', () => {
      cy.get('[data-cy="AlbumCard"]').should('have.length', 50);
    });

    it('lists all artists', () => {
      cy.get('[data-cy="ArtistCard"]').should('have.length', 12);
    });

    it('links albums to their corresponding last.fm URL', () => {
      cy.get('[data-cy="AlbumCard"]')
        .first()
        .parent()
        .should('have.attr', 'href')
        .and('match', /https:\/\/www.last.fm\/music\/.*\/.*/);
    });

    it('links artists to their corresponding last.fm URL', () => {
      cy.get('[data-cy="ArtistCard"]')
        .first() // First artist card
        .children()
        .first() // Only child (the link)
        .should('have.attr', 'href')
        .and('match', /https:\/\/www.last.fm\/music\/.*/);
    });

    it('displays the correct data source in the breadcrumb', () => {
      cy.get('[data-cy="AlbumBreadcrumb-provider"]').should('contain', 'Last.fm');
    });
  });
});
