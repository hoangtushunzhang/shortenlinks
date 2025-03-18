import {z} from 'zod';

export const UrlSchema = z.object({
    url: z.string().url("Please enter a valid URL"),
})

export type UrlFormData = z.infer<typeof UrlSchema>