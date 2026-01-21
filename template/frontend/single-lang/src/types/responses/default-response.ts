import type { Footer } from '../footer';
import type { HeaderEntry } from '../header';
import type { Image } from '../image';
import type { Logo } from '../logo';

export type SiteMetaData = {
    website: {
        value: string;
    };
    page: {
        value: string;
    };
    status: 'listed' | 'unlisted' | 'draft';
    logo: Logo;
    faviconIco: Image;
    appleTouchIcon: Image;
    favicon48x48: Image;
    faviconSvg: Image;
    manifest: string;
    ogImage: Image;
    country:
        | {
              value: string;
          }
        | undefined;
};

export type DefaultResponse = {
    site: {
        site_data: SiteMetaData;
        logo: Logo;
        favicon: {
            url: string;
        };
        webmanifest: string;
        footer: Footer;
    };
    header: Array<HeaderEntry> | null;
    page: {
        meta_fields: {
            meta_description: {
                value: string;
            };
            meta_keywords: {
                value: string;
            };
            meta_robots: {
                value:
                    | 'index, follow'
                    | 'index, nofollow'
                    | 'noindex, follow'
                    | 'noindex, nofollow'
                    | undefined;
            };
        };
    };
};
