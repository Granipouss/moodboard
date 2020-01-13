export type BaseLike = {
  // blog: {name: "silverjow", title: "Silverjow", description: "Hi, my name is Joe,
  //    draw under the pseudonym of Si…on.com/silverjow  www.facebook.com/artofsilverjow",
  //    url: "https://silverjow.tumblr.com/", uuid: "t:tcuvzJKn-CrN6d0eEpjeDg", …}
  blog_name: string;
  can_like: boolean;
  can_reblog: boolean;
  can_reply: boolean;
  can_send_in_message: boolean;
  date: string;
  followed: boolean;
  format: 'html';
  id: number;
  liked: true;
  liked_timestamp: number;
  // reblog: {comment: "<p>Inspired by Tomb Raider cosplay by the amazing …ilverjow">
  //    www.patreon.com/silverjow</a>↵↵<br></p>", tree_html: ""}
  // reblog_key: "5hqSfCdn"
  // recommended_color: null
  // recommended_source: null
  // short_url: "https://tmblr.co/Z6eE0n2jswfmk"
  // should_open_in_legacy: true
  state: 'published';
  summary: string;
  slug: string;
  tags: string[];
  timestamp: number;
  // trail: [{…}]
  note_count: number;
  post_url: string;
  display_avatar: boolean;
};

export type SizedImage = {
  url: string;
  height: number;
  width: number;
};

export type Photo = {
  alt_sizes: SizedImage[];
  original_size: SizedImage;
  caption: string;
};

export type ImageLike = BaseLike & {
  type: 'photo';
  caption: string;
  image_permalink: string;
  photos: Photo[];
};

export type TextLike = BaseLike & {
  type: 'text';
  title: string | null;
  body: string;
};

type LikeLink = {
  href: string;
  method: string;
  query_params: { before?: string; after?: string };
};

export type LikeResponse = {
  liked_count: number;
  liked_posts: Array<ImageLike | TextLike>;
  _links: { next: LikeLink; prev: LikeLink };
};

export type LikeRequestOptions = Partial<{
  limit: number;
  offset: number;
  before: string;
  after: string;
}>;
