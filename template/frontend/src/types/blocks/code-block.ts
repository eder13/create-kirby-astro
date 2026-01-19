export type CodeBlock = {
    id: string;
    type: "code";
    code: Code;
};

type Code = {
    value: string;
};
