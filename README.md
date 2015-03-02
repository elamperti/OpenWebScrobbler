# Open Web Scrobbler
An open source Last.fm scrobbler for the web. Just login and scrobble the track(s) you want.

This tool lets you scrobble songs you heard at the radio, on vinyl or at some place where you need to manually scrobble.


## Usage
You may use it directly from here: [http://ows.elamperti.com/](http://ows.elamperti.com/)

Or host your own instance at your server following the setup instructions.


## Setup

### Requirements
#### Server
  * PHP enabled server 
  * *curl* and *SimpleXML* extensions (they are pretty common)
  * Optional: SSH access if you plan to use rsync (via Grunt)

#### Local
  * [Grunt](http://gruntjs.com/)
  * [Composer](https://getcomposer.org/)


## Setup
  * Run `npm install` to download the required Grunt plugins.
  * Run `composer install` to download Composer dependencies.
  * [Create a Last.fm API account](http://www.last.fm/api/account/create) 
    * Point your API account's **callback URL** to your ows `callback.php`
    * Copy your API key and secret to `config.sample.php` and save it as `config.php`
  * You may add a Google Analytics tracking code to `config.php` to track pageviews.
  * Modify `Gruntfile.js` so the *rsync* task points to your server (`dest` should be something like `user@host:public_html/ows/`)


## ToDo
  * Check sessions' duration
  * Add a footer linking to this Github repo
  * Verify if signature works with UTF-8 characters
  * Enable grunt-uncss (and similar optimizations)
  * Complete this readme file, add feature list

## Wishlist
  * Track scrobble event with Analytics (to count how many scrobbles have been made through this tool)
  * Checkbox: love this track
  * Allow custom time
  * Create a notification on logout
  * Add timer to the alerts
  * Share buttons for facebook, twitter, etc.
  * Autocomplete for artist/tracks? (issue #1)
  * A better logo


### Motivation
I was an occasional user of *Universal Scrobbler*, which was a nice service offered at no cost. ~~But everything changed when the fire nation attacked.~~
The owner decided to make it a paid service, which left me with nothing but frustration. That's why I created this tool. This tool is free and gratis.
