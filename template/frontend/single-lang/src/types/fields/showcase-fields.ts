import type { Image } from "../image";

export type ShowcaseFields = {
    showcase_headline: {
        value: string | null;
    };
    showcase_sub_headline: {
        value: string | null;
    };
    showcase_images: Image[];
};
