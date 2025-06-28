import { getBlogPosts } from "@/lib/data";
import { BlogPostCard } from "./components/blog-post-card";

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4">
          Glow & Flourish Blog
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your source for beauty tips, wellness advice, and inspired living.
        </p>
      </div>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold">No Posts Yet</h2>
          <p className="text-muted-foreground mt-2">
            Check back soon for articles and inspiration!
          </p>
        </div>
      )}
    </div>
  );
}
