describe('Scrobble song (form)', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();

    cy.intercept('GET', '/api/v2/user.php', { fixture: 'api/v2/user/authenticated.json' }).as('userData');
    cy.intercept('GET', '/api/v2/settings.php', { fixture: 'api/v2/settings/authenticated.json' }).as('settings');
    cy.intercept('POST', '/api/v2/scrobble.php', { fixture: 'api/v2/scrobble/success.json' }).as('scrobbleData');
    cy.intercept('GET', 'https://ws.audioscrobbler.com/2.0/*method=user.getRecentTracks*', {
      fixture: 'lastfm/user/getRecentTracks.chairmandore.json',
    }).as('recentTracks');

    cy.visit('/scrobble/song');
  });

  it('displays the page', () => {
    cy.location('pathname').should('equal', '/scrobble/song');
    cy.get('[data-cy="ScrobbleSong"]');
  });

  it('has the song form', () => {
    cy.get('[data-cy="SongForm"]');
  });

  it('hides the song form while user data is loading', () => {
    cy.intercept(
      {
        url: '/api/v2/user.php',
        middleware: true,
      },
      (req) => {
        req.log = false;
        req.reply({
          fixture: 'api/v2/user/authenticated.json',
        });
        req.on('response', (res) => {
          res.setDelay(250);
        });
      }
    ).as('delayedUserData');
    cy.visit('/scrobble/song'); // Reload the page to trigger the intercept

    cy.get('[data-cy="SongForm"]').should('not.exist');
    cy.wait('@delayedUserData');
    cy.get('[data-cy="SongForm"]').should('exist');
  });

  it.skip('persists the form state while revalidating settings', () => {
    cy.clock();
    cy.wait('@userData');
    cy.wait('@settings');

    cy.get('[data-cy="SongForm-artist"]').type('Arctic Monkeys');
    cy.get('[data-cy="SongForm-title"]').type('Arabella');

    cy.tick(1000 * 60 * 5); // 5 minutes
    cy.document().trigger('visibilitychange');

    // FIXME: I couldn't trigger a user revalidation
    cy.wait('@userData');

    cy.get('[data-cy="SongForm-artist"]').should('have.value', 'Arctic Monkeys');
    cy.get('[data-cy="SongForm-title"]').should('have.value', 'Arabella');
  });

  it('disables the Scrobble button when the form is incomplete', () => {
    cy.get('[data-cy="scrobble-button"]').should('be.disabled');

    // Add only the artist name
    cy.get('[data-cy="SongForm-artist"]').type('Arctic Monkeys');
    cy.get('[data-cy="scrobble-button"]').should('be.disabled');
    cy.get('[data-cy="SongForm-artist"]').clear();

    // Add only the title
    cy.get('[data-cy="SongForm-title"]').type('Arabella');
    cy.get('[data-cy="scrobble-button"]').should('be.disabled');
    cy.get('[data-cy="SongForm-title"]').clear();

    // Add both Album and album artist
    cy.get('[data-cy="SongForm-album"]').type('AM');
    cy.get('[data-cy="SongForm-albumArtist"]').type('Arctic Monkeys');
    cy.get('[data-cy="scrobble-button"]').should('be.disabled');
  });

  it('enables the Scrobble button when the form is complete', () => {
    cy.get('[data-cy="SongForm-artist"]').type('Arctic Monkeys');
    cy.get('[data-cy="SongForm-title"]').type('Arabella');
    cy.get('[data-cy="scrobble-button"]').should('not.be.disabled');
  });

  it('swaps artist and title when the user clicks the swap button', () => {
    cy.get('[data-cy="SongForm-artist"]').type('Arctic Monkeys', { delay: 0 });
    cy.get('[data-cy="SongForm-title"]').type('Arabella', { delay: 0 });

    cy.get('[data-cy="SongForm-swap"]').click();

    cy.get('[data-cy="SongForm-artist"]').should('have.value', 'Arabella');
    cy.get('[data-cy="SongForm-title"]').should('have.value', 'Arctic Monkeys');
  });

  describe('after scrobbling', () => {
    beforeEach(() => {
      cy.get('[data-cy="SongForm-artist"]').type('Arctic Monkeys', { delay: 0 });
      cy.get('[data-cy="SongForm-title"]').type('Arabella', { delay: 0 });
      cy.get('[data-cy="SongForm-album"]').type('AM', { delay: 0 });
      cy.get('[data-cy="SongForm-albumArtist"]').type('Other', { delay: 0 });
    });

    it('clears the form after submission', () => {
      cy.get('[data-cy="scrobble-button"]').click();

      cy.wait('@scrobbleData').then(() => {
        cy.get('[data-cy="SongForm-artist"]').should('have.value', '');
        cy.get('[data-cy="SongForm-title"]').should('have.value', '');
        cy.get('[data-cy="SongForm-album"]').should('have.value', '');
        cy.get('[data-cy="SongForm-albumArtist"]').should('have.value', '');
      });
    });

    it('keeps pinned artist', () => {
      cy.get('[data-cy="SongForm-artist-lock"]').click();

      cy.get('[data-cy="scrobble-button"]').click();

      cy.wait('@scrobbleData').then(() => {
        cy.get('[data-cy="SongForm-artist"]').should('have.value', 'Arctic Monkeys');
        cy.get('[data-cy="SongForm-title"]').should('have.value', '');
      });
    });

    it('keeps pinned album', () => {
      cy.get('[data-cy="SongForm-album-lock"]').click();

      cy.get('[data-cy="scrobble-button"]').click();

      cy.wait('@scrobbleData').then(() => {
        cy.get('[data-cy="SongForm-album"]').should('have.value', 'AM');
        cy.get('[data-cy="SongForm-albumArtist"]').should('have.value', 'Other');
      });
    });
  });

  describe('interactions', () => {
    it('fills the form properly with a scrobble from recent history', () => {
      cy.intercept('GET', 'https://ws.audioscrobbler.com/2.0/*method=album.getInfo*', {
        fixture: 'lastfm/album/getInfo.am.json',
      }).as('albumInfo');

      // Scrobble a song to be used as recent track
      cy.get('[data-cy="SongForm-artist"]').type('Arctic Monkeys');
      cy.get('[data-cy="SongForm-title"]').type('Arabella');
      cy.get('[data-cy="SongForm-album"]').type('AM');
      cy.get('[data-cy="SongForm-albumArtist"]').type('Other');
      cy.get('[data-cy="scrobble-button"]').click();
      cy.wait('@scrobbleData');

      cy.get('[data-cy="ScrobbleSong-history-tab"]').click();
      cy.get('[data-cy="ScrobbleItem-toggle-menu"]').first().click();
      cy.get('[data-cy="ScrobbleItem-menu"]').contains('Copy to editor').click();

      // Verify song title and artist match
      cy.get('[data-cy="SongForm-title"]').should('have.value', 'Arabella');
      cy.get('[data-cy="SongForm-artist"]').should('have.value', 'Arctic Monkeys');
      cy.get('[data-cy="SongForm-album"]').should('have.value', 'AM');
      cy.get('[data-cy="SongForm-albumArtist"]').should('have.value', 'Other');

      // Timestamp picker shouldn't be visible
      cy.get('[data-cy="DateTimePicker"]').should('not.exist');
    });

    it('fills the form properly with a scrobble from the user profile', () => {
      cy.get('[data-cy="ScrobbleSong-profile-tab"]').click();
      cy.wait('@recentTracks');
      cy.get('[data-cy="ScrobbleItem-toggle-menu"]').first().click();
      cy.get('[data-cy="ScrobbleItem-menu"]').contains('Copy to editor').click();

      // Verify song title and artist match
      cy.get('[data-cy="SongForm-title"]').should('have.value', 'Salad Days');
      cy.get('[data-cy="SongForm-artist"]').should('have.value', 'Reaching Quiet');

      // Timestamp picker should be visible (with custom date corresponding to the scrobble)
      cy.get('[data-cy="DateTimePicker"]').should('be.visible');
      cy.get('[data-cy="DateTimePicker-date"]').should('have.value', 'Oct 19th'); // FIXME: this should not work outside the 2 week range
      cy.get('[data-cy="DateTimePicker-time"]').should('have.value', '03:22:35');
    });
  });
});
