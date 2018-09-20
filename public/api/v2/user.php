<?php
  require('inc/session.php');

  header('Content-Type: application/json');

  if (!isset($_SESSION['key'])) {
    echo json_encode(array(
      'isLoggedIn' => false
    ));
    die();
  }

  require('inc/api.php');
  $userdata = array();

  // Try to get user info from session, otherwise query it
  if (!isset($_SESSION['userInfo'])) {
    $response = $api->call('user.getInfo');
    if (!$response) {
      require('inc/error.php');
      raiseOWSError('Last.fm is not available', 503);
    } else {
      $response = json_decode($response);
      if (array_key_exists('user', $response)) {
        $_SESSION['userInfo'] = $response->user;
      } else {
        require('inc/error.php');
        if (array_key_exists('error', $response) && array_key_exists('message', $response)) {
          raiseOWSError($response, 503);
        } else {
          raiseOWSError('Unknown Last.fm error', 503);
        }
      }
    }

    $_SESSION['uidHash'] = md5($_SESSION['userInfo']->name);
  }
  $userdata['user'] = $_SESSION['userInfo'];

  if (isset($_SESSION['settings'])) {
    $userdata['settings'] = $_SESSION['settings'];
  } else {
    require('inc/database.php');
    $db = new Database();
    $settings = $db->get_settings($_SESSION['userInfo']->name);
    if ($settings) {
      $_SESSION['settings'] = $settings;
      $userdata['settings'] = $settings;
    }
  }

  echo json_encode($userdata);
