module.exports = {
  babel: {
    plugins: [
      [
        '@locator/babel-jsx/dist',
        {
          env: 'development',
        },
      ],
    ],
  },
};
