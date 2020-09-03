<?php

  if (true || isset($_SESSION['key'])) {
    if (isset($_GET['method'])) {
      switch ($_GET['method']) {
        case 'album.search':
        case 'artist.search':
          $endpoint = 'database/search';
          break;

        case 'album.getInfo':
          if (!isset($_GET['album_id']) || !is_numeric($_GET['album_id'])) {
            require('inc/error.php');
            raiseOWSError('Missing artist id', 400, 605);
          }

          $endpoint = 'masters/' . $_GET['album_id'];
          unset($_GET['album_id']);
          break;

        case 'artist.getTopAlbums':
          if (!isset($_GET['artist_id']) || !is_numeric($_GET['artist_id'])) {
            require('inc/error.php');
            raiseOWSError('Missing artist id', 400, 604);
          }

          $endpoint = 'artists/' . $_GET['artist_id'] . '/releases';
          unset($_GET['artist_id']);
          break;

        default:
          require('inc/error.php');
          raiseOWSError('Invalid method', 400, 603);
      }

      // This one is used internally to map `method` to the target endpoint in the URL
      unset($_GET['method']);
    } else {
      require('inc/error.php');
      raiseOWSError('Invalid method', 400, 602);
    }

    $discogsrq = curl_init();
    curl_setopt($discogsrq, CURLOPT_USERAGENT, 'OpenScrobbler/2.0');
    curl_setopt($discogsrq, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($discogsrq, CURLOPT_HTTPHEADER, ["REMOTE_ADDR: $_SERVER[REMOTE_ADDR]", "HTTP_X_FORWARDED_FOR: $_SERVER[REMOTE_ADDR]"]);

    $params = array();
    $params['key'] = getenv('DISCOGS_API_KEY');
    $params['secret'] = getenv('DISCOGS_SECRET');
    $params = array_merge($params, $_GET);

    $qs = http_build_query($params);
    curl_setopt($discogsrq, CURLOPT_URL, 'https://api.discogs.com' . '/' . $endpoint . '?' . $qs);

    $response = curl_exec($discogsrq);
    header('Content-Type: ' . curl_getinfo($discogsrq, CURLINFO_CONTENT_TYPE));

    require_once('inc/analytics.php');
    $ga = new Analytics();
    $ga->timing('Discogs Response Time', $method, round(curl_getinfo($discogsrq, CURLINFO_TOTAL_TIME) * 1000));

    curl_close($discogsrq);
    echo $response;
  } else {
    require('inc/error.php');
    raiseOWSError('Invalid session key', 401, 601);
  }
