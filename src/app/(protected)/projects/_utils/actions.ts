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
import { getServerSession, Session } from "@/lib/auth";

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

async function getSessionAndOrganizationId(): Promise<{
  session: Session;
  organizationId: string;
}> {
  const session = await getServerSession();
  if (
    !session ||
    !session.user.organization?.id ||
    session.user.role !== "SYS_ADMIN"
  )
    throw new Error("Unauthorized");
  return { session, organizationId: session.user.organization.id };
}

export async function findMany(params = defaultParams): Promise<{
  data: TData;
  total: number;
}> {
  const { organizationId } = await getSessionAndOrganizationId();

  const page = parseInt(params.page) || 1;
  const perPage = parseInt(params.perPage) || 10;
  const skip = (page - 1) * perPage;
  const take = perPage;

  const where: Prisma.CommandProjectWhereInput = {
    organizationId,
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
    where,
    select: {
      id: true,
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

  const data = result.map((item) => ({
    ...item,
    organizationId: organizationId,
  }));
  return { data: data, total };
}
export async function deleteById(id: string) {
  const { organizationId } = await getSessionAndOrganizationId();
  return await db.project.deleteMany({
    where: { id, organizationId },
  });
}

export async function getSprint(commandProjectId: string) {
  const { organizationId } = await getSessionAndOrganizationId();
  return await db.sprint.findFirst({
    where: {
      commandProjectId,
      commandProject: { organizationId },
    },
  });
}

const configureSpringHandler = async (data: TConfigureSprint) => {
  const { organizationId } = await getSessionAndOrganizationId();
  const { commandProjectId, ...sprintData } = data;
  return db.sprint.upsert({
    where: { commandProjectId },
    update: { ...sprintData },
    create: { ...sprintData, commandProjectId, organizationId },
  });
};

export const configureSprint = createSafeAction({
  scheme: configureSpringSchema,
  handler: configureSpringHandler,
});

const handler = async (data: TCreateInput) => {
  const { organizationId } = await getSessionAndOrganizationId();
  const user = await db.commandProject.create({
    data: {
      ...data,
      organizationId,
    },
  });
  return user;
};

export const create = createSafeAction({ scheme: createInputSchema, handler });

export async function createCommandProject(
  data: TCreateInput,
  userId: string,
): Promise<{
  result?: any;
  fieldErrors?: Record<string, string>;
  error?: string;
}> {
  const { organizationId } = await getSessionAndOrganizationId();
  const commandProject = await db.commandProject.create({
    data: {
      ...data,
      userId,
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
  const { organizationId } = await getSessionAndOrganizationId();
  const user = await db.commandProject.updateMany({
    where: { id: projectToUpdateId, organizationId },
    data: {
      ...data,
    },
  });
  return user;
};

export const edit = createSafeAction({
  scheme: createInputSchemaForUpdate,
  handler: updateHandler,
});

export async function getProjectsNotInCommand(commandId: string) {
  const { organizationId } = await getSessionAndOrganizationId();
  return await db.project.findMany({
    where: {
      organizationId,
      commandProjects: {
        every: {
          commandId: { not: commandId },
        },
      },
    },
  });
}

export async function deleteCommandProjectById(id: string) {
  const { organizationId } = await getSessionAndOrganizationId();
  return await db.commandProject.deleteMany({
    where: { id, organizationId },
  });
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
  const { organizationId } = await getSessionAndOrganizationId();
  const user = await db.commandProject.updateMany({
    where: { id: projectToUpdateId, organizationId },
    data: {
      ...data,
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
  const { organizationId } = await getSessionAndOrganizationId();
  return await db.commandProject.findFirst({
    where: { id, organizationId },
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
