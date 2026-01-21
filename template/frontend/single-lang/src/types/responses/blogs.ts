import type { BlogsFields } from '../fields/blogs-fields';
import type { DefaultResponse } from './default-response';

export interface BlogsResponse extends DefaultResponse {
    page: DefaultResponse['page'] & {
        blogs_fields: BlogsFields;
    };
}
