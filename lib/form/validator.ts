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

export const SprintSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  startDate: z.date(),
  endDate: z.date(),
  projectId: z.string()
});
export const issueSchema = z.object({
  title: z.string().min(1, "Title is required"),
  assigneeId: z.string().cuid("Please select assignee"),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
});


export type SprintFormData = z.infer<typeof SprintSchema>;
export type IssueFormData = z.infer<typeof issueSchema>;