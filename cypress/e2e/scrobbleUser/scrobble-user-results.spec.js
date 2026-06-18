describe('Scrobble user (results)', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();

    cy.intercept('GET', '/api/v2/user.php', { fixture: 'api/v2/user/authenticated.json' }).as('userData');
    cy.intercept('GET', '/api/v2/settings.php', { fixture: 'api/v2/settings/authenticated.json' }).as('settings');
    cy.intercept('POST', '/api/v2/scrobble.php', { fixture: 'api/v2/scrobble/success.json' }).as('scrobbleData');
  });

  describe('Private user', () => {
    beforeEach(() => {
      cy.intercept('GET', 'https://ws.audioscrobbler.com/2.0/*method=user.getRecentTracks*', {
        fixture: 'lastfm/user/getRecentTracks.private.json',
      }).as('privateUserTracks');

      cy.visit('/scrobble/user/privateryan');
      cy.wait('@userData');
      cy.wait('@settings');
    });

    it.skip('shows empty when profile is private', () => {
      // Currently redirects to search, since lastfm replies with an error
    });
  });

  describe('Normal user', () => {
    beforeEach(() => {
      cy.intercept('GET', 'https://ws.audioscrobbler.com/2.0/*method=user.getRecentTracks*', {
        fixture: 'lastfm/user/getRecentTracks.elamperti.page1.json',
      }).as('page1');
      cy.intercept('GET', 'https://ws.audioscrobbler.com/2.0/*method=user.getRecentTracks*page=2*', {
        fixture: 'lastfm/user/getRecentTracks.elamperti.page2.json',
      }).as('page2');
      cy.intercept('GET', 'https://ws.audioscrobbler.com/2.0/*method=user.getRecentTracks*page=3*', {
        fixture: 'lastfm/user/getRecentTracks.elamperti.page3.json',
      }).as('page3');

      cy.visit('/scrobble/user/elamperti');
      cy.wait('@userData');
      cy.wait('@settings');
      cy.wait('@page1');
    });

    it('shows past scrobbles for a user', () => {
      cy.get('[data-cy="FriendScrobbles-ScrobbleList"]').should('exist');
      cy.get('[data-cy="ScrobbleItem"]').should('have.length', 50);
    });

    it('navigates to second page', () => {
      cy.get('[data-cy="Paginator"]').should('exist');
      cy.get('[data-cy="Paginator"] .page-item button').contains('2').click();
      cy.wait('@page2');
      cy.get('[data-cy="ScrobbleItem"]').should('have.length', 50);
    });

    it('resets scrobble button in list after changing pages', () => {
      cy.get('[data-cy="ScrobbleItem"]').first().find('.quick-scrobble-button').contains('Scrobble');
      cy.get('[data-cy="ScrobbleItem"]').first().find('.quick-scrobble-button').click();
      cy.wait('@scrobbleData');
      cy.get('[data-cy="ScrobbleItem"]').first().find('.quick-scrobble-button svg').should('exist');

      cy.get('[data-cy="Paginator"] .page-item button').contains('2').click();
      cy.wait('@page2');
      cy.get('[data-cy="ScrobbleItem"]').first().find('.quick-scrobble-button').contains('Scrobble');
    });

    it('should disable scrobbling for a song after clicking the scrobble button', () => {
      cy.get('[data-cy="FriendScrobbles-ScrobbleList"] [data-cy="ScrobbleItem"]')
        .first()
        .find('.quick-scrobble-button')
        .contains('Scrobble');
      cy.get('[data-cy="FriendScrobbles-ScrobbleList"] [data-cy="ScrobbleItem"]')
        .first()
        .find('.quick-scrobble-button')
        .click();
      cy.wait('@scrobbleData');

      cy.get('[data-cy="FriendScrobbles-ScrobbleList"] [data-cy="ScrobbleItem"]')
        .first()
        .find('.quick-scrobble-button')
        .should('be.disabled');
      cy.get('[data-cy="FriendScrobbles-ScrobbleList"] [data-cy="ScrobbleItem"]')
        .first()
        .find('.quick-scrobble-button svg')
        .should('exist');
    });

    it('keeps a scrobbled song marked after refreshing with new tracks', () => {
      // Scope to the friend's list: the sidebar "Your history" list also renders
      // ScrobbleItems (scrobbling adds one there), so an unscoped selection would
      // count the wrong items. The list is rendered with flex-column-reverse, so
      // the visual top is the last DOM item; .eq(-2) is the second song from the top.
      cy.get('[data-cy="FriendScrobbles-ScrobbleList"] [data-cy="ScrobbleItem"]')
        .eq(-2)
        .find('.quick-scrobble-button')
        .click();
      cy.wait('@scrobbleData');

      // The updated fixture prepends two newer tracks, so the scrobbled song
      // moves down to the fourth position from the top (.eq(-4)).
      cy.intercept('GET', 'https://ws.audioscrobbler.com/2.0/*method=user.getRecentTracks*', {
        fixture: 'lastfm/user/getRecentTracks.elamperti.page1-updated.json',
      }).as('page1-updated');

      cy.contains('button', 'Refresh').click();
      cy.wait('@page1-updated');

      cy.get('[data-cy="FriendScrobbles-ScrobbleList"] [data-cy="ScrobbleItem"]')
        .eq(-4)
        .find('.quick-scrobble-button')
        .should('exist')
        .should('be.disabled');
    });
  });
});
