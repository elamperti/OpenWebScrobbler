# OpenWebScrobbler
An open source Last.fm scrobbler for the web.


## Motivation
I was an occasional user of *Universal Scrobbler*, which was a nice (and free) service. ~~But everything changed when the fire nation attacked.~~
The owner decided to make it a paid service, which left me with nothing but frustration. That's why I created this tool. This tool is free and gratis.


## Requirements
### Server
You need a PHP enabled server with the *curl* and *SimpleXML* extensions (they are pretty common).
Optional: SSH access if you plan to use rsync (via Grunt).

### Local
This app is built using [Grunt](http://gruntjs.com/). You should have grunt and npm installed. [Composer](https://getcomposer.org/) is also required.


## Setup
  * Run `npm install` to download the required Grunt plugins.
  * Run `composer install` to download Composer dependencies.
  * [Create a Last.fm API account](http://www.last.fm/api/account/create) 
  * Point your API account's **callback URL** to your ows `callback.php`
  * Copy your API key and secret to `config.sample.php` and save it as `config.php`
  * Modify `Gruntfile.js` so the *rsync* task `dest` points to your server (e.g. `user@host:public_html/ows/`).


## ToDo
  * Create logo and icon for last.fm API and a favicon while I'm at that
  * Implement Google Analytics
  * Scrobble through AJAX
  * Check sessions' duration
  * Add a footer linking to ows' Github repo
  * Complete this readme file

## Wishlist
  * Add user's avatar to the toolbar
  * Checkbox: love this track
  * Allow custom time
  * Create a notification on logout
  * Add timer to the alerts
