<?php
  $token = $_POST['token'] ?: '';
  if (strlen($token) != 32) {
    require('inc/error.php');
    raiseOWSError('Bad token' . $_POST['token'], 400);
  }

  require('inc/session.php');

  if (isset($_SESSION['key'])) {
    require('inc/error.php');
    raiseOWSError('Already logged in', 409);
  }

  header('Content-Type: application/json');
  require('inc/api.php');
  require_once('inc/analytics.php');

  $response = $api->call('auth.getSession', array('token' => $token));

  if ($response) {
    $response = json_decode($response);
    $ga = new Analytics();

    if (array_key_exists('session', $response)) {
      $_SESSION['username'] = strval($response->session->name);
      $_SESSION['key'] = strval($response->session->key);
      session_write_close();
      echo json_encode(array(
        'status' => 'ok'
      ));
      ob_end_flush();

      $ga->event('Session', 'Login', 'Success');
    } else {
      $ga->event('Session', 'Login', 'Failure');
      require('inc/error.php');
      raiseOWSError('Last.fm authentication failed', 503);
    }
  } else {
    require('inc/error.php');
    raiseOWSError('Last.fm is not available', 503);
  }
