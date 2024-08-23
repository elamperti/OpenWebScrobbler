# Open Scrobbler

[![GitHub Actions](https://github.com/elamperti/OpenWebScrobbler/actions/workflows/test.yml/badge.svg)](https://github.com/elamperti/OpenWebScrobbler/actions) [![E2E tests](https://img.shields.io/endpoint?url=https://cloud.cypress.io/badge/count/b19z84/main&style=flat&logo=cypress)](https://cloud.cypress.io/projects/b19z84/runs) [![codecov](https://codecov.io/gh/elamperti/OpenWebScrobbler/graph/badge.svg?token=VbgOTPlw8v)](https://codecov.io/gh/elamperti/OpenWebScrobbler) [![Discord](https://img.shields.io/badge/Discord-online-green.svg?logo=discord)](https://discord.gg/vcbprTz) [![Patreon](https://img.shields.io/badge/Patreon-support-orange.svg)](https://www.patreon.com/OpenScrobbler)

![Screenshot](https://user-images.githubusercontent.com/910672/45590262-55333c00-b90b-11e8-9f95-c360d35ced5f.jpg)

## What is this?

An open source scrobbling client for the web. Just login and scrobble the track(s) you want! This tool lets you scrobble songs you heard on the radio, vinyls or at some place where you need to manually scrobble.

You may use it directly from here: [https://openscrobbler.com/](https://openscrobbler.com/)

What is _scrobbling_, you ask? It's tracking the music you listen to, using [last.fm](https://last.fm/).

## Help us make it better!

You can support development by [becoming a Patron](https://www.patreon.com/OpenScrobbler) (you'll have a distinct identifier in the application, get a sneak peek into what's coming next, and a few extra features! :sparkles: )

### Contributing

Contributions and suggestions are welcome. Please read the [contribution guidelines](https://github.com/elamperti/OpenWebScrobbler/blob/main/CONTRIBUTING.md) for more information. Issues labeled with ["help wanted"](https://github.com/elamperti/OpenWebScrobbler/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22) are great candidates if you don't know where to begin!

### Translations

To join the translators team, follow the link at the bottom of the language selector in the application ("Want to add your language?").

## Development setup

* Clone the repository
* Copy `.env` to `.env.development.local`, then set at least the required variables
  * You'll need a [Last.fm API account](https://www.last.fm/api/account/create) to be able to interact with Open Scrobbler (it's used for authentication and queries). Once you have your keys, fill in `REACT_APP_LASTFM_API_KEY` and `LASTFM_API_KEY` (same value in both) and `LASTFM_SECRET`
  * Optional:  to interact with Discogs, create a [Discogs application](https://www.discogs.com/settings/developers) to get API keys and fill in `DISCOGS_API_KEY` and `DISCOGS_SECRET`
* Run `yarn` to download the required libraries.
* Run `yarn start` to initialize the docker container and run the application.

## Testing

You will need to copy `cypress.env.json` to `cypress.development.json` and update the file to execute the tests. Don't use last.fm account credentials from a real account!

Tests can be run with `yarn test`, Cypress console can be accessed with `yarn cypress`.

To check test coverage run `yarn test:coverage`

## Running the application

Just start it with `yarn start` (it will launch both the API server and the React application).

## Building

The `build` script should be enough! :)

## Thank you!
One of the best things about open source is the great community around it. Open Scrobbler has several contributors and each one of them has made this tool better for everyone. Thanks to [all of them](https://github.com/elamperti/OpenWebScrobbler/graphs/contributors)!
