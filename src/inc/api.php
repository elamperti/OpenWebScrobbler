<?php

    require('config.php');

    class APICall {
        private $curl;

        function call($method, $params=array(), $usePOST=false, $returnJSON=false) {
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
                $xml = simplexml_load_string($response);
                if ($returnJSON) {
                    return json_encode($xml);
                } else {
                    return $xml;
                }
            } else {
                return false;
            }
        }

        function get_signature($method, $params) {
            global $lastfm_secret;

            $signature = '';

            // These must be removed from the signature
            unset($params['callback']);
            unset($params['format']);

            // The API requires sorted parameters in the signature
            ksort($params);

            // Concatenate all the sorted items
            foreach($params as $key => $val) {
                $signature .= $key . $val;
            } 
            
            // Append the API secret
            $signature .= $lastfm_secret;

            // Return the signature
            return md5($signature);
        }

        function prepare($method, $params) {
            global $lastfm_api_key;

            // Process arrays so they can be properly handled and sorted
            foreach ($params as $param => $value) {
                if (is_array($value)) {
                    // Flatten the array to a bunch of keys
                    $params = array_merge($params, $this->flatten_array($param, $value));
                    // Pop the original parameter containing the array
                    unset($params[$param]);
                }
            }

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

        function flatten_array($key, $a) {
            $result = [];

            for ($i=0; $i < sizeof($a); $i++) {
                if (!empty($a[$i])) {
                    $result[$key . "[$i]"] = $a[$i];
                }
            }

            return $result;
        }

    }

    $api = new APICall();
