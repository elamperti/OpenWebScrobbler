<?php
  if (basename(__FILE__) == basename($_SERVER['SCRIPT_FILENAME'])) {
    die();
  }

  require_once('analytics.php');

  class Database {
    private $db;

    function __construct() {
      $this->db = mysqli_init();
      $this->db->options(MYSQLI_OPT_SSL_VERIFY_SERVER_CERT, false);
      $this->db->real_connect(
        getenv('NEW_DB_HOST'),
        getenv('NEW_DB_USER'),
        getenv('NEW_DB_PASS'),
        getenv('NEW_DB_NAME'),
        NULL,
        NULL,
        MYSQLI_CLIENT_SSL
      );
      if ($this->db->connect_errno) {
        require('inc/error.php');
        raiseOWSError('Database unavailable', 503);
      }
    }

    function get_settings($username) {
      $normalized_username = strtolower($username);
      $q = $this->db->prepare('SELECT * FROM `settings` WHERE username = ?');
      $q->bind_param('s', $normalized_username);
      $q->execute();
      $result = $q->get_result();

      $ga = new Analytics();
      $ga->event('Settings', 'Load', $result->num_rows ? 'Hit' : 'Miss');

      if ($result->num_rows) {
        $settings = $result->fetch_assoc();
        return $settings;
      } else {
        return false;
      }
    }

    function save_settings($username, $settings) {
      $normalized_username = strtolower($username);
      $q = $this->db->prepare('REPLACE INTO `settings` (username, catchPaste, use12Hours, lang, dataProvider) VALUES (?, ?, ?, ?, ?)');
      $q->bind_param('siiss', $normalized_username, $settings['catchPaste'], $settings['use12Hours'], $settings['lang'], $settings['dataProvider']);
      $result = $q->execute();

      $ga = new Analytics();
      $ga->event('Settings', 'Save');

      return $result;
    }
  }
