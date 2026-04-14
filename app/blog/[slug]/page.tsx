import { getPostBySlug, getPosts, getFeaturedImageUrl } from "@/lib/wordpress";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// ─── Static params (build-time pre-rendering) ─────────────────────────────────

export async function generateStaticParams() {
  const posts = await getPosts({ perPage: 100 });
  return posts.map((post) => ({ slug: post.slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  // Next.js 16: params is a Promise
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return {};

  const imageUrl = getFeaturedImageUrl(post);

  return {
    title: `${post.title.rendered} | Kim Diane Rogers`,
    description: post.excerpt.rendered.replace(/<[^>]+>/g, "").slice(0, 160),
    openGraph: imageUrl
      ? {
          images: [{ url: imageUrl }],
        }
      : undefined,
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BlogPostPage({
  params,
}: {
  // Next.js 16: params is a Promise
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const imageUrl = getFeaturedImageUrl(post, "large");

  return (
    <main className="container mx-auto px-4 py-16 max-w-3xl">
      <Link
        href="/blog"
        className="text-sm text-gray-500 hover:text-gray-700 mb-8 inline-block"
      >
        ← Back to blog
      </Link>

      <article>
        <header className="mb-8">
          <time dateTime={post.date} className="text-sm text-gray-400">
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>

          <h1
            className="text-4xl font-bold text-gray-800 mt-2 mb-4 leading-tight"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />

          {imageUrl && (
            <Image
              src={imageUrl}
              alt={post.title.rendered}
              width={1200}
              height={630}
              className="w-full rounded-xl object-cover aspect-video mt-6"
              priority
            />
          )}
        </header>

        <div
          className="prose prose-gray max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />
      </article>
    </main>
  );
}
