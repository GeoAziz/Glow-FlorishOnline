
import { getProducts } from "@/lib/data";
import { ProductCard } from "@/app/(main)/shop/components/product-card";
import { Search as SearchIcon } from "lucide-react";

interface SearchPageProps {
    searchParams: {
        q?: string;
    };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const query = searchParams.q || "";
    const products = await getProducts({ searchQuery: query });

    return (
        <div className="container mx-auto px-4 py-8 md:py-16">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-headline font-bold">Search Results</h1>
                {query ? (
                    <p className="text-muted-foreground mt-2 text-lg">
                        Showing results for: <span className="text-foreground font-semibold">"{query}"</span>
                    </p>
                ) : (
                    <p className="text-muted-foreground mt-2 text-lg">
                        Please enter a search term to find products.
                    </p>
                )}
            </div>
            
            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                 query && (
                    <div className="text-center py-16 border-2 border-dashed rounded-lg">
                        <SearchIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                        <h2 className="text-2xl font-semibold">No Products Found</h2>
                        <p className="text-muted-foreground mt-2">
                            We couldn't find any products matching your search. Try a different term.
                        </p>
                    </div>
                 )
            )}
        </div>
    );
}
