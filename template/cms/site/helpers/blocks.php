<?php
    function blocks($blocksField) {
        $blocks_result = array();

        foreach ($blocksField->toBlocks() as $block) {
            $blocks_result[] = array(
                "id" => $block->id(),
                "type" => $block->type(),
            );

            if ($block->type() === 'heading') {
                $blocks_result[count($blocks_result) - 1]["level"] = $block->level()->or('h2');
                $blocks_result[count($blocks_result) - 1]["text"] = $block->text();
            } elseif ($block->type() === 'text') {
                $blocks_result[count($blocks_result) - 1]["text"] = $block->text();
            } elseif ($block->type() === 'image') {
                $imageFile = $block->image()->toFile();
                $blocks_result[count($blocks_result) - 1]["image"] = json_image($imageFile);
                $blocks_result[count($blocks_result) - 1]["caption"] = $block->caption();
            } elseif ($block->type() === 'quote') {
                $blocks_result[count($blocks_result) - 1]["quoteText"] = $block->text();
                $blocks_result[count($blocks_result) - 1]["quoteCitation"] = $block->citation();
            } elseif ($block->type() === 'video') {
                if ($block->location() == 'kirby' && $video = $block->video()->toFile()) {
                     $blocks_result[count($blocks_result) - 1]["isExternal"] = false;
                     $blocks_result[count($blocks_result) - 1]["videoUrl"] = $video->url();
                     $blocks_result[count($blocks_result) - 1]["autoplay"] = $block->autoplay()->toBool();
                     $blocks_result[count($blocks_result) - 1]["controls"] = $block->controls()->toBool();
                     $blocks_result[count($blocks_result) - 1]["loop"] = $block->loop()->toBool();
                     $blocks_result[count($blocks_result) - 1]["muted"] = $block->muted()->toBool();
                     $blocks_result[count($blocks_result) - 1]["poster"] = $block->poster()->toFile()?->url();
                     $blocks_result[count($blocks_result) - 1]["preload"] = $block->preload()->value();
                } else {
                    $blocks_result[count($blocks_result) - 1]["isExternal"] = true;
                    $blocks_result[count($blocks_result) - 1]["videoUrl"] = $block->url();
                    $blocks_result[count($blocks_result) - 1]["caption"] = $block->caption();
                }
            } elseif ($block->type() === 'list') {
                $blocks_result[count($blocks_result) - 1]["list"] = $block->text();
            } elseif ($block->type() === 'code') {
                $blocks_result[count($blocks_result) - 1]["code"] = $block->code();
            } elseif ($block->type() === 'markdown') {
                $blocks_result[count($blocks_result) - 1]["markdown"] = $block->text();
            } elseif ($block->type() === 'gallery') {
                $blocks_result[count($blocks_result) - 1]["caption"] = $block->caption();
                $blocks_result[count($blocks_result) - 1]["crop"] = $block->crop()->isTrue();
                $blocks_result[count($blocks_result) - 1]["ratio"] = $block->ratio()->or('auto');
                foreach ($block->images()->toFiles() as $image) {
                    $blocks_result[count($blocks_result) - 1]["images"][] = json_image($image);
                }
            }
        }

        return $blocks_result;
    }
?>
