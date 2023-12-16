// prettier-ignore

export default {
  'src/**/*.{js,jsx,ts,tsx}': [
    'eslint --fix',
    () => 'yarn test:unit --silent',
  ],
  'cypress/**/*': () => [
    'yarn test:e2e:quiet',
  ],
};
