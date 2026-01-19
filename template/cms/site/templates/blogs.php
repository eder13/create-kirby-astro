<?php
    /** Snippets, piped with ob to capture data */
    ob_start();
    include_once(__DIR__ . '/../snippets/header.php');

    /** Helpers */
    include_once(__DIR__ . '/../helpers/image.php');
    include_once(__DIR__ . '/../helpers/site.php');

    $blogs = [];

    /** CMS Data */
    foreach ($page->children()->listed() as $blog) {
        $blogsData = array(
            "blog_title" => $blog->blog_title()->isNotEmpty() ? $blog->blog_title() : $blog->title(),
            "blog_subtitle" => $blog->blog_subtitle(),
            "blog_title_image" => json_image($blog->blog_title_image()->toFile()),
            "blog_url" => $blog->url(),
            "blog_slug" => $blog->slug(),
        );
        array_push($blogs, $blogsData);
    }

    $pageData = array("blogs_title" => $page->blogs_title(), "blogs_subtitle" => $page->blogs_subtitle(), "blogs" => $blogs);
    $meta_fields = array(
        "meta_description" => $page->meta_description(),
        "meta_keywords" => $page->meta_keywords(),
        "meta_robots" => $page->meta_robots(),
    );

    $json = array(
        "site" => core_data($site, $page),
        "header" => json_decode($header),
        "page" => array("blogs_fields" => $pageData, "meta_fields" => $meta_fields),
    );

    $kirby->response()->json();
    echo json_encode($json) . "\n";
?>
