import type { Image } from '../image';

export interface Meta {
    title: string;
    robots:
        | 'index, follow'
        | 'index, nofollow'
        | 'noindex, follow'
        | 'noindex, nofollow'
        | undefined;
    author?: string;
    description?: string;
    keywords?: string;
    currentFullURL?: URL;
    canonicalUrl?: string;
    ogMeta?: {
        title: string;
        description: string;
        image: Image | null | undefined;
    };
    country?: string;
}
