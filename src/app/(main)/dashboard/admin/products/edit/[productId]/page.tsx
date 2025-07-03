import { getProductById } from "@/lib/data";
import { notFound } from "next/navigation";
import { ProductEditForm } from "./components/product-edit-form";

interface EditProductPageProps {
  params: {
    productId: string;
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const product = await getProductById(params.productId);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-headline mb-2">Edit Product</h1>
        <p className="text-muted-foreground">
          Update the details for "{product.name}".
        </p>
      </div>
      <ProductEditForm product={product} />
    </div>
  );
}
