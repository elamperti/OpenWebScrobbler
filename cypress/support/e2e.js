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
