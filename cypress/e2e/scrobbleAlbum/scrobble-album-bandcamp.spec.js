describe('Scrobble album using Bandcamp (SRP)', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();

    cy.intercept('GET', '/api/v2/user.php', { fixture: 'api/v2/user/authenticated.json' }).as('userData');
    cy.intercept('GET', '/api/v2/settings.php', { fixture: 'api/v2/settings/authenticated.json' });

    cy.intercept('GET', '/api/v2/bandcamp.php?method=artist.search*', {
      fixture: 'api/v2/bandcamp/artist.search.meteora.json',
    }).as('artistSearch');
    cy.intercept('GET', '/api/v2/bandcamp.php?method=album.search*', {
      fixture: 'api/v2/bandcamp/album.search.meteora.json',
    }).as('albumSearch');
    cy.intercept('GET', '/api/v2/bandcamp.php?method=album.getInfo*', {
      fixture: 'api/v2/bandcamp/album.getInfo.json',
    }).as('albumGetInfo');
    cy.intercept('GET', '/api/v2/bandcamp.php?method=artist.getInfo*', {
      fixture: 'api/v2/bandcamp/artist.getInfo.json',
    }).as('artistGetInfo');

    // Last.fm intercepts so the data-source switch test has somewhere to land
    cy.intercept('GET', 'https://ws.audioscrobbler.com/2.0/*method=artist.search*', {
      fixture: 'lastfm/artist/search.meteora.json',
    }).as('artistSearchLastFm');
    cy.intercept('GET', 'https://ws.audioscrobbler.com/2.0/*method=album.search*', {
      fixture: 'lastfm/album/search.meteora.json',
    }).as('albumSearchLastFm');

    cy.visit('/scrobble/album/search/Meteora?source=bandcamp');
    cy.wait('@userData');
  });

  it('lists all albums', () => {
    cy.get('[data-cy="AlbumCard"]').should('have.length', 3);
  });

  it('lists all artists', () => {
    cy.get('[data-cy="ArtistCard"]').should('have.length', 2);
  });

  it('links albums to their corresponding Bandcamp URL', () => {
    cy.get('[data-cy="AlbumCard"]')
      .first()
      .parent()
      .should('have.attr', 'href')
      .and('match', /scrobble\/album\/view\/bc\/\d+\/[at]\/\d+/);
  });

  it('links artists to their corresponding Bandcamp URL', () => {
    cy.get('[data-cy="ArtistCard"]')
      .first() // First artist card
      .children()
      .first() // Only child (the link)
      .should('have.attr', 'href')
      .and('match', /https:\/\/.*\.bandcamp\.com/);
  });

  it('displays the correct data source in the breadcrumb', () => {
    cy.get('[data-cy="AlbumBreadcrumb-provider"]').should('contain', 'Bandcamp');
  });

  it('displays dropdown for data sources', () => {
    cy.get('[data-cy="DataSourceDropdown-toggle"]').should('exist');
    cy.get('[data-cy="DataSourceDropdown-toggle"]').click();
    cy.get('[data-cy="DataSourceDropdown-menu"]').children().should('have.length', 3);
    cy.get('[data-cy="DataSourceDropdown-menu"]').children('button.active').should('have.text', 'Bandcamp');
  });

  it('switches data source to Last.fm', () => {
    // check initial Bandcamp results
    cy.get('[data-cy="AlbumCard"]')
      .first()
      .parent()
      .should('have.attr', 'href')
      .and('match', /scrobble\/album\/view\/bc\/\d+\/[at]\/\d+/);

    cy.get('[data-cy="DataSourceDropdown-toggle"]').click();
    cy.get('[data-cy="DataSourceDropdown-menu"]').find('[data-cy="DataSourceDropdown-item-lastfm"]').click();

    // check Last.fm results
    cy.get('[data-cy="AlbumCard"]')
      .first()
      .parent()
      .should('have.attr', 'href')
      .and('match', /https:\/\/www.last.fm\/music\/.*\/.*/);
  });

  it('displays static data source on album view', () => {
    cy.get('[data-cy="AlbumCard"]').first().click();

    cy.location('pathname').should('match', /scrobble\/album\/view\/bc\/\d+\/[at]\/\d+/);

    cy.get('[data-cy="DataSourceDropdown-toggle"]').should('not.exist');
    cy.get('[data-cy="AlbumBreadcrumb-provider"]').should('have.text', 'Bandcamp');
  });
});
