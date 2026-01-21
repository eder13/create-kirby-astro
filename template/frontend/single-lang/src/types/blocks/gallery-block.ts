import type { Image } from "../image";

export type GalleryBlock = {
    id: string;
    type: "gallery";
    caption: Caption;
    crop: boolean;
    ratio: RatioValue;
    images: Image[];
};

type Caption = {
    value: string;
};

type RatioValue = {
    value:
        | "auto"
        | "1:1"
        | "16:9"
        | "10:8"
        | "21:9"
        | "7:5"
        | "4:3"
        | "5:3"
        | "3:2"
        | "3:1";
};
