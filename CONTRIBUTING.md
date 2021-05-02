# Contributing

I'm really glad you're reading this, because it's through the help of contributors that the Open Scrobbler can continue to grow! Below you will find guidelines for contributing new features, bug fixes or translations.

<!-- TOC depthFrom:2 -->
- [Fixing bugs](#fixing-bugs)
- [Adding new features or changing the code](#adding-new-features-or-changing-the-code)
  - [Making changes to the database structure](#making-changes-to-the-database-structure)
- [Translations](#translations)
  - [Adding a new language](#adding-a-new-language)
  - [Update an existing language](#update-an-existing-language)
<!-- /TOC -->

---

## Fixing bugs

Thanks for taking interest in fixing a bug! First of all, please check if there's [an existing issue](https://github.com/elamperti/OpenWebScrobbler/issues) for it, [create a new one](https://github.com/elamperti/OpenWebScrobbler/issues) otherwise. This may help other people add feedback, maintainers will know the bug status and also let you know if there are error reports in Sentry related to it (which may help you find a solution).

You may skip raising an issue if it's a minor bug.

Once you have a possible fix, open a pull request so it can be reviewed and merged.

---

## Adding new features or changing the code

It's highly encouraged to [open an issue](https://github.com/elamperti/OpenWebScrobbler/issues/new/choose) (or comment on a existing one) before you start coding, specially if you are planning to implement new features or wish to make big changes in the codebase. With this previous discussion everyone saves time and there's a higher chance to get your work merged.

### Making changes to the database structure
All changes to the database schema must be added as migrations (use [migration #1](./assets/db/migrations/0001_keepOriginalTimestamp.sql) as a guiding template) and remain backwards compatible. All new migrations are applied automatically in the development containers (just keep in mind that each migration runs only once, so you may need to manually revert any failed attempt).

---

## Translations

Below you will find a short step-by-step guides to add a new language or update an existing one. If you get stuck let me know [on Discord](https://discord.gg/vcbprTz) or [open an issue](https://github.com/elamperti/OpenWebScrobbler/issues/new).

:bulb: Subscribe to [issue #115](https://github.com/elamperti/OpenWebScrobbler/issues/115) to receive notifications when there are new things to be translated!

### Adding a new language

  1. Fork this project if you haven't already, so you can edit it.
  2. Create a folder for your language in the [locales](./public/locales) directory, copying the `common.json` file in [`en` language](./public/locales/en).
  3. Translate all the values in the JSON file (for example, in a line that says `"foo": "bar",` you should translate only the `bar` part).
  4. Add you language to the language list in [`src/i18n.js`](./src/i18n.js)
  5. Duplicate one hreflang tag in the [index.html](./public/index.html) and modify it to fit your language.
  6. Once you are done, the only thing left is creating a pull request so it can be merged with the current code. :confetti_ball:

### Update an existing language

  1. Fork this project if you haven't already, so you can edit it.
  2. Find the folder corresponding to your language in [locales](./public/locales) directory.
  3. Translate or modify the values you want in `common.json`
  4. Create a pull request so it can be merged back into this repository. :tada:
