export interface DropdownProps {
    id: string;
    active?: boolean;
    title: Title;
    url: string;
    onclick?: string;
    subpages?: DropdownProps[];
}

type Title = {
    value: string;
};
