import { z } from "zod";

export const createInputSchema = z.object({
  deviceId: z.string().min(4, {
    message: "deviceId must be at least 4 characters long",
  }),
  postId: z.string(),
  planningId: z.string().optional(),
  count: z.number().int().optional(),
});

export type TCreateInput = z.infer<typeof createInputSchema>;

export type TData = {
  planning: {
    commandProject: { id: string; project: { name: string } };
    startDate: Date;
    endDate: Date;
    operation: {
      id: string;
      name: string;
    };
    operator: {
      id: string;
      name: string;
      image: string | null;
    };
  } | null;
  deviceId: string;
  post: TPost | null;
  count: number;
  id: string;
  createdAt: Date;
  user: {
    id: string;
    name: string;
  }[];
}[];

export type TPost = {
  expertises: {
    operations: {
      name: string;
      id: string;
    }[];
    name: string;
    id: string;
  }[];
  plannings: {
    startDate: Date;
    endDate: Date;
    operation: {
      id: string;
      name: string;
    };
    id: string;
  }[];
  name: string;
  id: string;
};

export const deviceConfigInputSchema = z.object({
  id: z.string().uuid(),
  deviceId: z.string().min(4, {
    message: "deviceId must be at least 4 characters long",
  }),
  postId: z.string(),
  planningId: z.string().optional(),
  count: z.number().int().optional(),
});

export type TdeviceConfigInput = z.infer<typeof deviceConfigInputSchema>;
