import { cacheLife, cacheTag } from "next/cache";

const WP_API_BASE =
  "https://public-api.wordpress.com/wp/v2/sites/kimdianerogers.wordpress.com";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WPRendered {
  rendered: string;
}

export interface WPPost {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: WPRendered;
  content: WPRendered;
  excerpt: WPRendered;
  author: number;
  featured_media: number;
  categories: number[];
  tags: number[];
  _embedded?: {
    "wp:featuredmedia"?: WPMedia[];
    "wp:term"?: WPTerm[][];
    author?: WPAuthor[];
  };
}

export interface WPPage {
  id: number;
  date: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: WPRendered;
  content: WPRendered;
  excerpt: WPRendered;
  parent: number;
  menu_order: number;
  featured_media: number;
  _embedded?: {
    "wp:featuredmedia"?: WPMedia[];
  };
}

export interface WPMedia {
  id: number;
  date: string;
  slug: string;
  type: string;
  link: string;
  title: WPRendered;
  caption: WPRendered;
  alt_text: string;
  media_type: string;
  mime_type: string;
  source_url: string;
  media_details: {
    width: number;
    height: number;
    sizes: Record<
      string,
      { file: string; width: number; height: number; source_url: string }
    >;
  };
}

export interface WPCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  parent: number;
}

export interface WPTag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
}

export interface WPAuthor {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: Record<string, string>;
}

export interface WPTerm {
  id: number;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
}

// ─── Internal fetch helper ────────────────────────────────────────────────────

async function wpFetch<T>(
  endpoint: string,
  params: Record<string, string | number> = {}
): Promise<T> {
  const url = new URL(`${WP_API_BASE}/${endpoint}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }

  const res = await fetch(url.toString());

  if (!res.ok) {
    throw new Error(
      `WordPress API error: ${res.status} ${res.statusText} — ${url.toString()}`
    );
  }

  return res.json() as Promise<T>;
}

// ─── Posts ────────────────────────────────────────────────────────────────────

export async function getPosts(options?: {
  perPage?: number;
  page?: number;
  categoryId?: number;
  tagId?: number;
}): Promise<WPPost[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("wp-posts");

  const params: Record<string, string | number> = {
    _embed: 1,
    per_page: options?.perPage ?? 12,
    page: options?.page ?? 1,
  };

  if (options?.categoryId) params.categories = options.categoryId;
  if (options?.tagId) params.tags = options.tagId;

  return wpFetch<WPPost[]>("posts", params);
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("wp-posts", `wp-post-${slug}`);

  const posts = await wpFetch<WPPost[]>("posts", { slug, _embed: 1 });
  return posts[0] ?? null;
}

// ─── Pages ────────────────────────────────────────────────────────────────────

export async function getPages(): Promise<WPPage[]> {
  "use cache";
  cacheLife("days");
  cacheTag("wp-pages");

  return wpFetch<WPPage[]>("pages", { _embed: 1, per_page: 100 });
}

export async function getPageBySlug(slug: string): Promise<WPPage | null> {
  "use cache";
  cacheLife("days");
  cacheTag("wp-pages", `wp-page-${slug}`);

  const pages = await wpFetch<WPPage[]>("pages", { slug, _embed: 1 });
  return pages[0] ?? null;
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function getCategories(): Promise<WPCategory[]> {
  "use cache";
  cacheLife("days");
  cacheTag("wp-categories");

  return wpFetch<WPCategory[]>("categories", { per_page: 100 });
}

// ─── Tags ─────────────────────────────────────────────────────────────────────

export async function getTags(): Promise<WPTag[]> {
  "use cache";
  cacheLife("days");
  cacheTag("wp-tags");

  return wpFetch<WPTag[]>("tags", { per_page: 100 });
}

// ─── Media ────────────────────────────────────────────────────────────────────

export async function getMediaById(id: number): Promise<WPMedia | null> {
  "use cache";
  cacheLife("weeks");
  cacheTag(`wp-media-${id}`);

  try {
    return await wpFetch<WPMedia>(`media/${id}`);
  } catch {
    return null;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Extract the best available featured image URL from an embedded post. */
export function getFeaturedImageUrl(
  post: WPPost | WPPage,
  size: string = "medium_large"
): string | null {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  if (!media) return null;
  return (
    media.media_details?.sizes?.[size]?.source_url ?? media.source_url ?? null
  );
}

/** Strip HTML tags and truncate for use as a plain-text excerpt. */
export function stripHtml(html: string, maxLength?: number): string {
  const text = html.replace(/<[^>]+>/g, "").trim();
  if (maxLength && text.length > maxLength) {
    return text.slice(0, maxLength).trimEnd() + "…";
  }
  return text;
}
