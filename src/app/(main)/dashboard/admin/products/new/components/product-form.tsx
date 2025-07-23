"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import dynamic from "next/dynamic";

import { createProduct } from "@/actions/product";
import { generateProductDescription, type ProductDescriptionOutput } from "@/ai/flows/product-description-generator";
import { productFormSchema, type ProductFormValues } from "@/lib/schemas/product";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";

const RichTextEditor = dynamic(() => import("@/components/ui/rich-text-editor"), { ssr: false });

const categories = ["Face Care", "Hair Care", "Body Care", "Fragrance & Wellness"] as const;

export function ProductForm() {
    const [isPending, startTransition] = useTransition();
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiKeywords, setAiKeywords] = useState("");
    const [aiPreview, setAiPreview] = useState<ProductDescriptionOutput | null>(null);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productFormSchema),
        defaultValues: {
            name: "",
            slug: "",
            brand: "Glow & Flourish",
            description: "",
            longDescription: "",
            price: 0,
            stock: 0,
            category: "Face Care",
            images: [],
            ingredients: [],
            tags: [],
            skinType: [],
            rating: 0
        },
    });

    const handleGenerateDescription = async () => {
        toast({
            title: "Coming Soon",
            description: "AI product description generator will be available soon!",
            variant: "default"
        });
        return;
    };

    const onSubmit = (data: ProductFormValues) => {
        startTransition(async () => {
            const result = await createProduct(data);
            if (result?.error) {
                toast({
                    title: "Error",
                    description: result.error,
                    variant: "destructive",
                });
            } else {
                 toast({
                    title: "Success!",
                    description: "Product created successfully.",
                });
            }
        });
    };

    const onDrop = (acceptedFiles: File[]) => {
        const newImages = acceptedFiles.map(file => URL.createObjectURL(file));
        setUploadedImages(prev => [...prev, ...newImages]);
        form.setValue("images", [...form.getValues("images"), ...newImages], { shouldValidate: true });
    };
    const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { 'image/*': [] }, multiple: true });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>AI Content Generator</CardTitle>
                            <CardDescription>
                                Provide a product name and some keywords, then let AI write the descriptions for you.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-4 items-end">
                                <div className="flex-1 space-y-2">
                                    <FormLabel>Product Name</FormLabel>
                                    <Input 
                                        placeholder="e.g., Snail Repair Cream" 
                                        value={form.watch("name")}
                                        onChange={e => form.setValue("name", e.target.value)}
                                        disabled={isGenerating}
                                    />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <FormLabel>Keywords</FormLabel>
                                    <Input 
                                        placeholder="e.g., hydrating, for sensitive skin, anti-aging" 
                                        value={aiKeywords}
                                        onChange={e => setAiKeywords(e.target.value)}
                                        disabled={isGenerating}
                                    />
                                </div>
                                <Button 
                                    type="button" 
                                    onClick={handleGenerateDescription} 
                                    disabled={isGenerating || !form.watch("name") || !aiKeywords}
                                    className="h-10"
                                >
                                    {isGenerating ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Sparkles className="mr-2 h-4 w-4" />
                                    )}
                                    Generate Descriptions
                                </Button>
                            </div>
                            <FormDescription>Fill both fields and click Generate. Keywords should be comma-separated.</FormDescription>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Product Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Snail Repair Cream" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="brand"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Brand</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Glow & Flourish" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="slug"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Slug</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., snail-repair-cream" {...field} />
                                        </FormControl>
                                        <FormDescription>A unique, URL-friendly identifier.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Short Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="A short, catchy description for product cards." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="longDescription"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="The complete product description for the product page." rows={5} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="images"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Image URLs</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="https://placehold.co/600x600.png, https://... " {...field} />
                                        </FormControl>
                                         <FormDescription>Comma-separated list of image URLs. The first one will be the main image.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="ingredients"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ingredients</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Vitamin C, Hyaluronic Acid, Green Tea Extract" {...field} />
                                        </FormControl>
                                         <FormDescription>Comma-separated list of ingredients.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-1 space-y-8">
                     <Card>
                        <CardHeader><CardTitle>Organize</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="tags"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tags (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Serum, Hydration, Brightening" {...field} />
                                        </FormControl>
                                        <FormDescription>Comma-separated list of tags.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="skinType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Skin Type (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Oily, Dry, Combination" {...field} />
                                        </FormControl>
                                        <FormDescription>Comma-separated list of suitable skin types.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Pricing & Stock</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                             <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price (SEK)</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="1" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="stock"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Stock Quantity</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="1" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                              <FormField
                                control={form.control}
                                name="rating"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Initial Rating (Optional)</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.1" min="0" max="5" {...field} />
                                        </FormControl>
                                        <FormDescription>A rating from 0.0 to 5.0.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Images</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div {...getRootProps()} className="border-dashed border-2 p-4 rounded cursor-pointer mb-2">
                                <input {...getInputProps()} />
                                <p>Drag & drop images here, or click to select files</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {uploadedImages.map((img, idx) => (
                                    <div key={idx} className="relative">
                                      <img src={img} alt="Preview" className="w-24 h-24 object-cover rounded" />
                                      <button type="button" className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2" onClick={() => {
                                        setUploadedImages(uploadedImages.filter((_, i) => i !== idx));
                                        form.setValue("images", uploadedImages.filter((_, i) => i !== idx), { shouldValidate: true });
                                      }}>×</button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Long Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FormField
                              control={form.control}
                              name="longDescription"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Full Description</FormLabel>
                                  <FormControl>
                                    <RichTextEditor value={field.value} onChange={field.onChange} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                        </CardContent>
                    </Card>
                    <div className="space-y-2">
                        <Button type="submit" size="lg" className="w-full" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Product
                        </Button>
                        <Button variant="outline" size="lg" className="w-full" onClick={() => router.back()} disabled={isPending}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </form>

            {aiPreview && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
      <h2 className="text-2xl font-bold mb-2">AI Description Preview</h2>
      {aiPreview.description === 'Model unavailable or quota exceeded.' ? (
        <div className="text-red-600 mb-4">AI generation failed. Please check your API quota or try again later.</div>
      ) : (
        <>
          <p className="mb-2"><strong>Short Description:</strong> {aiPreview.description || 'No description generated.'}</p>
          <p className="mb-2"><strong>Long Description:</strong> {aiPreview.longDescription || 'No long description generated.'}</p>
          <p className="mb-2"><strong>Ingredients:</strong> {aiPreview.ingredients.length > 0 ? aiPreview.ingredients.join(', ') : 'No ingredients suggested.'}</p>
          <p className="mb-2"><strong>Tags:</strong> {aiPreview.tags.length > 0 ? aiPreview.tags.join(', ') : 'No tags suggested.'}</p>
          <img src={aiPreview.imageUrl || 'https://placehold.co/400x300'} alt="Preview" className="rounded-md w-full h-48 object-cover mb-2" />
        </>
      )}
      <div className="flex gap-4 mt-4">
        <Button
          onClick={() => {
            if (aiPreview.description && aiPreview.description !== 'Model unavailable or quota exceeded.') {
              form.setValue('description', aiPreview.description, { shouldValidate: true });
              form.setValue('longDescription', aiPreview.longDescription, { shouldValidate: true });
              form.setValue('ingredients', aiPreview.ingredients, { shouldValidate: true });
              form.setValue('tags', aiPreview.tags, { shouldValidate: true });
              form.setValue('images', [aiPreview.imageUrl], { shouldValidate: true });
              setAiPreview(null);
              toast({ title: 'Content Applied!', description: 'AI-generated content has been filled in.' });
            }
          }}
          disabled={aiPreview.description === 'Model unavailable or quota exceeded.'}
        >Apply</Button>
        <Button variant="outline" onClick={() => setAiPreview(null)}>Cancel</Button>
      </div>
    </div>
  </div>
)}
        </Form>
    )
}
