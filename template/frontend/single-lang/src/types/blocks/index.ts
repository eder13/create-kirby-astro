import type { CodeBlock } from "./code-block";
import type { GalleryBlock } from "./gallery-block";
import type { HeadingBlock } from "./heading-block";
import type { ImageBlock } from "./image-block";
import type { LineBlock } from "./line-block";
import type { ListBlock } from "./list-block";
import type { MarkdownBlock } from "./markdown-block";
import type { QuoteBlock } from "./quote-block";
import type { TextBlock } from "./text-block";
import type { VideoBlock } from "./video-block";

export type Blocks = Array<
    | TextBlock
    | HeadingBlock
    | QuoteBlock
    | ImageBlock
    | LineBlock
    | ListBlock
    | VideoBlock
    | CodeBlock
    | MarkdownBlock
    | GalleryBlock
>;
