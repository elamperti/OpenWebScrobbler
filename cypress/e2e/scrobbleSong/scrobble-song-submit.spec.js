import qs from 'qs';

const scrobblingBaseDate = Date.UTC(2023, 5, 30, 23, 59, 4, 123);

describe('Scrobble song (scrobbling)', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();

    cy.intercept('GET', '/api/v2/user.php', { fixture: 'api/v2/user/authenticated.json' }).as('userData');
    cy.intercept('POST', '/api/v2/scrobble.php', { fixture: 'api/v2/scrobble/success.json' }).as('scrobbleData');

    cy.visit('/scrobble/song');
    cy.location('pathname').should('equal', '/scrobble/song');

    cy.clock(scrobblingBaseDate, ['Date']);

    cy.get('[data-cy="SongForm-artist"]').type('Arctic Monkeys', { delay: 0 });
    cy.get('[data-cy="SongForm-title"]').type('Arabella', { delay: 0 });
    cy.get('[data-cy="SongForm-album"]').type('AM', { delay: 0 });
    cy.get('[data-cy="SongForm-albumArtist"]').type('Other', { delay: 0 });
  });

  it('should submit the expected data', () => {
    cy.get('[data-cy="scrobble-button"]').click();

    cy.wait('@scrobbleData').then((interception) => {
      const body = qs.parse(interception.request.body);

      expect(body).to.have.deep.property('artist', ['Arctic Monkeys']);
      expect(body).to.have.deep.property('track', ['Arabella']);
      expect(body).to.have.deep.property('album', ['AM']);
      expect(body).to.have.deep.property('albumArtist', ['Other']);
      expect(body).to.have.deep.property('timestamp', ['2023-06-30T23:59:04.123Z']);
    });
  });

  it('should submit a different time when the user changes it', () => {
    cy.get('[data-cy="timestampMode-custom"]').click();
    cy.get('[data-cy="DateTimePicker-time"]').type('10:20:45');

    cy.get('[data-cy="scrobble-button"]').click();

    cy.wait('@scrobbleData').then((interception) => {
      // body is a query string, we need to parse it
      const body = qs.parse(interception.request.body);

      expect(body).to.have.deep.property('timestamp', ['2023-07-01T07:20:45.000Z']);
    });
  });

  it('should submit a different date when the user changes it', () => {
    cy.get('[data-cy="timestampMode-custom"]').click();

    cy.get('[data-cy="DateTimePicker-time"]').type('10:20:45');

    cy.get('[data-cy="DateTimePicker-date"]').click();
    cy.get('.DayPicker-NavButton--prev').click();
    cy.get('[aria-label="Wed Jun 28 2023"]').click();

    cy.get('[data-cy="scrobble-button"]').click();

    cy.wait('@scrobbleData').then((interception) => {
      // body is a query string, we need to parse it
      const body = qs.parse(interception.request.body);

      expect(body).to.have.deep.property('timestamp', ['2023-06-28T07:20:45.000Z']);
    });
  });
});
