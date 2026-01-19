<?php

    /** Snippets, piped with ob to capture data */
    ob_start();
    include_once(__DIR__ . '/../snippets/header.php');

    /** Helpers */
    include_once(__DIR__ . '/../helpers/image.php');
    include_once(__DIR__ . '/../helpers/site.php');
    include_once(__DIR__ . '/../helpers/blocks.php');

    /** CMS data */
    $blog_fields = array(
        "blog_title" => $page->blog_title()->isNotEmpty() ? $page->blog_title() : $page->title(),
        "blog_subtitle" => $page->blog_subtitle(),
        "blog_title_image" => json_image($page->blog_title_image()->toFile()),
        "blog_content" => blocks($page->blog_content()),
    );

    $meta_fields = array(
        "meta_description" => $page->meta_description(),
        "meta_keywords" => $page->meta_keywords(),
        "meta_robots" => $page->meta_robots(),
    );

    $json = array(
        "site" => core_data($site, $page),
        "header" => json_decode($header),
        "page" => array("blog_fields" => $blog_fields, "meta_fields" => $meta_fields),
    );

    $kirby->response()->json();
    echo json_encode($json) . "\n";

?>
