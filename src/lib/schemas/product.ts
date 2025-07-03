import * as z from 'zod';

export const productFormSchema = z.object({
  name: z.string().min(3, { message: 'Product name must be at least 3 characters.' }),
  slug: z.string().min(3, { message: 'Slug must be at least 3 characters.' })
    .regex(/^[a-z0-9-]+$/, { message: 'Slug can only contain lowercase letters, numbers, and hyphens.' }),
  description: z.string().min(10, { message: 'Short description must be at least 10 characters.' }),
  longDescription: z.string().min(20, { message: 'Full description must be at least 20 characters.' }),
  price: z.coerce.number().min(0, { message: 'Price must be a positive number.' }),
  stock: z.coerce.number().int().min(0, { message: 'Stock must be a non-negative integer.' }),
  category: z.enum(['Skin', 'Hair', 'Wellness', 'Makeup']),
  images: z.string().min(1, { message: 'Please provide at least one image URL.' })
    .transform(val => val.split(',').map(s => s.trim()).filter(url => url)),
  ingredients: z.string().min(1, { message: 'Please list at least one ingredient.' })
    .transform(val => val.split(',').map(s => s.trim())),
  tags: z.string().optional()
    .transform(val => val ? val.split(',').map(s => s.trim()) : []),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
