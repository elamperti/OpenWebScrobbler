<?php
  if (isset($_GET['setlistId'])) {
    $sanitized_setlistId = filter_var($_GET['setlistId'], FILTER_SANITIZE_STRING);
    $endpoint = 'setlist/' . $_GET['setlistId'];
  } else if (isset($_GET['artistName'])) {
    $sanitized_artistName = filter_var($_GET['artistName'], FILTER_SANITIZE_STRING);
    $endpoint = 'search/setlists?artistName=' . urlencode($sanitized_artistName);

    if (isset($_GET['page'])) {
      $sanitized_p = filter_var($_GET['page'], FILTER_SANITIZE_NUMBER_INT);
      $endpoint .= '&p=' . $sanitized_p;
    }
  } else {
    require('inc/error.php');
    raiseOWSError('No setlist ID provided', 404, 620);
  }

    $setlistfmrq = curl_init();

    curl_setopt($setlistfmrq, CURLOPT_HTTPHEADER, [
      "REMOTE_ADDR: " . $_SERVER['REMOTE_ADDR'],
      "HTTP_X_FORWARDED_FOR: " . $_SERVER['REMOTE_ADDR'],
      "Accept: application/json",
      "x-api-key: " . getenv('SETLISTFM_API_KEY')
    ]);
    curl_setopt($setlistfmrq, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($setlistfmrq, CURLOPT_URL, 'https://api.setlist.fm/rest/1.0/' . $endpoint);

    $response = curl_exec($setlistfmrq);
    header('Content-Type: ' . curl_getinfo($setlistfmrq, CURLINFO_CONTENT_TYPE));

    require_once('inc/analytics.php');
    $ga = new Analytics();
    $ga->timing('Setlist.fm Response Time', $method, round(curl_getinfo($setlistfmrq, CURLINFO_TOTAL_TIME) * 1000));

    curl_close($setlistfmrq);
    echo $response;

