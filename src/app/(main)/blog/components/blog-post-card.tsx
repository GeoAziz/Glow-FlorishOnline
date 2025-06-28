import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import type { BlogPost } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface BlogPostCardProps {
  post: BlogPost;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden group transition-shadow hover:shadow-lg">
      <Link href={`/blog/${post.slug}`} className="block relative aspect-video">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          data-ai-hint={post.imageHint}
        />
      </Link>
      <CardHeader>
        <CardTitle>
          <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors text-xl leading-snug">
            {post.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {post.excerpt}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="text-xs text-muted-foreground">
          <p>{post.author}</p>
          <p>{format(new Date(post.publishedDate), "MMMM d, yyyy")}</p>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link href={`/blog/${post.slug}`}>
            Read More <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
