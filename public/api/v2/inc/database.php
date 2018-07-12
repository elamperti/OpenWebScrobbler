<?php
  if (basename(__FILE__) == basename($_SERVER['SCRIPT_FILENAME'])) {
    die();
  }

  require_once('analytics.php');

  class Database {
    private $db;

    function __construct() {
      $this->db = new SQLite3(getenv('SQLITE_DB_PATH'));
      if (!$this->db) {
        var_dump($this->db);
        require('inc/error.php');
        raiseOWSError('Database unavailable', 503);
      }
    }

    function get_settings($username) {
      $q = $this->db->prepare('SELECT * FROM "settings" WHERE username = :username;');
      $q->bindValue(':username', $username);
      $result = $q->execute();

      $ga = new Analytics();
      $ga->event('Settings', 'Load', $result ? 'Hit' : 'Miss');

      if ($result) {
        $settings = $result->fetchArray(SQLITE3_ASSOC);
        return $settings;
      } else {
        return false;
      }
    }

    function save_settings($username, $settings) {
      $q = $this->db->prepare('REPLACE INTO "settings" (username, catchPaste, use12Hours, lang)
                                VALUES (:username, :catchPaste, :use12Hours, :lang);');

      $q->bindValue(':username', $username);
      $q->bindValue(':lang', $settings['lang'], SQLITE3_TEXT);
      $q->bindValue(':catchPaste', $settings['catchPaste'], SQLITE3_INTEGER);
      $q->bindValue(':use12Hours', $settings['use12Hours'], SQLITE3_INTEGER);

      $result = $q->execute();

      $ga = new Analytics();
      $ga->event('Settings', 'Save');

      return $result;
    }
  }
