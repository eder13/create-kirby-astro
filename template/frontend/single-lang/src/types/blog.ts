import type { Image } from './image';

export type Blog = {
    blog_title: BlogTitle;
    blog_subtitle: BlogSubtitle;
    blog_title_image: Image;
    blog_url: string;
    blog_slug: string;
};

type BlogTitle = {
    value: string | null;
};

type BlogSubtitle = {
    value: string | null;
};
