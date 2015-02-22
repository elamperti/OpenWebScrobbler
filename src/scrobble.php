<?php

	require('inc/init.php');
	require('inc/api.php');
	
	$response = $api->call('track.scrobble', array(
		'artist'    => 'Rick Astley',
		'track'     => 'Never Gonna Give You Up',
		'timestamp' => time(),
		'chosenByUser' => 0 // Well, to be honest the user has just been rickrolled...
		),
		true
	);

	add_alert('success', 'Track scrobbled');

	header('Location: /');