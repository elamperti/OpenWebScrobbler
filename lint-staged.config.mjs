// prettier-ignore

export default {
  'src/**/*.{js,jsx,ts,tsx}': [
    'eslint --fix',
    () => 'yarn typecheck',
    () => 'yarn test:unit --silent',
  ],
  'cypress/**/*': () => [
    'yarn lint',
    'yarn test:e2e:quiet',
  ],
};
