<?php

  if (basename(__FILE__) == basename($_SERVER['SCRIPT_FILENAME'])) {
    die();
  }

  require_once('session.php');

  class Analytics {
    function _call($type, $payload) {
      $analytics_tracking_code = getenv('REACT_APP_ANALYTICS_CODE');

      if ($analytics_tracking_code !== false) {
        $curl = curl_init();

        $payload['v'] = 1;
        $payload['tid'] = $analytics_tracking_code;
        $payload['cid'] = session_id();
        $payload['uid'] = isset($_SESSION['uidHash']) ? $_SESSION['uidHash'] : '';
        $payload['uip'] = array_key_exists('HTTP_X_FORWARDED_FOR', $_SERVER) ? $_SERVER['HTTP_X_FORWARDED_FOR'] : $_SERVER['REMOTE_ADDR'];
        $payload['t'] = $type;

        curl_setopt_array($curl, array(
          CURLOPT_RETURNTRANSFER => true,
          CURLOPT_USERAGENT => 'OpenScrobbler/2.0',
          CURLOPT_HTTPHEADER => ['Content-type: application/x-www-form-urlencoded'],
          CURLOPT_URL => 'https://www.google-analytics.com/collect',
          CURLOPT_POST => true,
          CURLOPT_TIMEOUT_MS => 1000,
          CURLOPT_POSTFIELDS => http_build_query($payload)
        ));

        return curl_exec($curl);
      }
    }

    function event($event_category, $event_action, $value=1) {
      $payload = array(
        'ec' => $event_category,
        'ea' => $event_action
      );

      // ToDo: refactor to support values/labels properly
      $value_or_label = is_numeric($value) ? 'ev' : 'el';
      $payload[$value_or_label] = $value;

      $this->_call('event', $payload);
    }

    function timing($timing_category, $timing_variable, $timing_time_ms) {
      $payload = array(
        'utc' => $timing_category,
        'utv' => $timing_variable,
        'utt' => $timing_time_ms
      );

      $this->_call('timing', $payload);
    }
  }
