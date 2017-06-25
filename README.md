# Open Web Scrobbler
An open source Last.fm scrobbler for the web. Just login and scrobble the track(s) you want.

This tool lets you scrobble songs you heard on the radio, vinyl or at some place where you need to manually scrobble.


## Usage
You may use it directly from here: [https://ows.elamperti.com/](https://ows.elamperti.com/)

Or host your own instance at your server following the setup instructions.


## Installation

### Requirements
#### Server
  * mod_rewrite
  * PHP, with *libcurl* and *SimpleXML* extensions
  * Recommended: SSL (using [let's encrypt](https://letsencrypt.org/) should be enough)
  * Optional: SSH access if you plan to use rsync (via Grunt)

#### Local
  * [Grunt](http://gruntjs.com/)
  * [Composer](https://getcomposer.org/)


### Setup
  * Run `npm install` to download the required Grunt plugins.
  * Run `composer install` to download Composer dependencies.
  * [Create a Last.fm API account](https://www.last.fm/api/account/create) 
    * Point your API account's **callback URL** to your ows `callback.php`
    * Copy your API key and secret to `config.sample.php` and save it as `config.php`
  * You may add a Google Analytics tracking code to `config.php` to track pageviews.
  * Modify `Gruntfile.js` so the *rsync* task points to your server (`dest` should be something like `user@host:public_html/ows/`)

## Contributing
Contributions are welcome, check the [issues](https://github.com/elamperti/OpenWebScrobbler/issues) or make a pull request. Suggestions are welcome too :)

### Motivation
I was an occasional user of *Universal Scrobbler*, which was a nice service offered at no cost. ~~But everything changed when the fire nation attacked.~~
The owner decided to make it a paid service, which left me with nothing but frustration. That's why I created this tool. This tool is open source and free of charge.
