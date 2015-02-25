<?php

	// Don't allow users to call this file directly
	if (basename(__FILE__) == basename($_SERVER['SCRIPT_FILENAME'])) {
		die();
	}

	// Composer autoload
	require('vendor/autoload.php');

	// Twig setup
	$loader = new Twig_Loader_Filesystem('views');
	$twig = new Twig_Environment($loader, array(
	    //'cache' => 'cache',
	));

	// Define alert levels and types
	$_alerts = array(
		'error' => array(
			'level' => 'danger',
			'icon' => 'remove-circle'
		),
		'warning' => array(
			'level' => 'warning',
			'icon' => 'exclamation-sign'
		),
		'info' => array(
			'level' => 'info',
			'icon' => 'info-sign'
		),
		'success' => array(
			'level' => 'success',
			'icon' => 'ok'
		),
	);

	// Rudimentary alert generator
	function add_alert($level, $message) {
		global $_alerts;

		$_SESSION['alerts'][] = array(
			'type' => $_alerts[$level],
			'message' => $message
		);
	}

	// Start session
	session_start();

	// Create alert list if it doesn't exist
	if (!isset($_SESSION['alerts'])) {
		 $_SESSION['alerts'] = array(/* array(type, message) */);
	}

	// Logout
	function logout() {
		// Wipe session
		session_destroy();
		session_write_close();
		header('Location: /');
	}

	// Even simpler render calls
	function render($template='home', $vars=array()) {
		global $twig;

		// Attach alert messages, if any, and remove them from the session
		if (count($_SESSION['alerts'])) {
			$vars['alerts'] = $_SESSION['alerts'];
			unset($_SESSION['alerts']);
		}

		// The username.
		if (isset($_SESSION['username'])) {
			$vars['username'] = $_SESSION['username'];
		}

		// aaand the image.
		if (isset($_SESSION['avatar'])) {
			$vars['avatar_url'] = $_SESSION['avatar'];
		}

		echo $twig->render("$template.twig", $vars);
	}
