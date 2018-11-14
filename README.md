# Open Scrobbler [![Discord](https://img.shields.io/badge/Discord-online-green.svg?logo=discord)](https://discord.gg/vcbprTz) [![Patreon](https://img.shields.io/badge/Patreon-donate-orange.svg)](https://www.patreon.com/OpenScrobbler)

![Screenshot](https://user-images.githubusercontent.com/910672/45590262-55333c00-b90b-11e8-9f95-c360d35ced5f.jpg)

## What is this?
An open source scrobbler for the web. Just login and scrobble the track(s) you want! This tool lets you scrobble songs you heard on the radio, vinyls or at some place where you need to manually scrobble.

You may use it directly from here: [https://openscrobbler.com/](https://openscrobbler.com/)

What is _scrobbling_, you ask? It's tracking the music you listen to, using [last.fm](https://last.fm/).

## Help us make it better!
This tool is open source and free. You can support its development by [becoming a Patron](https://www.patreon.com/OpenScrobbler) (you'll have a distinct identifier in the application and get a sneak peek into what's coming next! :sparkles: )

### Contributing
Contributions and suggestions are welcome. If you want to work on a fix/feature I recommend you to [open an issue](https://github.com/elamperti/OpenWebScrobbler/issues) (or comment on an existing one) before you start working so we can coordinate efforts.

Issues labeled with ["help wanted"](https://github.com/elamperti/OpenWebScrobbler/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22) are perfect candidates!

### Translations
Translating is very easy. Here's a short guide (if you get stuck let me know [on Discord](https://discord.gg/vcbprTz) or [open an issue](https://github.com/elamperti/OpenWebScrobbler/issues/new)).


#### Adding a new language

  1. Fork this project if you haven't already, so you can edit it.
  2. Create a folder for your language in the [locales](./public/locales) directory, copying the files in [`en` language](./public/locales/en).
  3. Translate all the values in the JSON files (for example, in a line that says `"foo": "bar",` you should translate only the `bar` part).
  4. Add you language to the language list in [`src/i18n.js`](./src/i18n.js)
  5. Duplicate one hreflang tag in the [index.html](./public/index.html) and modify it to fit your language.
  6. Once you are done, the only thing left is creating a pull request so it can be merged with the current code. :confetti:

#### Improve an existing language

  1. Fork this project if you haven't already, so you can edit it.
  2. Find the folder corresponding to your language in [locales](./public/locales) directory.
  3. Translate or modify the values you want in the JSON files in that directory.
  4. Create a pull request so it can be merged back into this repository. :tada:

## Setup
You'll need [a Last.fm API account](https://www.last.fm/api/account/create)!

  * Run `yarn` to download the required libraries.
  * Copy `.env` to `.env.development.local` and fill in the required constants.
  * Docker and Docker Compose are required to run the API server locally.

## Development
Just start the application with `yarn start` (it will launch both the API server and the React application).
A database debugging utility will be available on [localhost:8080](http://localhost:8080). All changes to the database schema must be added as migrations (use [migration #1](./assets/db/migrations/0001_keepOriginalTimestamp.sql) as a guiding template) and remain backwards compatible. All new migrations are applied automatically in the development containers (just keep in mind that each migration runs only once, so you may need to manually revert any failed attempt).

## Building
The `build` script should be enough! :)

## Thank you!
One of the best things about open source is the great community around projects. The Open Scrobbler has several contributors and each one of them has made this tool better for everyone. Thanks to [all of them](https://github.com/elamperti/OpenWebScrobbler/graphs/contributors)!
