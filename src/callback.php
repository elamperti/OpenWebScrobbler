<?php

    // Load the token and check if it looks good
    $token = $_GET['token'] ?: '';
    if (strlen($token) != 32) die('Bad token.');

    require('inc/api.php');
    require('inc/init.php');

    // Negotiates a session
    $response = $api->call('auth.getSession', array('token' => $token));   

    if ($response) {
        // Parse the XML response
        $xml = simplexml_load_string($response);

        // Did Last.fm recognize the token?
        if (isset($xml) && $xml->attributes()['status'] == 'ok') {
            // Looks good, store the results in the session
            $_SESSION['username'] = strval($xml->session->name);
            $_SESSION['key']      = strval($xml->session->key);

            // Friendly welcome message
            add_alert('success', 'Hello, ' . $xml->session->name . '!');

        } else {
            // Tell the user there was a problem logging in
            add_alert('warning', 'Last.fm reported status: ' . $xml->attributes()['status']);
        }

    } else {
        // There was no response (shouldn't happen)
        add_alert('error', 'Failed to get response from Last.fm');
    }

    session_write_close();
    header('Location: /'); // You can also point to index.php here

?>