import { getBlogPostBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

function renderContent(content: string) {
    const blocks: React.ReactNode[] = [];
    let listItems: string[] = [];

    const flushList = () => {
        if (listItems.length > 0) {
            blocks.push(
                <ul key={`ul-${blocks.length}`} className="list-disc space-y-2 my-4">
                    {listItems.map((item, idx) => <li key={idx} className="ml-6">{item}</li>)}
                </ul>
            );
            listItems = [];
        }
    };

    content.split('\n').forEach((line, index) => {
        if (line.startsWith('**') && line.endsWith('**')) {
            flushList();
            blocks.push(<h3 key={index} className="text-2xl font-headline mt-8 mb-3">{line.replaceAll('**', '')}</h3>);
        } else if (line.startsWith('* ') || line.startsWith('- ')) {
            listItems.push(line.substring(2));
        } else if (line.trim() === '') {
            flushList();
            blocks.push(<div key={index} className="h-4" />); // Represents a line break
        } else {
            flushList();
            blocks.push(<p key={index} className="leading-relaxed">{line}</p>);
        }
    });

    flushList(); // Make sure to flush any remaining list items
    return blocks;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <article className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
            {post.tags && (
                <div className="flex justify-center gap-2 mb-4">
                    {post.tags.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                </div>
            )}
            <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4">{post.title}</h1>
            <div className="text-muted-foreground">
                <span>By {post.author}</span>
                <span className="mx-2">•</span>
                <span>{format(new Date(post.publishedDate), "MMMM d, yyyy")}</span>
            </div>
        </header>
        
        <div className="relative aspect-video rounded-lg overflow-hidden mb-8 shadow-lg">
            <Image 
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover"
                data-ai-hint={post.imageHint}
                priority
            />
        </div>

        <div className="text-lg text-foreground/90">
           {renderContent(post.content)}
        </div>
      </article>
    </div>
  );
}
