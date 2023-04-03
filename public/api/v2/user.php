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
      if (property_exists($response, 'user')) {
        $_SESSION['userInfo'] = $response->user;

        require('inc/database.php');
        $db = new Database();
        $db->init_user($_SESSION['userInfo']->name, $_SESSION['userInfo']->registered->unixtime);
      } else {
        require('inc/error.php');
        if (property_exists($response, 'error') && property_exists($response, 'message')) {
          raiseOWSError($response, 503);
        } else {
          raiseOWSError('Unknown Last.fm error', 503);
        }
      }
    }

    $_SESSION['uidHash'] = md5($_SESSION['userInfo']->name);
  }

  $userdata['user'] = $_SESSION['userInfo'];


  echo json_encode($userdata);
