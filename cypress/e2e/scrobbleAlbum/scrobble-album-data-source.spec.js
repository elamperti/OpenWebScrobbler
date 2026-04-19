describe('Scrobble album data source (SRP)', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();

    cy.intercept('GET', '/api/v2/user.php', { fixture: 'api/v2/user/authenticated.json' }).as('userData');
    cy.intercept('GET', '/api/v2/settings.php', { fixture: 'api/v2/settings/authenticated.json' });

    // set up both searches to test switching

    cy.intercept('GET', '/api/v2/discogs.php?method=artist.search&type=artist*', {
      fixture: 'api/v2/discogs/artist.search.meteora.json',
    }).as('artistSearchDiscogs');
    cy.intercept('GET', '/api/v2/discogs.php?method=album.search&type=master*', {
      fixture: 'api/v2/discogs/album.search.meteora.json',
    }).as('albumSearchDiscogs');

    cy.intercept('GET', 'https://ws.audioscrobbler.com/2.0/*method=artist.search*', {
      fixture: 'lastfm/artist/search.meteora.json',
    }).as('artistSearchLastFm');
    cy.intercept('GET', 'https://ws.audioscrobbler.com/2.0/*method=album.search*', {
      fixture: 'lastfm/album/search.meteora.json',
    }).as('albumSearchLastFm');
  });

  describe('using Discogs', () => {
    beforeEach(() => {
      cy.visit('/scrobble/album/search/Meteora?source=discogs');
      cy.wait('@userData');
    });

    it('displays dropdown for data sources', () => {
      cy.get('[data-cy="DataSourceDropdown-toggle"]').should('exist');
      cy.get('[data-cy="DataSourceDropdown-toggle"]').click();
      cy.get('[data-cy="DataSourceDropdown-menu"]').children().should('have.length', 2);
      // check active item matches data source
      cy.get('[data-cy="DataSourceDropdown-menu"]')
        .children('button.active')
        .should('have.text', 'Discogs');
    });

    it('switches data source to Last.fm', () => {
      // check initial Discogs results
      cy.get('[data-cy="AlbumCard"]')
        .first()
        .parent()
        .should('have.attr', 'href')
        .and('match', /https:\/\/www.discogs.com\/master\/.*/);

      cy.get('[data-cy="DataSourceDropdown-toggle"]').click();
      cy.get('[data-cy="DataSourceDropdown-menu"]')
        .find('[data-cy="DataSourceDropdown-item-lastfm"]')
        .click();

      // check Last.fm results
      cy.get('[data-cy="AlbumCard"]')
        .first()
        .parent()
        .should('have.attr', 'href')
        .and('match', /https:\/\/www.last.fm\/music\/.*\/.*/);
    });

    it('displays static data source on album view', () => {
      cy.get('[data-cy="AlbumCard"]')
        .first()
        .click();

      cy.location('pathname').should('match', /scrobble\/album\/view/);

      cy.get('[data-cy="DataSourceDropdown-toggle"]').should('not.exist');
      cy.get('[data-cy="AlbumBreadcrumb-provider"]').should('have.text', 'Discogs');
    });
  });

  describe('using Last.fm', () => {
    beforeEach(() => {
      cy.visit('/scrobble/album/search/Meteora?source=lastfm');
      cy.wait('@userData');
    });

    it('displays dropdown for data sources', () => {
      cy.get('[data-cy="DataSourceDropdown-toggle"]').should('exist');
      cy.get('[data-cy="DataSourceDropdown-toggle"]').click();
      cy.get('[data-cy="DataSourceDropdown-menu"]').children().should('have.length', 2);
      // check active item matches data source
      cy.get('[data-cy="DataSourceDropdown-menu"]')
        .children('button.active')
        .should('have.text', 'Last.fm');
    });

    it('switches data source to Discogs', () => {
      // check initial Last.fm results
      cy.get('[data-cy="AlbumCard"]')
        .first()
        .parent()
        .should('have.attr', 'href')
        .and('match', /https:\/\/www.last.fm\/music\/.*\/.*/);

      cy.get('[data-cy="DataSourceDropdown-toggle"]').click();
      cy.get('[data-cy="DataSourceDropdown-menu"]')
        .find('[data-cy="DataSourceDropdown-item-discogs"]')
        .click();

      // check Discogs results
      cy.get('[data-cy="AlbumCard"]')
        .first()
        .parent()
        .should('have.attr', 'href')
        .and('match', /https:\/\/www.discogs.com\/master\/.*/);
    });

    it('displays static data source on album view', () => {
      cy.get('[data-cy="AlbumCard"]')
        .first()
        .click();

      cy.location('pathname').should('match', /scrobble\/album\/view/);

      cy.get('[data-cy="DataSourceDropdown-toggle"]').should('not.exist');
      cy.get('[data-cy="AlbumBreadcrumb-provider"]').should('have.text', 'Last.fm');
    });
  });
});
