import { z } from "zod";

export const tweetCreateFormSchema = z.object({
  content: z
    .string()
    .min(1, "Tweet content cannot be empty")
    .max(280, "Tweet cannot exceed 280 characters"),
  mediaUrl: z
    .string()
    .url("Must be a valid URL (e.g., http://example.com/image.jpg)")
    .optional()
    .or(z.literal("")),
});

export type TweetCreateFormValues = z.infer<typeof tweetCreateFormSchema>;

export const tweetUpdateFormSchema = z.object({
  content: z.string().max(280, "Tweet cannot exceed 280 characters").optional(),
  mediaUrl: z
    .string()
    .url("Must be a valid URL")
    .nullable()
    .optional()
    .or(z.literal("")),
});

export type TweetUpdateFormValues = z.infer<typeof tweetUpdateFormSchema>;
