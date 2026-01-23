<?php
$external = __DIR__ . '/../../../error/index.html';

if (is_readable($external)) {
    readfile($external);
} else {
    http_response_code(500);
    echo 'Error';
}
?>
