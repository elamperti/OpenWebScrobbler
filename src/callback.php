<?php

    // Load the token and check if it looks good
    $token = $_GET['token'] ?: '';
    if (strlen($token) != 32) die('Bad token.');

    require('inc/api.php');
    require('inc/init.php');

    // Negotiates a session
    $response = $api->call('auth.getSession', array('token' => $token));   

    if ($response) {
        // Did Last.fm recognize the token?
        if ($response->attributes()['status'] == 'ok') {
            // Looks good, store the results in the session
            $_SESSION['username'] = strval($response->session->name);
            $_SESSION['key']      = strval($response->session->key);

            $user_data = $api->call('user.getInfo');
            if($user_data && isset($user_data->user->image)) {
                $_SESSION['avatar'] = strval($user_data->user->image);
            } else {
                print_r($user_data);
                die();
            }

            // Friendly welcome message
            // add_alert('success', 'Hello, ' . $response->session->name . '!');

        } else {
            // Tell the user there was a problem logging in
            add_alert('warning', 'Last.fm reported status: ' . $response->attributes()['status']);
        }

    } else {
        // There was no response (shouldn't happen)
        add_alert('error', 'Failed to get response from Last.fm');
    }

    session_write_close();
    header('Location: /'); // You can also point to index.php here

?>