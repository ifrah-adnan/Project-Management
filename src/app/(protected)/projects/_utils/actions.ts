"use server";

import { createSafeAction } from "@/actions/utils";
import { db } from "@/lib/db";
import {
  TData,
  TCreateInput,
  createInputSchema,
  TConfigureSprint,
  configureSpringSchema,
  createInputSchemaForUpdate,
  updateDoneValueSchema,
} from "./schemas";
import { $Enums, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { FieldErrors } from "react-hook-form";
import { connect } from "http2";
import { getServerSession } from "@/lib/auth";

const defaultParams: Record<string, string> = {
  page: "1",
  perPage: "10",
};

export interface CommandProject {
  id: string;
  commandId: string;
  projectId: string;
  target: number;
  done: number;
  startDate: Date | null;
  endDate: Date;
  status: "ACTIVE" | "ON_HOLD" | "COMPLETED" | "CANCELLED";
  createdAt: Date;
  updatedAt: Date;
  sprint: {
    target: number;
    days: number;
  } | null;
}

const getOrderBy = (orderBy = "createdAt", or = "desc") => {
  const order: "asc" | "desc" = or === "desc" ? "desc" : "asc";
  if (orderBy === "createdAt") return { createdAt: order };
  return { createdAt: "desc" as "desc" };
};

export async function findMany(params = defaultParams): Promise<{
  data: TData;
  total: number;
}> {
  const session = await getServerSession();
  const organizationId =
    session?.user.organizationId || session?.user.organization?.id;

  if (!organizationId) {
    throw new Error("User is not associated with an organization");
  }

  const page = parseInt(params.page) || 1;
  const perPage = parseInt(params.perPage) || 10;
  const skip = (page - 1) * perPage;
  const take = perPage;

  const where: Prisma.CommandProjectWhereInput = {
    OR: params.search
      ? [
          {
            project: {
              name: {
                contains: params.search,
                mode: "insensitive",
              },
            },
          },
          {
            command: {
              reference: {
                contains: params.search,
                mode: "insensitive",
              },
            },
          },
          {
            command: {
              client: {
                name: {
                  contains: params.search,
                  mode: "insensitive",
                },
              },
            },
          },
        ]
      : undefined,
  };
  const orderBy = getOrderBy(params.orderBy, params.order);

  const result = await db.commandProject.findMany({
    select: {
      id: true,
      organizationId: true,
      project: { select: { name: true, status: true, id: true } },
      command: {
        select: {
          client: { select: { name: true, image: true } },
          reference: true,
          id: true,
        },
      },
      user: {
        select: { id: true, name: true },
      },
      sprint: { select: { days: true, target: true } },
      target: true,
      done: true,
      endDate: true,
      status: true,
      createdAt: true,
    },
    orderBy,
    take,
    skip,
  });

  const total = await db.commandProject.count({ where });

  const data = result;

  return { data, total };
}

export async function deleteById(id: string) {
  const session = await getServerSession();
  const organizationId =
    session?.user.organizationId || session?.user.organization?.id;
  const project = await db.project.findFirst({
    where: { id, organizationId },
  });

  if (!project) {
    throw new Error(
      "Project not found or you don't have permission to delete it",
    );
  }

  return await db.project.delete({ where: { id } });
}

export async function getSprint(commandProjectId: string) {
  return await db.sprint.findUnique({
    where: {
      commandProjectId,
    },
  });
}

const configureSpringHandler = async (data: TConfigureSprint) => {
  const { commandProjectId } = data;
  return db.sprint.upsert({
    where: { commandProjectId },
    update: { ...data },
    create: { ...data, commandProjectId },
  });
};

export const configureSprint = createSafeAction({
  scheme: configureSpringSchema,
  handler: configureSpringHandler,
});

const handler = async (data: TCreateInput) => {
  const user = await db.commandProject.create({
    data: {
      commandId: data.command_id,
      projectId: data.project_id,
      target: data.target,
      endDate: data.endDate,
    },
  });
  return user;
};

export const create = createSafeAction({ scheme: createInputSchema, handler });

interface CommandProjectInput {
  command_id: string;
  project_id: string;
  target: number;
  endDate: Date;
}
export async function createCommandProject(
  data: TCreateInput,
  userId: string,
): Promise<{
  result?: any;
  fieldErrors?: Record<string, string>;
  error?: string;
}> {
  const session = await getServerSession();
  const organizationId =
    session?.user.organizationId || session?.user.organization?.id;

  if (!organizationId) {
    return { error: "User is not associated with an organization" };
  }

  const command = await db.command.findFirst({
    where: { id: data.command_id },
  });
  const project = await db.project.findFirst({
    where: { id: data.project_id },
  });

  if (!command || !project) {
    return { error: "Invalid command or project for this organization" };
  }
  const commandProject = await db.commandProject.create({
    data: {
      commandId: data.command_id,
      projectId: data.project_id,
      target: data.target,
      endDate: data.endDate,
      userId: userId,
      organizationId,
    },
  });
  return { result: commandProject };
}

export interface TEditInput {
  projectToUpdateId?: string;
  commandId: string;
  projectId: string;
  target: number;
  endDate: Date;
  status: $Enums.Status;
}
const updateHandler = async ({ projectToUpdateId, ...data }: TEditInput) => {
  const { ...rest } = data;
  const user = await db.commandProject.update({
    where: { id: projectToUpdateId },
    data: {
      ...rest,
    },
  });
  return user;
};

export const edit = createSafeAction({
  scheme: createInputSchemaForUpdate,
  handler: updateHandler,
});

export async function getProjectsNotInCommand(commandId: string) {
  const serverSession = await getServerSession();
  const organizationId =
    serverSession?.user.organizationId || serverSession?.user.organization?.id;

  return await db.project.findMany({
    where: {
      organizationId: organizationId,
      commandProjects: {
        every: {
          commandId: { not: commandId },
        },
      },
    },
  });
}

export async function deleteCommandProjectById(id: string) {
  return await db.commandProject.delete({ where: { id } });
}

export async function handleDeleteCommandProject(itemId: string) {
  await deleteCommandProjectById(itemId);
  revalidatePath("/projects");
}

export interface TUpdateValueInput {
  projectToUpdateId?: string;
  done: number;
}

const updateDoneValueHandler = async ({
  projectToUpdateId,
  ...data
}: TUpdateValueInput) => {
  const { ...rest } = data;
  const user = await db.commandProject.update({
    where: { id: projectToUpdateId },
    data: {
      ...rest,
    },
  });
  return user;
};
export const editDoneValue = createSafeAction({
  scheme: updateDoneValueSchema,
  handler: updateDoneValueHandler,
});

export async function getCommandProject(
  id: string,
): Promise<CommandProject | null> {
  return await db.commandProject.findUnique({
    where: { id },
    select: {
      id: true,
      commandId: true,
      projectId: true,
      target: true,
      done: true,
      startDate: true,
      endDate: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      sprint: {
        select: {
          target: true,
          days: true,
        },
      },
    },
  });
}
