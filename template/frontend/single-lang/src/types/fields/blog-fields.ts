import type { Blocks } from "../blocks";
import type { Image } from "../image";

export type BlogFields = {
    blog_title: BlogTitle;
    blog_subtitle: BlogSubtitle;
    blog_title_image: Image;
    blog_content: BlogContent;
};

type BlogTitle = {
    value: string;
};

type BlogSubtitle = {
    value: string;
};

export type BlogContent = Blocks;
