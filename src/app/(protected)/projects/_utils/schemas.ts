import { projectsStatus } from "@/utils";
import { Status } from "@prisma/client";
import { z } from "zod";

export const createInputSchema = z.object({
  projectToUpdateId: z.string().uuid().optional(),
  command_id: z.string().min(1, { message: "Client is required" }),
  project_id: z.string().min(1, { message: "Project is required" }),
  target: z.number().int(),
  endDate: z.date(),
});

export const configureSpringSchema = z.object({
  commandProjectId: z.string().min(2, {
    message: "name must be at least 2 characters long",
  }),
  target: z.number().min(1, {
    message: "target must be at least 1",
  }),
  days: z.number().min(1, {
    message: "days must be at least 1",
  }),
});

export type TCreateInput = z.infer<typeof createInputSchema>;

export type TConfigureSprint = z.infer<typeof configureSpringSchema>;

export type TData = {
  id: string;
  createdAt: Date;
  status: Status;
  project: {
    id: string;
    name: string;
    status: boolean;
  };
  command: {
    id: string;
    client: {
      name: string;
      image: string | null;
    } | null;
    reference: string;
  };
  sprint: {
    target: number;
    days: number;
  } | null;
  target: number;
  done: number;
  endDate: Date;
  user: {
    id: string;
    name: string;
  };
  organizationId: string;
}[];

export type TProjectNotInCommand = {
  id: string;
  name: string;
  description: string | null;
  status: boolean;
  workFlowId: string | null;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
}[];

export const createInputSchemaForUpdate = z.object({
  projectToUpdateId: z.string().uuid().optional(),
  commandId: z.string().min(1, { message: "Client is required" }),
  projectId: z.string().min(1, { message: "Project is required" }),
  target: z.number().int(),
  endDate: z.date(),
  status: z.enum(["ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED"]),
});

export const updateDoneValueSchema = z.object({
  projectToUpdateId: z.string().uuid().optional(),
  done: z.number().int(),
});

export const operationSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(255, "Name must be at most 255 characters long"),
  code: z
    .string()
    .min(3, "Code must be at least 3 characters long")
    .max(50, "Code must be at most 50 characters long"),
  icon: z.string().optional(),
  description: z.string().optional(),
  isFinal: z.boolean().default(false),
});

export type OperationFormData = z.infer<typeof operationSchema>;
