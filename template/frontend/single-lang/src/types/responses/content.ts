import type { Blocks } from "../blocks";
import type { DefaultResponse } from "./default-response";

export interface ContentPageResponse extends DefaultResponse {
    page: DefaultResponse["page"] & {
        content_page_fields: {
            content_page_title: ContentPageTitle;
            content_page_content: ContentPageContent;
        };
        meta_fields: {
            meta_description: string;
            meta_keywords: string;
            meta_robots: string;
        };
    };
}

type ContentPageTitle = {
    value: string;
};

type ContentPageContent = Blocks;
