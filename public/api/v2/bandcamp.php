<?php
  require('inc/session.php');

  if (isset($_SESSION['key'])) {
    require('inc/analytics.php');
    $ga = new Analytics();

    header('Content-Type: application/json');

    $method = isset($_GET['method']) ? $_GET['method'] : '';
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_USERAGENT, 'OpenScrobbler/2.0');

    if ($method === 'album.search' || $method === 'artist.search') {
      if (!isset($_GET['q'])) {
        require('inc/error.php');
        raiseOWSError('Missing query', 400, 610);
      }

      // a = albums, t = tracks, b = bands/artists
      $filter = $method === 'artist.search' ? 'b' : (!empty($_GET['include_tracks']) ? 'a,t' : 'a');

      curl_setopt($ch, CURLOPT_URL, 'https://bandcamp.com/api/bcsearch_public_api/1/autocomplete_elastic');
      curl_setopt($ch, CURLOPT_POST, true);
      curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
      curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        'search_text' => $_GET['q'],
        'search_filter' => $filter,
        'full_page' => false,
      ]));

      $response = curl_exec($ch);
      $ga->timing('Bandcamp Response Time', $method, curl_getinfo($ch, CURLINFO_TOTAL_TIME) * 1000);
      curl_close($ch);

      echo $response;
    } elseif ($method === 'album.getInfo') {
      if (!isset($_GET['band_id']) || !isset($_GET['tralbum_id']) || !isset($_GET['tralbum_type'])) {
        require('inc/error.php');
        raiseOWSError('Missing params', 400, 611);
      }

      $tralbum_type = $_GET['tralbum_type'];
      if ($tralbum_type !== 'a' && $tralbum_type !== 't') {
        require('inc/error.php');
        raiseOWSError('Invalid tralbum_type', 400, 612);
      }

      $url = 'https://bandcamp.com/api/mobile/25/tralbum_details'
        . '?band_id=' . urlencode($_GET['band_id'])
        . '&tralbum_id=' . urlencode($_GET['tralbum_id'])
        . '&tralbum_type=' . urlencode($tralbum_type);

      curl_setopt($ch, CURLOPT_URL, $url);
      $response = curl_exec($ch);
      $ga->timing('Bandcamp Response Time', $method, curl_getinfo($ch, CURLINFO_TOTAL_TIME) * 1000);
      curl_close($ch);

      echo $response;
    } elseif ($method === 'artist.getInfo') {
      if (!isset($_GET['band_id'])) {
        require('inc/error.php');
        raiseOWSError('Missing band_id', 400, 615);
      }

      $url = 'https://bandcamp.com/api/mobile/25/band_details?band_id=' . urlencode($_GET['band_id']);

      curl_setopt($ch, CURLOPT_URL, $url);
      $response = curl_exec($ch);
      $ga->timing('Bandcamp Response Time', $method, curl_getinfo($ch, CURLINFO_TOTAL_TIME) * 1000);
      curl_close($ch);

      echo $response;
    } else {
      require('inc/error.php');
      raiseOWSError('Unknown method', 400, 614);
    }
  } else {
    require('inc/error.php');
    raiseOWSError('Invalid session key', 401, 601);
  }
