<?php

    require('inc/init.php');
    require('inc/config.php');

    if (isset($_GET['logout'])) {
        logout();
    }

    $vars = [];

    // Auth link
    $vars['lastfm_auth_link'] = 'http://www.last.fm/api/auth/?api_key=' . $lastfm_api_key;
    if (isset($lastfm_callback_url) && $lastfm_callback_url != '') {
        $vars['lastfm_auth_link'] .= '&cb=' . $lastfm_callback_url;
    }

    // Google Analytics UA-XXXXXX-XX code
    if (isset($analytics_tracking) && $analytics_tracking != '') {
        $vars['analytics_tracking'] = $analytics_tracking;
    }

    // Routing
    $dest = 'home'; // default

    if (isset($_GET['dest'])) {
        $request = array_map('strtolower', explode('/', $_GET['dest']));
        switch ($request[0]) {
            // case 'home':
            //     $dest = 'home';
            //     break;
            case 'about':
                $dest = 'about';
                break;

            default:
                header("HTTP/1.0 404 Not Found");
                include('error.php');
                exit;
        }
    }

    render($dest, $vars);

?>
