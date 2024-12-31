import { Description } from "@radix-ui/react-dialog";
import { z } from "zod";

export const createInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().optional(),

  description: z.string().optional(),
  operations: z.array(
    z.object({
      id: z.string().min(1, "Operation ID is required"),
      time: z.number().min(1, "Time must be at least 1 minute"),
      description: z.string().optional(),
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
  code: string | null;
  status: boolean;
  workFlowId: string | null;
}[];
