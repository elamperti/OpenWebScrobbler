<?php

	require('inc/init.php');
	require('inc/api.php');

	// Create a JSON response if required
	if (isset($_POST['format']) && $_POST['format'] == 'json') {
		$json = true;
	} else {
		$json = false;
	}

	function check_timestamp($timestamp) {
		$timestamp = strtotime($timestamp);
		$current_time = time();
		$min = $current_time - 14*24*3600;
		$max = $current_time + 14*24*3600;
		if(!$timestamp || $timestamp < $min || $max < $timestamp) {
			$timestamp = $current_time;
		}
		return $timestamp;
	}

	if (isset($_SESSION['key'])) {
		if (isset($_POST['artist']) && isset($_POST['track'])) {

			$track_info = array(
				'artist'    => array_map('trim', $_POST['artist']),
				'track'     => array_map('trim', $_POST['track']),
				'timestamp' => array_map('check_timestamp', $_POST['timestamp'])
			);

			if (isset($_POST['album'])) {
				$track_info['album'] = array_map('trim', $_POST['album']);
			}

			// All ready, call the API
			$response = $api->call('track.scrobble', $track_info, true, $json);

			// If JSON requested, client-side script will take it from here.
			if ($json) {
				header('Content-Type: application/json');
				echo $response;
				die();
			}

			// The following code runs only if it wasn't an AJAX request
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
