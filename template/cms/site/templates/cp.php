<?php

    $content_pages = [];

    foreach (page()->children() as $page) {
        $content_page_data = array(
            "content_url" => $page->url(),
            "content_slug" => $page->slug(),
        );

        array_push($content_pages, $content_page_data);
    }

    $json = array(
        "page" => array("content_fields" => $content_pages),
    );

    $kirby->response()->json();
    echo json_encode($json) . "\n";
?>
