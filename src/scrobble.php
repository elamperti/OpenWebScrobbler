<?php

	require('inc/init.php');
	require('inc/api.php');
	
	if (isset($_SESSION['key'])) {
		if (isset($_POST['artist']) && isset($_POST['track'])) {

			$track_info = array(
				'artist'    => trim($_POST['artist']),
				'track'     => trim($_POST['track']),
				'timestamp' => time()
			);

			if (isset($_POST['album'])) {
				$track_info['album'] = $_POST['album'];
			}

			// All ready, call the API
			$response = $api->call('track.scrobble', $track_info, true);

			if ($response->attributes()['status'] == 'ok') {
				$tracks_scrobbled = intval($response->scrobbles->attributes()['accepted']);
				// $tracks_ignored   = intval($response->scrobbles->attributes()['ignored']);

				if ($tracks_scrobbled) {
					add_alert('success', ngettext('Track scrobbled', '%d tracks scrobbled', $tracks_scrobbled));
				} else {
					add_alert('error', 'There was a problem scrobbling :(');
				}

			} else if ($response->attributes()['status'] == 'failed') {
				switch ($response->error->attributes()['code']) {
					case '11': // Service Offline - This service is temporarily offline. Try again later.
					case '16': // There was a temporary error processing your request. Please try again.
						add_alert('warning', 'Last.fm is temporarily unavailable. Try again in a moment.');
						break;
					
					case '9':  // Invalid session key - Please re-authenticate
					case '29': // Rate limit exceeded - Your IP has made too many requests in a short period
						logout();
						add_alert('error', 'Your session expired. Please log in again.');
						break;

					default:
						add_alert('warning', 'There was an unknown problem scrobbling your track <span class="text-muted">(error ' . $response->error->attributes()['code'] . ')</span>');
						break;
				}
			}

			header('Location: /');

		} else {
			add_alert('warning', 'Artist or title missing.');

		}

	} else { // No session key, what are you doing here?
		add_alert('error', 'You need to log in first.');
		header('Location: /');

	}