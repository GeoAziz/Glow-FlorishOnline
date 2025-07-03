import * as z from 'zod';

export const reviewFormSchema = z.object({
  productId: z.string(),
  slug: z.string(),
  rating: z.coerce.number().min(1, "Rating is required.").max(5),
  text: z.string().min(10, { message: "Review must be at least 10 characters." }),
  author: z.string(),
});

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;
