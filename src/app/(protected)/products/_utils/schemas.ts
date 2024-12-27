import { z } from "zod";

export const createInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  operations: z.array(
    z.object({
      id: z.string().min(1, "Operation ID is required"),
      time: z.number().min(1, "Time must be at least 1 minute"),
    }),
  ),
});
export const updateInputSchema = createInputSchema.extend({
  id: z.string(),
});

export type TCreateInput = z.infer<typeof createInputSchema>;
export type TUpdateInput = z.infer<typeof updateInputSchema>;

export type TData = {
  createdAt: Date;
  name: string;
  id: string;
  status: boolean;
  workFlowId: string | null;
}[];
