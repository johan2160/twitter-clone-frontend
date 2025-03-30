import { z } from "zod";

export const responseCreateFormSchema = z.object({
  body: z.string().min(1, "Response body cannot be empty").max(280),
  mediaUrl: z
    .string()
    .url("Invalid URL format")
    .or(z.literal(""))
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
});

export type ResponseCreateFormValues = z.infer<typeof responseCreateFormSchema>;

export const responseUpdateFormSchema = z
  .object({
    body: z.string().min(1).max(280).optional(),
    mediaUrl: z
      .string()
      .url("Invalid URL format")
      .or(z.literal(""))
      .nullable()
      .optional()
      .transform((val) => (val === "" ? null : val)),
  })
  .refine((data) => data.body !== undefined || data.mediaUrl !== undefined, {
    message:
      "At least one field (body or mediaUrl) must be provided for update.",
    path: ["body"],
  })
  .refine(
    (data) =>
      (data.body !== undefined && data.body.trim() !== "") ||
      data.mediaUrl !== undefined,
    {
      message: "Update requires at least some content or a media URL.",
      path: ["body"],
    }
  );

export type ResponseUpdateFormValues = z.infer<typeof responseUpdateFormSchema>;
