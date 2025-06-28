import { getProductBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import { ProductDetailsClient } from "./components/product-details-client";
import AiRecommendations from "./components/ai-recommendations";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <ProductDetailsClient product={product} />
      <div className="mt-16">
        <AiRecommendations productDescription={product.longDescription} />
      </div>
    </div>
  );
}
