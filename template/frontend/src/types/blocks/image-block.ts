import type { Image } from "../image";

export type ImageBlock = {
    id: string;
    type: "image";
    image: Image;
    caption: ImageCaption;
};

type ImageCaption = {
    value: string;
};
