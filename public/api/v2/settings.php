<?php
  require('inc/session.php');

  header('Content-Type: application/json');

  if (!isset($_SESSION['key'])) {
    require('inc/error.php');
    raiseOWSError('Invalid session key', 401, 9);
  }

  if ($_SERVER['REQUEST_METHOD'] === 'POST') {

  function filter_and_assign($var, &$ref, $filter, $options, $custom_filter=NULL) {
    if (isset($_POST[$var])) {
      $filtered = filter_var($_POST[$var], $filter, $options);

      if (is_callable($custom_filter) && !is_null($filtered)) {
        $filtered = $custom_filter($filtered);
      }

      if (!is_null($filtered)) {
        $ref[$var] = $filtered;
      }
    }
  }

  $new_settings = isset($_SESSION['settings']) ? $_SESSION['settings'] : array();

  filter_and_assign('catchPaste', $new_settings, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
  filter_and_assign('use12Hours', $new_settings, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
  filter_and_assign('keepOriginalTimestamp', $new_settings, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
  filter_and_assign('showTrackNumbers', $new_settings, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
  filter_and_assign('lang', $new_settings, FILTER_SANITIZE_STRING, FILTER_FLAG_EMPTY_STRING_NULL, function($str) {
    if (strlen($str) > 5) return NULL;
    $str = strtolower($str);
    // Test cases: https://regex101.com/r/eaWcrH/1
    if (!preg_match('/^(?:auto|[a-z]{2}(?:[a-z]|-[A-Z]{2})?)$/', $str)) return NULL;
    return $str;
  });
  filter_and_assign('dataProvider', $new_settings, FILTER_SANITIZE_STRING, FILTER_FLAG_EMPTY_STRING_NULL, function($str) {
    switch (strtolower($str)) {
      case 'discogs':
        return 'discogs';
      case 'lastfm':
        return 'lastfm';
      default:
        return NULL;
    }
  });

  $_SESSION['settings'] = $new_settings;
  session_write_close();

  require('inc/database.php');
  $db = new Database();
  $_SESSION['settings']['saved'] = !!$db->save_settings($_SESSION['userInfo']->name, $new_settings);

  } // IF POST
  else {
    if (!$_SESSION['settings']) {
      require('inc/database.php');
      $db = new Database();
      $settings = $db->get_settings($_SESSION['userInfo']->name);
      if ($settings) {
        $_SESSION['settings'] = $settings;
      } else {
        require('inc/error.php');
        raiseOWSError('User settings not found', 404, 9);
      }
    }
  }

  echo json_encode($_SESSION['settings']);

