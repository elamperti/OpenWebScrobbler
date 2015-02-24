<?php

	require('config.php');

	class APICall {
		private $curl;

		function call($method, $params, $usePOST=false) {
			$url = "http://ws.audioscrobbler.com/2.0/?";
			$query = $this->prepare($method, $params);

			$this->curl = curl_init($url);

			// cURL bells and whistles
			if ($usePOST) {
				curl_setopt($this->curl, CURLOPT_POST, true);
				curl_setopt($this->curl, CURLOPT_POSTFIELDS, $query);
			} else {
				curl_setopt($this->curl, CURLOPT_URL, $url . $query);
			}

			curl_setopt($this->curl, CURLOPT_USERAGENT, 'OpenWebScrobbler/1.0'); 
			curl_setopt($this->curl, CURLOPT_FOLLOWLOCATION, true); 
			curl_setopt($this->curl, CURLOPT_RETURNTRANSFER, true);

			// fetch
			$response = curl_exec($this->curl);
			curl_close($this->curl);

			if ($response) {
		        // Parse and return the XML response
		        return simplexml_load_string($response);
		    } else {
		    	return false;
		    }
		}

		function get_signature($method, $params) {
			global $lastfm_secret;

			$signature = '';

			ksort($params);

			foreach($params as $key => $val) {
				// ToDo: ignore 'callback' and 'format'
				$signature .= $key . $val;
			}

			$signature .= $lastfm_secret;

			$signature = md5($signature);

			return $signature;
		}

		function prepare($method, $params) {
			global $lastfm_api_key;

			// Filling in the blanks
			$params['method'] = $method;
			$params['api_key'] = $lastfm_api_key;

			// If there's a session key, attach it
			if (isset($_SESSION['key'])) {
				$params['sk'] = $_SESSION['key'];
			}

			// Add the signature
			$params['api_sig'] = $this->get_signature($method, $params);

			return http_build_query($params);
		}
	}

	$api = new APICall();
