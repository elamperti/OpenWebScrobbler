<?php
  class InfluxDB {
    private $url;
    private $token;
    private $org;
    private $bucket;

    public function __construct() {
      $this->url = getenv('INFLUXDB_URL');
      $this->token = getenv('INFLUXDB_TOKEN');
      $this->org = getenv('INFLUXDB_ORG');
      $this->bucket = 'scrobbles';
    }

    public function record_scrobble($username, $count = 1) {
      $data = "scrobbles,user_id={$username} count={$count}i";
      $this->write_data($data);
    }

    private function write_data($data) {
      $url = "{$this->url}/api/v2/write?org={$this->org}&bucket={$this->bucket}&precision=s";

      $ch = curl_init($url);
      curl_setopt($ch, CURLOPT_POST, true);
      curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
      curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Token {$this->token}",
        'Content-Type: text/plain'
      ]);

      $response = curl_exec($ch);
      $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

      if ($http_code != 204) {
        error_log("InfluxDB write failed. HTTP code: $http_code, Response: $response");
      }

      // error_log('InfluxDB response time: ' . round(curl_getinfo($ch, CURLINFO_TOTAL_TIME) * 1000));

      curl_close($ch);
    }
  }
