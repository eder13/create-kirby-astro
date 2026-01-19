export type VideoBlock = {
    id: string;
    type: "video";
} & (
    | {
          isExternal: true;
          videoUrl: {
              value: string;
          };
          caption: {
              value: string;
          };
      }
    | {
          isExternal: false;
          videoUrl: string;
          autoplay: boolean;
          controls: boolean;
          loop: boolean;
          muted: boolean;
          poster: string;
          preload: "auto" | "metadata" | "none";
      }
);
