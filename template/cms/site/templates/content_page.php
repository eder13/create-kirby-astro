<?php

    /** Snippets, piped with ob to capture data */
    ob_start();
    include_once(__DIR__ . '/../snippets/header.php');

    /** Helpers */
    include_once(__DIR__ . '/../helpers/image.php');
    include_once(__DIR__ . '/../helpers/site.php');
    include_once(__DIR__ . '/../helpers/blocks.php');

    /** CMS data */
    $content_page_fields = array(
        "content_page_title" => $page->content_page_title(),
        "content_page_content" => blocks($page->content_page_content()),
    );

    $meta_fields = array(
        "meta_description" => $page->meta_description(),
        "meta_keywords" => $page->meta_keywords(),
        "meta_robots" => $page->meta_robots(),
    );

    $json = array(
        "site" => core_data($site, $page),
        "header" => json_decode($header),
        "page" => array("content_page_fields" => $content_page_fields, "meta_fields" => $meta_fields),
    );

    $kirby->response()->json();
    echo json_encode($json) . "\n";
?>
