import type { Blog } from '../blog';

export type BlogsFields = {
    blogs_title: {
        value: string | null;
    };
    blogs_subtitle: {
        value: string | null;
    };
    blogs: Blog[];
};
