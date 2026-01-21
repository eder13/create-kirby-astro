export interface DropdownProps {
    id: string;
    active?: boolean;
    title: Title;
    url: string;
    onClick?: string;
    subpages?: DropdownProps[];
    skipHeadlineInDropdown?: boolean;
}

type Title = {
    value: string;
};
