<?php
  require_once('inc/analytics.php');
  session_start();

  // Wipe session
  session_destroy();

  header('Content-Type: application/json');
  echo json_encode(array(
    'status' => 'ok'
  ));

  // Track event
  $ga = new Analytics();
  $ga->event('Session', 'Logout', 'Success');
