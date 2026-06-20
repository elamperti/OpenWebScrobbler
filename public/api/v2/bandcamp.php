<?php
  require('inc/session.php');

  // Bandcamp artists use custom domains too, so we can't allowlist by host.
  // ponytail: auth-gated proxy + block obvious internal targets; doesn't resolve DNS,
  // so a public domain pointing at a private IP could still SSRF — add resolution if that matters.
  function isValidAlbumUrl($url) {
    $parts = parse_url($url);
    $scheme = $parts['scheme'] ?? '';
    $host = $parts['host'] ?? '';
    $ip = filter_var($host, FILTER_VALIDATE_IP);
    return $host &&
      ($scheme === 'https' || $scheme === 'http') &&
      strpos($host, '.') !== false && // reject no-dot internal names
      $host !== 'localhost' &&
      !($ip && !filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE));
  }

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
      if (!isset($_GET['album_url'])) {
        require('inc/error.php');
        raiseOWSError('Missing album url', 400, 611);
      }

      if (!isValidAlbumUrl($_GET['album_url'])) {
        require('inc/error.php');
        raiseOWSError('Invalid album url', 400, 612);
      }

      curl_setopt($ch, CURLOPT_URL, $_GET['album_url']);
      $html = curl_exec($ch);
      $ga->timing('Bandcamp Response Time', $method, curl_getinfo($ch, CURLINFO_TOTAL_TIME) * 1000);
      curl_close($ch);

      // Prefer the data-tralbum attribute
      if (preg_match('/data-tralbum="([^"]*)"/', $html, $m)) {
        $json = html_entity_decode($m[1], ENT_QUOTES);
      } elseif (preg_match('/var TralbumData\s*=\s*(\{.*?\});/s', $html, $m)) {
        $json = $m[1]; // older pages, not entity-encoded
      } else {
        require('inc/error.php');
        raiseOWSError('Could not parse Bandcamp page', 502, 613);
      }

      $decoded = json_decode($json);
      if ($decoded === null) {
        require('inc/error.php');
        raiseOWSError('Could not parse Bandcamp page', 502, 613);
      }

      echo json_encode($decoded);
    } elseif ($method === 'artist.getInfo') {
      if (!isset($_GET['artist_url'])) {
        require('inc/error.php');
        raiseOWSError('Missing artist url', 400, 615);
      }

      if (!isValidAlbumUrl($_GET['artist_url'])) {
        require('inc/error.php');
        raiseOWSError('Invalid artist url', 400, 612);
      }

      curl_setopt($ch, CURLOPT_URL, $_GET['artist_url']);
      $html = curl_exec($ch);
      $ga->timing('Bandcamp Response Time', $method, curl_getinfo($ch, CURLINFO_TOTAL_TIME) * 1000);
      curl_close($ch);

      // Scrape releases off the /music page. Cascade by layout, each yields real title + art
      // where the markup exposes it.
      $releases = [];
      $seen = [];
      $push = function ($url, $title, $art) use (&$releases, &$seen) {
        if (!$url || isset($seen[$url])) return;
        $seen[$url] = true;
        $releases[] = ['page_url' => $url, 'title' => trim(html_entity_decode($title, ENT_QUOTES)), 'art_url' => $art];
      };

      if (preg_match_all('~<li[^>]*class="[^"]*music-grid-item[^"]*"[^>]*>(.*?)</li>~s', $html, $lis)) {
        // Standard artist pages e.g. https://bucketheadpikes.bandcamp.com.
        foreach ($lis[1] as $li) {
          preg_match('~<a href="([^"]+)"~', $li, $href);
          // Lazy-loaded items carry a /img/0.gif placeholder in src and the real art in data-original.
          preg_match('~<img[^>]*\bdata-original="([^"]+)"~', $li, $img) || preg_match('~<img[^>]*\bsrc="([^"]+)"~', $li, $img);
          preg_match('~<p[^>]*class="[^"]*title[^"]*"[^>]*>\s*([^\n<]+)~', $li, $title);
          $push($href[1] ?? null, $title[1] ?? '', $img[1] ?? null);
        }
      } elseif (preg_match_all('~<div[^>]*class="ipCell"[^>]*>(.*?)</div>\s*</div>~s', $html, $cells)) {
        // Some customized pages e.g. https://amandapalmer.bandcamp.com.
        foreach ($cells[1] as $cell) {
          preg_match('~href="([^"]+)"~', $cell, $href);
          preg_match('~<img[^>]*\bdata-original="([^"]+)"~', $cell, $img) || preg_match('~<img[^>]*\bsrc="([^"]+)"~', $cell, $img);
          preg_match('~<div[^>]*class="ipCellLabel1"[^>]*><a[^>]*>([^<]+)</a>~', $cell, $title);
          $push($href[1] ?? null, $title[1] ?? '', $img[1] ?? null);
        }
      }

      // last resort for unknown layouts — scan for album/track anchors, no artwork.
      if (empty($releases) && preg_match_all('~href="/(album|track)/([^"?#]+)"~', $html, $links, PREG_SET_ORDER)) {
        foreach ($links as $link) {
          $push('/' . $link[1] . '/' . $link[2], str_replace('-', ' ', $link[2]), null);
        }
      }

      $name = preg_match('/data-band="([^"]*)"/', $html, $band)
        ? (json_decode(html_entity_decode($band[1], ENT_QUOTES))->name ?? null)
        : null;

      if (empty($releases)) {
        require('inc/error.php');
        raiseOWSError('Could not parse Bandcamp page', 502, 613);
      }

      echo json_encode(['name' => $name, 'releases' => $releases]);
    } else {
      require('inc/error.php');
      raiseOWSError('Unknown method', 400, 614);
    }
  } else {
    require('inc/error.php');
    raiseOWSError('Invalid session key', 401, 601);
  }
