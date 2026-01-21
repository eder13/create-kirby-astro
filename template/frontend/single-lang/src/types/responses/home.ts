import type { ShowcaseFields } from '../fields/showcase-fields';
import { type DefaultResponse } from './default-response';

export interface HomeResponse extends DefaultResponse {
    page: DefaultResponse['page'] & {
        showcase_fields: ShowcaseFields;
    };
}
