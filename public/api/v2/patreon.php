<?php
  require('inc/session.php');

  if (isset($_SESSION['key'])) {
    if (isset($_POST['method'])) {
      $method = $_POST['method'];

      $patreonrq = curl_init();
      switch ($method) {
        case 'callback':
          if (!isset($_POST['code'])) {
            require('inc/error.php');
            raiseOWSError('Invalid payload', 400, 605);
          }

          $params = [
            'client_id' => getenv('PATREON_CLIENT_ID'),
            'client_secret' => getenv('PATREON_CLIENT_SECRET'),
            'redirect_uri' => getenv('PATREON_REDIRECT_URI'),
            'code' => $_POST['code'],
            'grant_type' => 'authorization_code'
          ];

          curl_setopt_array($patreonrq, array(
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_USERAGENT => 'OpenScrobbler/2.0',
            CURLOPT_HTTPHEADER => ['Content-type: application/x-www-form-urlencoded'],
            CURLOPT_URL => 'https://www.patreon.com/api/oauth2/token',
            CURLOPT_POST => true,
            CURLOPT_TIMEOUT_MS => 2000,
            CURLOPT_POSTFIELDS => http_build_query($params)
          ));

          $response = curl_exec($patreonrq);
          $response = json_decode($response, true);

            if (isset($response['access_token'])) {
            $memberrq = curl_init();

            $params = http_build_query([
              'include' => 'memberships',
              'fields[member]' => 'patron_status',
            ]);
            curl_setopt_array($memberrq, array(
              CURLOPT_RETURNTRANSFER => true,
              CURLOPT_USERAGENT => 'OpenScrobbler/2.0',
              CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $response['access_token']],
              CURLOPT_URL => 'https://www.patreon.com/api/oauth2/v2/identity?' . $params,
            ));

            $patreon_response = curl_exec($memberrq);
            $member = json_decode($patreon_response, true);

            $patreon_id = $member['data']['id'];

            if (!$patreon_id) {
              echo json_encode($member);
              require('inc/error.php');
              raiseOWSError('Member ID not found', 500, 610);
            }

            require('inc/database.php');
            $db = new Database();
            $db->save_patreon_id($_SESSION['userInfo']->name, $patreon_id);

            $is_active = isset($member['included'][0]['attributes']['patron_status']) && $member['included'][0]['attributes']['patron_status'] === 'active_patron';

            if ($is_active) {
              $db->enable_subscription($_SESSION['userInfo']->name, 'patreon');
              $_SESSION['settings']['activeSubscription'] = true;
            }

            echo json_encode([
              'status' => 'ok',
              'patreonId' => $patreon_id,
              'active' => $is_active,
              // 'token' => $response['access_token']
            ]);
          } else {
            require('inc/error.php');
            raiseOWSError('Unauthorized', 401, 606);
          }
          break;

          default:
          require('inc/error.php');
          raiseOWSError('Invalid method', 400, 603);
        }

        // This one is used internally to map `method` to the target endpoint in the URL
        unset($_POST['method']);
    } else {
      require('inc/error.php');
      raiseOWSError('Invalid payload', 400, 602);
    }

  } else {
    require('inc/error.php');
    raiseOWSError('Invalid session key', 401, 601);
  }
