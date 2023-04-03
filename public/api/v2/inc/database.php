<?php
  if (basename(__FILE__) == basename($_SERVER['SCRIPT_FILENAME'])) {
    die();
  }

  require_once('analytics.php');

  function mapBoolToInt($bool) {
    return $bool ? 1 : 0;
  }

  class Database {
    private $db;

    function __construct() {
      $this->db = pg_connect(
        "host=".getenv('NEW_DB_HOST') .
        " port=".getenv('NEW_DB_PORT') .
        " dbname=".getenv('NEW_DB_NAME') .
        " user=".getenv('NEW_DB_USER') .
        " password=".getenv('NEW_DB_PASS') .
        " sslmode=require"
      );
      if ($this->db === false) {
        require('inc/error.php');
        raiseOWSError('Database unavailable', 503);
      }
    }

    function get_settings($username) {
      $normalized_username = strtolower($username);
      $query = <<<SQL
        SELECT
          s.*,
          CASE
            WHEN sub.username IS NOT NULL THEN true
            ELSE false
          END AS active_subscription
        FROM
          openscrobbler.settings s
        LEFT JOIN
          openscrobbler.subscriptions sub ON s.username = sub.username
        WHERE
          s.username = $1;
SQL;

      $result = pg_query_params($this->db, $query, array($normalized_username));

      $ga = new Analytics();
      $ga->event('Settings', 'Load', pg_num_rows($result) ? 'Hit' : 'Miss');

      $settings = array();

      if (pg_num_rows($result)) {
        $row = pg_fetch_assoc($result);

        $settings['username'] = $row['username'];
        $settings['catchPaste'] = $row['catchpaste'] === 't' ? true : false;
        $settings['use12Hours'] = $row['use12hours'] === 't' ? true : false;
        $settings['lang'] = trim($row['lang']);
        $settings['dataProvider'] = $row['dataprovider'];
        $settings['patreonId'] = $row['patreonid'];
        $settings['activeSubscription'] = $row['active_subscription'] === 't' ? true : false;

      } else {
        // DEFAULT SETTINGS FOR USERS WITH NO SETTINGS
        $settings['username'] = $normalized_username;
        $settings['catchPaste'] = true;
        $settings['use12Hours'] = false;
        $settings['lang'] = 'auto';
        $settings['dataProvider'] = 'discogs';
        $settings['patreonId'] = null;
        $settings['activeSubscription'] = false;
      }

      return $settings;
    }

    function init_user($username, $registered_timestamp) {
      $normalized_username = strtolower($username);

      $query = <<<SQL
        INSERT INTO openscrobbler.settings (username, lastfmregistered, lastseen)
        VALUES ($1, $2, NOW())
        ON CONFLICT (username) DO UPDATE
        SET lastfmregistered = $2, lastseen = NOW()
SQL;

      $result = pg_query_params($this->db, $query, array($normalized_username, $registered_timestamp));

      $ga = new Analytics();
      $ga->event('Settings', 'Init');

      return $result;
    }

    function save_settings($username, $settings) {
      $normalized_username = strtolower($username);
      $catchPaste = mapBoolToInt(isset($settings['catchPaste']) ? $settings['catchPaste'] : true);
      $use12Hours = mapBoolToInt(isset($settings['use12Hours']) ? $settings['use12Hours'] : false);
      $lang = (isset($settings['lang']) && trim($settings['lang']) !== '') ? $settings['lang'] : 'auto';
      $dataProvider = (isset($settings['dataProvider']) && trim($settings['dataProvider']) !== '') ? $settings['dataProvider'] : 'discogs';
      $patreonId = (isset($settings['patreonId']) && trim($settings['patreonId']) !== '') ? $settings['patreonId'] : null;

      $query = <<<SQL
          INSERT INTO settings (username, catchPaste, use12Hours, lang, dataProvider, patreonId, lastseen)
          VALUES ($1, $2::boolean, $3::boolean, $4, $5, $6, NOW())
          ON CONFLICT (username) DO UPDATE
          SET catchPaste = $2::boolean, use12Hours = $3::boolean, lang = $4, dataProvider = $5, patreonId = $6, lastseen = NOW()
SQL;

      $result = pg_query_params(
        $this->db,
        $query,
        array($normalized_username, $catchPaste, $use12Hours, $lang, $dataProvider, $patreonId)
      );

      $ga = new Analytics();
      $ga->event('Settings', 'Save');

      return $result;
    }

    function save_patreon_id($username, $patreonId) {
      $normalized_username = strtolower($username);

      $query = <<<SQL
        UPDATE settings
        SET patreonId = $1
        WHERE username = $2
SQL;

      $ga = new Analytics();
      $ga->event('Settings', 'Patreon');

      $result = pg_query_params($this->db, $query, array($patreonId, $normalized_username));

      $_SESSION['settings']['patreonId'] = $patreonId;

      return true;
    }

    function enable_subscription($username, $source) {
      $normalized_username = strtolower($username);

      $query = <<<SQL
        INSERT INTO subscriptions (username, source)
        VALUES ($1, $2)
        ON CONFLICT (username) DO NOTHING
SQL;

      $result = pg_query_params($this->db, $query, array($normalized_username, $source));

      return $result;
    }
  }


