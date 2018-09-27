<?php

  require('inc/session.php');
  require('inc/api.php');

  date_default_timezone_set('Etc/UCT');

  header('Content-Type: application/json');

  function check_timestamp($timestamp) {
    $timestamp = strtotime($timestamp);
    $current_time = time();
    $min = $current_time - 14*24*3600;
    $max = $current_time + 14*24*3600;
    if(!$timestamp || $timestamp < $min || $max < $timestamp) {
      $timestamp = $current_time;
    }
    return $timestamp;
  }

  if (isset($_SESSION['key'])) {
    if (isset($_POST['artist']) && isset($_POST['track'])) {

      $track_info = array(
        'artist'  => array_map('trim', $_POST['artist']),
        'track'   => array_map('trim', $_POST['track']),
        'timestamp' => array_map('check_timestamp', $_POST['timestamp'])
      );

      if (isset($_POST['album'])) {
        $track_info['album'] = array_map('trim', $_POST['album']);
      }

      if (isset($_POST['albumArtist'])) {
        $track_info['albumArtist'] = array_map('trim', $_POST['albumArtist']);
      }


      // All ready, call the API
      $response = $api->call('track.scrobble', $track_info, true);

      // Client-side script will take it from here
      echo $response;
      ob_end_flush();

      // Track event
      require_once('inc/analytics.php');
      $ga = new Analytics();
      $ga->event('Scrobbles', 'Manual', sizeof($_POST['track']));

      die();

    } else {
      require('inc/error.php');
      raiseOWSError('Artist or title missing', 400);
    }
  } else {
    require('inc/error.php');
    raiseOWSError('Invalid session key', 401);
  }
