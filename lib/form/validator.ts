import { z } from "zod";
export const projectSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  key: z.string().min(1, "Key is required").max(100, "Key is too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description is too long")
    .optional(),
});

export type ProjectData = z.infer<typeof projectSchema>;
