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

	// Even simpler render calls
	function render($template='home', $vars=array()) {
		global $twig;
		echo $twig->render("$template.twig", $vars);
	}

?>