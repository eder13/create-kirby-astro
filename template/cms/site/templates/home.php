<?php
    /** Snippets, piped with ob to capture data */
    ob_start();
    include_once(__DIR__ . '/../snippets/header.php');
    
    /** Helpers */
    include_once(__DIR__ . '/../helpers/image.php');
    include_once(__DIR__ . '/../helpers/site.php');
    include_once(__DIR__ . '/../helpers/structure.php');

    /** CMS Data */
    $showcase_fields = array("showcase_headline" => $page->showcase_headline(), "showcase_sub_headline" => $page->showcase_sub_headline(), "showcase_images" => json_image($page->showcase_images()->toFiles()));
    $meta_fields = array(
        "meta_description" => $page->meta_description(),
        "meta_keywords" => $page->meta_keywords(),
        "meta_robots" => $page->meta_robots(),
    );
    $pageData = array("showcase_fields" => $showcase_fields, "meta_fields" => $meta_fields);

    $json = array(
        "site" => core_data($site, $page),
        "header" => json_decode($header),  
        "page" => $pageData,
    );

    $kirby->response()->json();
    echo json_encode($json) . "\n";
?>
