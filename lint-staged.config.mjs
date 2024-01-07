// prettier-ignore

export default {
  'src/**/*.{js,jsx,ts,tsx}': [
    'eslint --fix',
    () => 'yarn test:unit --silent',
    () => 'yarn typecheck',
  ],
  'cypress/**/*': () => [
    'yarn lint',
    'yarn test:e2e:quiet',
  ],
};
