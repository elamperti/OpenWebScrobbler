# Open Scrobbler [![Discord](https://img.shields.io/badge/Discord-online-green.svg?logo=discord)](https://discord.gg/vcbprTz) [![Patreon](https://img.shields.io/badge/Patreon-donate-orange.svg)](https://www.patreon.com/OpenScrobbler)

![Screenshot](https://user-images.githubusercontent.com/910672/45590262-55333c00-b90b-11e8-9f95-c360d35ced5f.jpg)

## What is this?
An open source scrobbler for the web. Just login and scrobble the track(s) you want! This tool lets you scrobble songs you heard on the radio, vinyls or at some place where you need to manually scrobble.

You may use it directly from here: [https://openscrobbler.com/](https://openscrobbler.com/)

What is _scrobbling_, you ask? It's tracking the music you listen to, using [last.fm](https://last.fm/).

## Help us make it better!
This tool is open source and free. You can support its development by [becoming a Patron](https://www.patreon.com/OpenScrobbler) (you'll have a distinct identifier in the application and get a sneak peek into what's coming next! :sparkles: )

### Contributing
Contributions and suggestions are welcome. Please read the [contribution guidelines](https://github.com/elamperti/OpenWebScrobbler/blob/master/CONTRIBUTING.md) for more information. Issues labeled with ["help wanted"](https://github.com/elamperti/OpenWebScrobbler/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22) are great candidates if you don't know where to begin!

### Translations
Updating translations is very easy. There's a [short guide](https://github.com/elamperti/OpenWebScrobbler/blob/master/CONTRIBUTING.md#Translations) in the contribution guidelines :)

## Setup
You'll need [a Last.fm API account](https://www.last.fm/api/account/create)!

  * Run `yarn` to download the required libraries.
  * Copy `.env` to `.env.development.local` and fill in the required constants.
  * Docker and Docker Compose are required to run the API server locally.

## Development
Just start the application with `yarn start` (it will launch both the API server and the React application).
A database debugging utility will be available on [localhost:8080](http://localhost:8080).

## Building
The `build` script should be enough! :)

## Thank you!
One of the best things about open source is the great community around projects. The Open Scrobbler has several contributors and each one of them has made this tool better for everyone. Thanks to [all of them](https://github.com/elamperti/OpenWebScrobbler/graphs/contributors)!
