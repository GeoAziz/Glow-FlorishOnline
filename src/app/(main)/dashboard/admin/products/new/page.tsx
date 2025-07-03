import { ProductForm } from "./components/product-form";

export default function NewProductPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-headline mb-2">Add New Product</h1>
        <p className="text-muted-foreground">
          Fill out the form below to add a new product to your store.
        </p>
      </div>
      <ProductForm />
    </div>
  );
}
