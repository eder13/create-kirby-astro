export type MarkdownBlock = {
    id: string;
    type: "markdown";
    markdown: MarkdownContent;
};

type MarkdownContent = {
    value: string;
};
