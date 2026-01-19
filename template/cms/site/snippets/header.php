<?php 
    $nav_items = array();
    // Currently we only support sub pages, could make this dynamic via Depth first Search (DFS) to support more levels of depth
    foreach ($site->children()->listed() as $item) {
        $subpages = [];
        foreach ($item->children()->listed() as $subpage) {
            array_push($subpages, array("title" => $subpage->title(), "url" => $subpage->url(), "active" => $subpage->isOpen()));
        }
        $nav_items[] = array("id" => $item->id(), "active" => $item->isOpen(), "title" => $item->title()->esc(), "url" => $item->url(), "subpages" => $subpages);
    } 

    // print the header data - captured by templates via ob_start()
    ob_start();

    echo json_encode($nav_items)."\n";

    $header = ob_get_clean();
?>
