<?php
  if (basename(__FILE__) == basename($_SERVER['SCRIPT_FILENAME'])) {
    die();
  }

  function raiseOWSError($message='Unknown error', $http_response_code=500) {
    header('Content-Type: application/json', true, $http_response_code);
    echo json_encode(array(
      'message' => $message
    ));
    die();
  }
