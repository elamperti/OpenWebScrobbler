<?php
  if (basename(__FILE__) == basename($_SERVER['SCRIPT_FILENAME'])) {
    die();
  }

  $session_duration = 3600 * 24 * 30; // Sessions will (hopefully) last for a month
  ini_set('session.gc_maxlifetime', $session_duration);
  session_set_cookie_params($session_duration);
  session_start();
