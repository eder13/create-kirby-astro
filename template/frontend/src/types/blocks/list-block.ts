export type ListBlock = {
    id: string;
    type: "list";
    list: List;
};

type List = {
    value: string;
};
