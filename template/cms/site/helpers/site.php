<?php
    include_once(__DIR__ . '/image.php');

    function core_data($site, $page) {
        if ($site == null || $page == null) {
            return null;
        } 

        return array(
            "site_data" => array(
                "website" => $site->title(), 
                "page" => $page->title(), 
                "status" => $page->status(),
                "logo" => array("url" => $site->logo()->toFile()->url()),
                "country" => $site->country(),
                "faviconIco" => json_image($site->favicon()->toFile()),
                "appleTouchIcon" => json_image($site->favicon_apple_touch_icon()->toFile()),
                "favicon48x48" => json_image($site->favicon_48x_48x()->toFile()),
                "faviconSvg" => json_image($site->favicon_svg()->toFile()),
                "manifest" => json_encode(json_decode(preg_replace("/\r|\n/", "", Html::decode($site->web_app_manifest_json()->kirbytext())), true)),
                "ogImage" => json_image($site->ogImage()->toFile())
            ),
            "logo" => array("url" => $site->logo()->toFile()->url(), "width" => $site->logo()->toFile()->width(), "height" => $site->logo()->toFile()->height()),
            "footer" => array(
                "contact_name" => $site->contact_name(), 
                "contact_address" => $site->contact_address(), 
                "contact_country" => $site->contact_country(), 
                "contact_instagram" => $site->contact_instagram(),
                "contact_facebook" => $site->contact_facebook(),
                "contact_x" => $site->contact_x()
            ),
        );
    }
?>
