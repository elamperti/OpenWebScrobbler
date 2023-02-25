# Open Scrobbler [![GitHub Actions](https://github.com/elamperti/OpenWebScrobbler/actions/workflows/test.yml/badge.svg)] [![CircleCI](https://circleci.com/gh/elamperti/OpenWebScrobbler.svg?style=svg)](https://circleci.com/gh/elamperti/OpenWebScrobbler) [![Discord](https://img.shields.io/badge/Discord-online-green.svg?logo=discord)](https://discord.gg/vcbprTz) [![Patreon](https://img.shields.io/badge/Patreon-donate-orange.svg)](https://www.patreon.com/OpenScrobbler)

![Screenshot](https://user-images.githubusercontent.com/910672/45590262-55333c00-b90b-11e8-9f95-c360d35ced5f.jpg)

## What is this?
An open source scrobbling client for the web. Just login and scrobble the track(s) you want! This tool lets you scrobble songs you heard on the radio, vinyls or at some place where you need to manually scrobble.

You may use it directly from here: [https://openscrobbler.com/](https://openscrobbler.com/)

What is _scrobbling_, you ask? It's tracking the music you listen to, using [last.fm](https://last.fm/).

## Help us make it better!
This tool is open source and free. You can support its development by [becoming a Patron](https://www.patreon.com/OpenScrobbler) (you'll have a distinct identifier in the application and get a sneak peek into what's coming next! :sparkles: )

### Contributing
Contributions and suggestions are welcome. Please read the [contribution guidelines](https://github.com/elamperti/OpenWebScrobbler/blob/main/CONTRIBUTING.md) for more information. Issues labeled with ["help wanted"](https://github.com/elamperti/OpenWebScrobbler/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22) are great candidates if you don't know where to begin!

### Translations
To join the translators team, follow the link at the bottom of the language selector in the application ("Want to add your language?").

## Development setup
You'll need [a Last.fm API account](https://www.last.fm/api/account/create)! (and probably a Discogs API key as well)

  * Run `yarn` to download the required libraries.
  * Copy `.env` to `.env.development.local` and fill in the required constants.

## Testing
You will need to copy `cypress.env.json` to `cypress.development.json` and update the file to execute the tests. Don't use last.fm account credentials from a real account!

Tests can be run with `yarn test`, Cypress console can be accessed with `yarn cypress`. At this moment tests are in an experimental WIP phase.

## Running the application
Just start it with `yarn start` (it will launch both the API server and the React application).

## Building
The `build` script should be enough! :)

## Thank you!
One of the best things about open source is the great community around it. The Open Scrobbler has several contributors and each one of them has made this tool better for everyone. Thanks to [all of them](https://github.com/elamperti/OpenWebScrobbler/graphs/contributors)!
