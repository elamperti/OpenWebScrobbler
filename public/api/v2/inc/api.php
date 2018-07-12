<?php

  // Don't allow users to call this file directly
  if (basename(__FILE__) == basename($_SERVER['SCRIPT_FILENAME'])) {
    die();
  }

  class APICall {
    private $curl;

    function call($method, $params=array(), $usePOST=false) {
      $url = "https://ws.audioscrobbler.com/2.0/?";
      $query = $this->prepare($method, $params);

      $this->curl = curl_init($url);

      // cURL bells and whistles
      if ($usePOST) {
        curl_setopt($this->curl, CURLOPT_POST, true);
        curl_setopt($this->curl, CURLOPT_POSTFIELDS, $query);
      } else {
        curl_setopt($this->curl, CURLOPT_URL, $url . $query);
      }

      curl_setopt($this->curl, CURLOPT_USERAGENT, 'OpenScrobbler/2.0');
      curl_setopt($this->curl, CURLOPT_FOLLOWLOCATION, true);
      curl_setopt($this->curl, CURLOPT_RETURNTRANSFER, true);

      // fetch
      $response = curl_exec($this->curl);

      require_once('inc/analytics.php');
      $ga = new Analytics();
      $ga->timing('Last.fm Response Time', $method, round(curl_getinfo($this->curl, CURLINFO_TOTAL_TIME) * 1000));

      curl_close($this->curl);

      return $response;
    }

    function get_signature($params) {
      // Reminder: 'callback' and 'format' params MUST not be present in signature params!
      $signature = '';

      // The API requires sorted parameters in the signature
      ksort($params);

      // Concatenate all the sorted items
      foreach($params as $key => $val) {
        $signature .= $key . $val;
      }

      // Append the API secret
      $signature .= getenv('LASTFM_SECRET');

      // Return the signature
      return md5($signature);
    }

    function prepare($method, $params) {
      // Process arrays so they can be properly handled and sorted
      foreach ($params as $param => $value) {
        if (is_array($value)) {
          // Flatten the array to a bunch of keys
          $params = array_merge($params, $this->flatten_array($param, $value));
          // Pop the original parameter containing the array
          unset($params[$param]);
        }
      }

      // Filling in the blanks
      $params['method'] = $method;
      $params['api_key'] = getenv('LASTFM_API_KEY');

      // If there's a session key, attach it
      if (isset($_SESSION['key'])) {
        $params['sk'] = $_SESSION['key'];
      }

      // Add the signature
      $params['api_sig'] = $this->get_signature($params);
      $params['format'] = 'json'; // This must be set after signature

      return http_build_query($params);
    }

    function flatten_array($key, $a) {
      $result = [];

      for ($i=0; $i < sizeof($a); $i++) {
        if (!empty($a[$i])) {
          $result[$key . "[$i]"] = $a[$i];
        }
      }

      return $result;
    }

  }

  $api = new APICall();
