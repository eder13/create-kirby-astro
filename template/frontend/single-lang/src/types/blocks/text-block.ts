export type TextBlock = {
    id: string;
    type: "text";
    text: TextBlockContent;
};

type TextBlockContent = {
    value: string;
};
