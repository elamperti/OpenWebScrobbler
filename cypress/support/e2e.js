// ToDo: If this is required, import and use it strictly when needed.
//       It increases Cypress warmup and testing times dramatically.
// import '@cypress/code-coverage/support';

// This enters a text at once (contrary to type), triggering the input and change events
Cypress.Commands.add('rawInput', { prevSubject: 'element' }, (subject, value) => {
  cy.wrap(subject).then((el) => {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeInputValueSetter.call(el[0], value);

    // Dispatching events in a way that React can handle
    const inputEvent = new Event('input', { bubbles: true, cancelable: true });
    el[0].dispatchEvent(inputEvent);

    const changeEvent = new Event('change', { bubbles: true, cancelable: true });
    el[0].dispatchEvent(changeEvent);
  });
});

beforeEach(() => {
  // Global catch-all to prevent un-mocked requests to Last.FM
  cy.intercept({ hostname: 'ws.audioscrobbler.com' }, (req) => {
    req.reply({
      statusCode: 500,
      body: { error: 500, message: `Unintercepted request to ${req.url}` },
    });
    throw new Error(`Unintercepted request to Last.fm: ${req.url}`);
  });

  // Global default mock data
  cy.intercept('GET', 'https://ws.audioscrobbler.com/2.0/*method=user.getInfo*', {
    fixture: 'lastfm/user/getInfo.elamperti.json',
  }).as('userInfo');

  cy.intercept('GET', 'https://ws.audioscrobbler.com/2.0/*method=album.getInfo*', {
    fixture: 'lastfm/album/getInfo.am.json',
  }).as('albumInfo');
});
