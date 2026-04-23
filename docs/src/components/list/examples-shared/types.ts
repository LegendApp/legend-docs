export type CatalogGroup = "Messaging" | "Directory" | "Commerce" | "Media" | "Comparison";

export type ExampleSlug =
    | "chat"
    | "ai-chat"
    | "directory"
    | "sectioned-directory"
    | "product-shelf"
    | "cards-feed"
    | "media-rails"
    | "video-feed"
    | "notifications-inbox"
    | "activity-history"
    | "gallery-grid"
    | "infinite-calendar"
    | "virtual-list-comparison";

export type ExampleMeta = {
    description: string;
    group: CatalogGroup;
    slug: ExampleSlug;
    title: string;
};
