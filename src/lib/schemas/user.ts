import * as z from 'zod';

export const profileFormSchema = z.object({
  displayName: z.string().min(2, { message: "Name must be at least 2 characters." }),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
