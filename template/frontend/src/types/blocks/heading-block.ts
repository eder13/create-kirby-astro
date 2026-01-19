export type HeadingBlock = {
    id: string;
    type: "heading";
    level: HeadingBlockLevel;
    text: HeadingBlockText;
};

type HeadingBlockLevel = {
    value: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
};

type HeadingBlockText = {
    value: string;
};
