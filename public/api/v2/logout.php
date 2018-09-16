<?php
  session_start();

  // Wipe session
  session_destroy();

  header('Content-Type: application/json');
  echo json_encode(array(
    'status' => 'ok'
  ));

  // Track event
  require_once('inc/analytics.php');
  $ga = new Analytics();
  $ga->event('Session', 'Logout', 'Success');
