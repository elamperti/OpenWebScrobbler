# Contributing

I'm really glad you're reading this, because it's through the help of contributors that the Open Scrobbler can continue to grow! Below you will find guidelines for contributing new features, bug fixes or translations.

<!-- TOC depthFrom:2 -->
- [Fixing bugs](#fixing-bugs)
- [Adding new features or changing the code](#adding-new-features-or-changing-the-code)
  - [Making changes to the database structure](#making-changes-to-the-database-structure)
- [Translations](#translations)
<!-- /TOC -->

---

## Fixing bugs

Thanks for taking interest in fixing a bug! First of all, please check if there's [an existing issue](https://github.com/elamperti/OpenWebScrobbler/issues) for it, [create a new one](https://github.com/elamperti/OpenWebScrobbler/issues) otherwise. This may help other people add feedback, maintainers will know the bug status and also let you know if there are error reports in Sentry related to it (which may help you find a solution).

You may skip raising an issue if it's a minor bug.

Once you have a possible fix, open a pull request so it can be reviewed and merged.

---

## Adding new features or changing the code

It's highly encouraged to [open an issue](https://github.com/elamperti/OpenWebScrobbler/issues/new/choose) (or comment on an existing one) before you start coding, especially if you are planning to implement new features or wish to make big changes in the codebase. With this previous discussion, everyone saves time and there's a higher chance to get your work merged.

### Making changes to the database structure
All changes to the database schema must be added as migrations (use [migration #1](./assets/db/migrations/0001_keepOriginalTimestamp.sql) as a guiding template) and remain backwards compatible. All new migrations are applied automatically in the development containers (just keep in mind that each migration runs only once, so you may need to manually revert any failed attempt).

---

## Translations

To add or improve translations for your language, follow the link "Want to add your language?" from the language selector menu. We are currently using a very friendly tool that doesn't require any code knowledge! To discuss a particular term or seek help, you can join #translations [on Discord](https://discord.gg/vcbprTz) or [open an issue](https://github.com/elamperti/OpenWebScrobbler/issues/new).

Languages with less than 60% of terms translated may not be listed in the application. Updated translation terms will be pushed to the application on the following update.
