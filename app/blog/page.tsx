import { getPosts, getFeaturedImageUrl, stripHtml } from "@/lib/wordpress";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Blog | Kim Diane Rogers",
  description: "Articles, insights, and stories from Kim Diane Rogers.",
};

export default async function BlogPage() {
  const posts = await getPosts({ perPage: 12 });

  return (
    <main className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Blog</h1>
      <p className="text-lg text-gray-600 mb-12">
        Articles, insights, and stories.
      </p>

      {posts.length === 0 ? (
        <p className="text-gray-500">No posts found.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const imageUrl = getFeaturedImageUrl(post);
            const excerpt = stripHtml(post.excerpt.rendered, 160);

            return (
              <article
                key={post.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col"
              >
                {imageUrl && (
                  <Link href={`/blog/${post.slug}`} className="block">
                    <Image
                      src={imageUrl}
                      alt={post.title.rendered}
                      width={600}
                      height={340}
                      className="w-full object-cover aspect-video"
                    />
                  </Link>
                )}

                <div className="p-6 flex flex-col flex-1">
                  <time
                    dateTime={post.date}
                    className="text-sm text-gray-400 mb-2"
                  >
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>

                  <h2 className="text-xl font-semibold text-gray-800 mb-3 leading-snug">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-blue-600 transition-colors"
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />
                  </h2>

                  <p className="text-gray-600 text-sm flex-1">{excerpt}</p>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-4 self-start text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Read more →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
