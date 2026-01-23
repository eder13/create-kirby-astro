import EnvironmentHelper from "../helpers/EnvironmentHelper";
import Language from "../types/language";
import CommonConstants from "./../constants/common";

export const kirbyHref = (url: string) => {
    const withoutCMSPrefix = url.replace(CommonConstants.CMS_PREFIX, "");
    if (import.meta.env.DEV) {
        return withoutCMSPrefix.replace(
            "localhost",
            `localhost:${import.meta.env.PORT}`,
        );
    }
    return withoutCMSPrefix;
};

export const buildURLWithLanguage = (
    language: Language,
    path: string,
    params?: URLSearchParams,
) => {
    if (/^(\/de\/?|\/en\/?)/.test(path)) {
        const pathWithWantedLanguage = path.replace(
            /^(\/de\/?|\/en\/?)/,
            `/${language}/`,
        );
        return `${EnvironmentHelper.getRootDomainURL()}${pathWithWantedLanguage}${
            params !== undefined ? "?" + params.toString() : ""
        }`;
    }

    return `${EnvironmentHelper.getRootDomainURL()}/${language}/${
        params !== undefined ? "?" + params.toString() : ""
    }`;
};

export const getURLWithoutLanguage = (url: URL) => {
    return url.toString().replace(/(\/de|\/en)/, "");
};

export const getCurrentLanguageFromURL = (url: URL) => {
    const match = url.pathname.match(
        `/\/(${Object.values(Language).join("|")})\//`,
    );
    return match ? match[1] : null;
};

export const buildYouTubeEmbedURL = (videoUrl: string) => {
    const videoId = videoUrl.split("?v=")[1];
    return `https://www.youtube.com/embed/${videoId}`;
};
