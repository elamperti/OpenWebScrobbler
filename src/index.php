<?php

	require('inc/init.php');
	require('inc/config.php');

	$vars = [];

	$vars['lastfm_auth_link'] = 'http://www.last.fm/api/auth/?api_key=' . $lastfm_api_key;
	if (isset($lastfm_callback_url) && $lastfm_callback_url != '') {
		$vars['lastfm_auth_link'] .= '&cb=' . $lastfm_callback_url;
	}

	render('home', $vars);

?>