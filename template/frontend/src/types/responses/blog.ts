import type { BlogFields } from "../fields/blog-fields";
import type { DefaultResponse } from "./default-response";

export interface BlogResponse extends DefaultResponse {
    page: DefaultResponse["page"] & {
        blog_fields: BlogFields;
    };
}
