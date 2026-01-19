<?php
    function move_page($page) {
        $tpl = $page->template()?->name() ?? null;
        $targetSite = null;

        if ($tpl === 'content_page') {
            $targetSite = 'cp';
        } else if ($tpl === 'blog') {
            $targetSite = 'blogs';
        } else {
            return;
        }

        $target = site()->page($targetSite)
            ?? site()->find($targetSite)
            ?? site()->index()->filterBy('uid', $targetSite)->first()
            ?? site()->index()->filterBy('slug', $targetSite)->first();

        if (!$target) {
            return;
        }

        $parent = $page->parent();
        if ($parent && $parent->uid() === $target->uid()) {
            return;
        }

        try {
            $page->move($target);
        } catch (\Throwable $e) {
            return;
        }
    }
?>
