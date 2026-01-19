<?php

/**
 *  "Proxy"
 *  As a safety measure, the cms api which serves json is only allowed to return
 *  the data if the "secret" header HTTP_X_REQUESTED_WITH was set to a secret (deployment secret), which is a security
 *  measure that was suggested by KirbyCMS. 
 *  This safety measure is only applied if the content serves json and does not check any internal kirby cms api.
 * 
 *  If the secret is not attached, the client won't see the json response.
 *  See: https://getkirby.com/docs/cookbook/content-representations/generating-json#using-your-json-representation__securing-your-json
 * */
function proxy($route, $path, $method, $CUSTOM_ROUTES) {
    $isInternal = $_SERVER['HTTP_X_FETCHED_INTERNALLY'] ?? null;
    $isInternalApi = strpos($path, "api") === 0 || strpos($path, "panel") === 0;
    $isCustomRoute = in_array($path, $CUSTOM_ROUTES);

    if ($isInternal != 'true' && !$isInternalApi && !$isCustomRoute) {
        $isValidJson = false;
        $customHeader = $_SERVER['HTTP_X_REQUESTED_WITH'] ?? null;
        $env = parse_ini_file(__DIR__ . '/../../../../.env');
        $domain = $env["DOMAIN"];
        $deployment_key = $env['DEPLOYMENT_KEY'];
        $host = $_SERVER['HTTP_HOST'];

        // check if the host has the right referrer set
        if ($host != "localhost" && $host != "www.localhost" && strcmp($host, "www." . $domain) != 0 && strcmp($host, $domain) != 0) {
            die('wrong host: ' . $host);
        }

        // URL to fetch the resource finally without the security checked, marked by the X-Fetched-Internally Header
        $protocol = $host == "localhost" || $host == "www.localhost" ? 'http://' : 'https://';
        $endpoint = $protocol . $host . '/cms/' . $path;

        // Request to get JSON Data on it's own endpoint on the server side
        $ch = curl_init($endpoint);
        $headers = [
            'X-Fetched-Internally: true'
        ];
        // Set cURL options
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);  // Return the response as a string
        curl_setopt($ch, CURLOPT_HEADER, true);          // Include headers in the output
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);   // Add custom headers
        // Execute the cURL request
        $response = curl_exec($ch);

        // Check for cURL errors
        if ($response === false) {
            curl_close($ch);
            // If there are errors then it's not JSON and should be just ignored (e.g. show 404 Page instead)
            die('false...');
        }

        // Separate the headers and the body
        $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
        $headers = substr($response, 0, $header_size);
        $body = substr($response, $header_size);

        // Close the cURL session
        curl_close($ch);

        // Check if the Content-Type is application/json
        if (stripos($headers, 'Content-Type: application/json') !== false) {
            // Check if the body contains valid JSON
            json_decode($body);
            if (json_last_error() === JSON_ERROR_NONE) {
                $isValidJson = true;
            }
        }

        if ($isValidJson) {
            // check if the secret was attached properly
            if (option('debug') === false && $customHeader != $deployment_key) {
                die("Permission denied - you are not allowed to access the resource: " . $path);
            }
        }
    }
}

?>
