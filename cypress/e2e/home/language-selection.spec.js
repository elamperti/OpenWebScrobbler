describe('Language preferences', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  describe('for visitors', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/v2/user.php', { fixture: 'api/v2/user/visitor.json' });
      cy.intercept('GET', '/api/v2/settings.php', { fixture: 'api/v2/settings/visitor.json', statusCode: 401 });
      cy.visit('/');
    });

    it('uses translations', () => {
      cy.get('[data-cy="HomeVisitor-about"] p').should('not.contain', 'about.description');
    });

    it('supports changing the language when not logged in', () => {
      cy.get('[data-cy="LanguageSelector"]').click();
      cy.get('[data-lang="es"]').click();
      cy.get('[data-cy="LanguageSelector"] a').should('contain', 'Idioma');
    });

    it('remembers the chosen language', () => {
      cy.intercept(
        {
          method: 'GET',
          url: '/api/v2/settings.php',
          middleware: true,
        },
        (req) => req.reply({ statusCode: 418, body: {} })
      );
      cy.get('[data-cy="LanguageSelector"]').click();
      cy.get('[data-lang="es"]').click();
      cy.reload();
      cy.get('[data-cy="LanguageSelector"] a').should('contain', 'Idioma');
    });
  });

  describe('for users', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/v2/user.php', { fixture: 'api/v2/user/authenticated.json' });
      cy.intercept('GET', '/api/v2/settings.php', { fixture: 'api/v2/settings/authenticated.json' });
      cy.intercept('POST', '/api/v2/settings.php', { fixture: 'api/v2/settings/saved.json' }).as('saveSettings');
      cy.visit('/');
    });

    it('changes the language from the navigation menu', () => {
      cy.get('[data-cy="LanguageSelector"]').click();
      cy.get('[data-lang="es"]').click();
      cy.get('[data-cy="LanguageSelector"] a').should('contain', 'Idioma');
      cy.wait('@saveSettings');
    });

    it('remembers the chosen language', () => {
      // Note: this is while settings don't override it
      cy.intercept(
        {
          method: 'GET',
          url: '/api/v2/settings.php',
          middleware: true,
        },
        (req) => req.reply({ statusCode: 418, body: {} })
      );

      cy.get('[data-cy="LanguageSelector"]').click();
      cy.get('[data-lang="es"]').click();
      cy.reload();
      cy.get('[data-cy="LanguageSelector"] a').should('contain', 'Idioma');
    });

    it('changes the language after saving settings', () => {
      cy.get('[data-cy="UserDropdown"]').click();
      cy.get('[data-cy="UserDropdown-settings"]').click();
      cy.get('[data-cy="SettingsModal-language"]').select('es');
      cy.get('[data-cy="LanguageSelector"] a').should('not.contain', 'Idioma');
      cy.get('[data-cy="SettingsModal-save"]').click();

      cy.wait('@saveSettings');
      cy.get('[data-cy="LanguageSelector"] a').should('contain', 'Idioma');
    });
  });
});
