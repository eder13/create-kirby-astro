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

export const buildYouTubeEmbedURL = (videoUrl: string) => {
    const videoId = videoUrl.split("?v=")[1];
    return `https://www.youtube.com/embed/${videoId}`;
};
