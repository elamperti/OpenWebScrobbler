<?php
  session_start();

  header('Content-Type: application/json');

  // Wipe session
  session_destroy();

  echo json_encode(array(
    'status' => 'ok'
  ));
  ob_end_flush();

  // Track event
  require_once('inc/analytics.php');
  $ga = new Analytics();
  $ga->event('Session', 'Logout', 'Success');
