import CommonConstants from './../constants/common';

export default class EnvironmentHelper {
    static getRootDomain(): string {
        return import.meta.env.DOMAIN;
    }

    static getRootDomainURL(includePort?: boolean): string {
        const domain = import.meta.env.DOMAIN;

        let protocol = 'https';
        if (domain === 'localhost') {
            protocol = 'http';
        }

        const port = import.meta.env.PORT;
        if (port && includePort) {
            return `${protocol}://${domain}:${port}`;
        }

        return `${protocol}://${domain}`;
    }

    static getFetchBaseURL(): string {
        return `${this.getRootDomainURL()}${CommonConstants.CMS_PREFIX}`;
    }
}
