const requestDelay = 100;

describe('Authentication', () => {
  describe('Visitor (happy path)', () => {
    beforeEach(() => {
      let userCallsCounter = 0;
      let callbackCallsCounter = 0;

      cy.intercept('GET', '/api/v2/user.php', (req) => {
        req.on('response', (res) => {
          res.setDelay(requestDelay);
        });

        if (userCallsCounter === 0) {
          req.reply({
            fixture: 'api/v2/user/visitor.json',
          });
        } else {
          req.reply({
            fixture: 'api/v2/user/authenticated.json',
          });
        }
        userCallsCounter++;
      }).as('userData');

      cy.intercept('POST', '/api/v2/callback.php', (req) => {
        req.on('response', (res) => {
          res.setDelay(requestDelay);
        });
        if (callbackCallsCounter === 0) {
          req.reply({ fixture: 'api/v2/callback/success.json' });
        } else {
          req.reply({ fixture: 'api/v2/callback/already-logged-in.json' });
        }
        callbackCallsCounter++;
      }).as('callback');

      cy.intercept('GET', '/api/v2/settings.php', (req) => {
        req.on('response', (res) => {
          res.setDelay(requestDelay);
        });
        req.reply({ fixture: 'api/v2/settings/authenticated.json' });
      }).as('settings');
    });

    it('hides the login link and user menu in navigation', () => {
      cy.visit('/lastfm/callback/?token=s3CM7rzuQKurE0U_Enq_3RHTYrm7XyyT');
      cy.get('[data-cy="NavigationItem-logIn"]').should('not.exist');
      cy.get('[data-cy="UserDropdown"]').should('not.exist');
    });

    it('authenticates the user correctly', () => {
      cy.visit('/lastfm/callback/?token=s3CM7rzuQKurE0U_Enq_3RHTYrm7XyyT');
      cy.wait('@callback');
      cy.location('pathname').should('eq', '/');
    });

    it('handles tokens received in the home page in the callback view', () => {
      cy.visit('/?token=s3CM7rzuQKurE0U_Enq_3RHTYrm7XyyT');
      // I tried checking the URL but Cypress didn't catch it
      cy.get('[data-cy="Callback-container"]').should('exist');
    });

    it('redirects to the home page without token', () => {
      cy.visit('/lastfm/callback/');
      cy.location('pathname').should('eq', '/');
    });

    it('hides login link in navbar', () => {
      cy.visit('/lastfm/callback/?token=s3CM7rzuQKurE0U_Enq_3RHTYrm7XyyT');
      cy.get('[data-cy="Navigation-login-link"]').should('not.exist');
    });

    it('shows the correct steps and status', () => {
      cy.visit('/lastfm/callback/?token=s3CM7rzuQKurE0U_Enq_3RHTYrm7XyyT');
      cy.get('[data-cy="Callback-container"]').should('exist');

      cy.log('Step 1: Validating token');
      cy.get('[data-cy="ProgressItem"]').contains('Validating token').should('have.attr', 'data-status', 'loading');
      cy.get('[data-cy="ProgressItem"]').contains('user details').should('have.attr', 'data-status', 'waiting');
      cy.get('[data-cy="ProgressItem"]').contains('preferences').should('have.attr', 'data-status', 'waiting');

      cy.log('Step 2: Fetching user details');
      cy.wait('@callback');
      cy.get('[data-cy="ProgressItem"]').contains('Validating token').should('have.attr', 'data-status', 'done');
      cy.get('[data-cy="ProgressItem"]').contains('user details').should('have.attr', 'data-status', 'loading');
      cy.get('[data-cy="ProgressItem"]').contains('preferences').should('have.attr', 'data-status', 'waiting');

      cy.log('Step 3: Reload settings');
      cy.wait('@userData');
      cy.get('[data-cy="ProgressItem"]').contains('Validating token').should('have.attr', 'data-status', 'done');
      cy.get('[data-cy="ProgressItem"]').contains('user details').should('have.attr', 'data-status', 'done');
      cy.get('[data-cy="ProgressItem"]').contains('preferences').should('have.attr', 'data-status', 'loading');

      cy.log('Step 4: All set and redirects home');
      cy.wait('@settings');
      cy.get('[data-cy="ProgressItem"]').contains('Validating token').should('have.attr', 'data-status', 'done');
      cy.get('[data-cy="ProgressItem"]').contains('user details').should('have.attr', 'data-status', 'done');
      cy.get('[data-cy="ProgressItem"]').contains('preferences').should('have.attr', 'data-status', 'done');
      cy.location('pathname').should('eq', '/');
    });
  });

  describe('Visitor (unhappy path)', () => {
    beforeEach(() => {
      let userCallsCounter = 0;
      cy.intercept('GET', '/api/v2/user.php', (req) => {
        req.on('response', (res) => {
          res.setDelay(requestDelay);
        });

        if (userCallsCounter === 0) {
          req.reply({
            fixture: 'api/v2/user/visitor.json',
          });
        } else {
          req.reply({
            fixture: 'api/v2/user/authenticated.json',
          });
        }
        userCallsCounter++;
      }).as('userData');

      cy.intercept('GET', '/api/v2/settings.php', { fixture: 'api/v2/settings/authenticated.json' }).as('settings');
      cy.intercept('/api/v2/callback.php', { fixture: 'api/v2/callback/success.json' }).as('callback');
    });

    it('shows an error if the token is invalid', () => {
      cy.intercept(
        {
          method: 'POST',
          url: '/api/v2/callback.php',
          middleware: true,
        },
        (req) => {
          req.reply({ fixture: 'api/v2/callback/failure.json', statusCode: 503 });
        }
      ).as('callback');

      cy.visit('/lastfm/callback/?token=s3CM7rzuQKurE0U_Enq_3RHTYrm7XyyT');

      cy.wait('@callback');
      cy.get('[data-cy="ProgressItem"]').contains('Validating token').should('have.attr', 'data-status', 'error');
      cy.get('[data-cy="ProgressItem"]').contains('user details').should('have.attr', 'data-status', 'waiting');
      cy.get('[data-cy="ProgressItem"]').contains('preferences').should('have.attr', 'data-status', 'waiting');

      cy.get('[data-cy="Callback-issues-block"]').should('exist');
      cy.get('[data-cy="Callback-try-again"]').should('exist');

      cy.location('pathname').should('contain', '/lastfm/callback/');
    });

    it.skip('redirects to login page when try again button is clicked', () => {
      // I'm skipping this one because I didn't find a way around the redirection to lastfm,
      // and since it's a third party site I don't want to rely on it for testing.
      cy.intercept(
        {
          method: 'POST',
          url: '/api/v2/callback.php',
          middleware: true,
        },
        (req) => {
          req.reply({ fixture: 'api/v2/callback/failure.json', statusCode: 503 });
        }
      ).as('callback');

      // cy.stub(callbackUtils, 'logoutAndTryAgain').returns(true).as('logout');

      cy.visit('/lastfm/callback/?token=s3CM7rzuQKurE0U_Enq_3RHTYrm7XyyT');
      cy.wait('@callback');

      cy.get('[data-cy="Callback-try-again"]').click();
      cy.wait('@logout');
      // ToDo: check it redirects to the login page after logout
    });

    it('shows an error if the user endpoint returns invalid data', () => {
      cy.intercept(
        {
          method: 'GET',
          url: '/api/v2/user.php',
          middleware: true,
        },
        (req) => {
          req.reply({ fixture: 'api/v2/user/visitor.json' });
        }
      ).as('userData');

      cy.visit('/lastfm/callback/?token=s3CM7rzuQKurE0U_Enq_3RHTYrm7XyyT');
      cy.wait('@userData');

      cy.get('[data-cy="Callback-issues-block"]').should('exist');
      cy.location('pathname').should('contain', '/lastfm/callback');
    });

    it('shows an error if Last.fm user endpoint is not available', () => {
      let userCallsCounter = 0;
      cy.intercept(
        {
          method: 'GET',
          url: '/api/v2/user.php',
          middleware: true,
        },
        (req) => {
          if (userCallsCounter === 0) {
            req.reply({ fixture: 'api/v2/user/visitor.json' });
          } else {
            req.reply({ fixture: 'api/v2/user/lastfm-unavailable.json', statusCode: 503 });
          }
          userCallsCounter++;
        }
      ).as('userData');

      cy.visit('/lastfm/callback/?token=s3CM7rzuQKurE0U_Enq_3RHTYrm7XyyT');

      cy.get('[data-cy="Callback-issues-block"]').should('exist');
      cy.location('pathname').should('contain', '/lastfm/callback');
    });

    it('resolves settings even if they fail and move onto the song view', () => {
      cy.intercept(
        {
          method: 'GET',
          url: '/api/v2/settings.php',
          middleware: true,
        },
        (req) => {
          req.reply({ fixture: 'api/v2/settings/visitor.json', statusCode: 401 });
        }
      ).as('settings');

      cy.visit('/lastfm/callback/?token=s3CM7rzuQKurE0U_Enq_3RHTYrm7XyyT');
      cy.wait('@settings');

      cy.get('[data-cy="ProgressItem"]').contains('preferences').should('have.attr', 'data-status', 'error');

      // Shows the message but the "Try again" button doesn't appear (soft fail)
      cy.get('[data-cy="Callback-try-again"]').should('not.exist');
      cy.get('[data-cy="Callback-issues-block"]').should('exist');

      cy.location('pathname').should('eq', '/');
    });
  });

  describe('Already logged in user', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/v2/user.php', { fixture: 'api/v2/user/authenticated.json' }).as('userData');
      cy.intercept('GET', '/api/v2/settings.php', { fixture: 'api/v2/settings/authenticated.json' }).as('settings');
      cy.intercept('/api/v2/callback.php', cy.spy().as('callback'));
    });

    it('redirects to the home page with token', () => {
      cy.visit('/lastfm/callback/?token=s3CM7rzuQKurE0U_Enq_3RHTYrm7XyyT');
      cy.location('pathname').should('eq', '/');
      cy.get('@callback').should('not.have.been.called');
    });

    it('redirects to the home page without token', () => {
      cy.visit('/lastfm/callback/');
      cy.location('pathname').should('eq', '/');
      cy.get('@callback').should('not.have.been.called');
    });

    it('shows only a spinner while doing the redirection', () => {
      // This intercept is needed to allow a realistic rendering of the spinner
      cy.intercept(
        {
          method: 'GET',
          url: '/api/v2/user.php',
          middleware: true,
        },
        (req) => {
          req.on('response', (res) => {
            res.setDelay(250);
          });
          req.reply({ fixture: 'api/v2/user/authenticated.json' });
        }
      );

      cy.visit('/lastfm/callback/?token=s3CM7rzuQKurE0U_Enq_3RHTYrm7XyyT');
      cy.get('[data-cy="Callback-Spinner"]').should('exist');
      cy.get('[data-cy="Callback-container"]').should('not.exist');
      cy.location('pathname').should('eq', '/');
    });
  });
});
