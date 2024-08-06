<?php
  if (isset($_GET['setlist_id'])) {
    $params = array();
    $endpoint = 'setlist/' . $_GET['setlist_id'];

    $setlistfmrq = curl_init();

    // curl_setopt($setlistfmrq, CURLOPT_USERAGENT, 'OpenScrobbler/2.0'); 
    curl_setopt($setlistfmrq, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($setlistfmrq, CURLOPT_HTTPHEADER, ["REMOTE_ADDR: $_SERVER[REMOTE_ADDR]", "HTTP_X_FORWARDED_FOR: $_SERVER[REMOTE_ADDR]"]);
    curl_setopt($setlistfmrq, CURLOPT_HTTPHEADER, ["x-api-key: " . getenv('SETLISTFM_API_KEY')]);

    // $params['key'] = getenv('SETLISTFM_API_KEY');

    $qs = http_build_query($params);

    $fullRequest = 'https://api.setlist.fm/rest/1.0' . '/' . $endpoint . '?' . $qs;

    curl_setopt($setlistfmrq, CURLOPT_URL, $fullRequest);
    
    $response = curl_exec($setlistfmrq);
    header('Content-Type: ' . curl_getinfo($setlistfmrq, CURLINFO_CONTENT_TYPE));
  
    require_once('inc/analytics.php');
    $ga = new Analytics();
    $ga->timing('Setlist.fm Response Time', $method, round(curl_getinfo($setlistfmrq, CURLINFO_TOTAL_TIME) * 1000));

    curl_close($setlistfmrq);
    echo $response;
  } else {
    require('inc/error.php');
    raiseOWSError('No setlist ID provided', 404, 602);
  }
