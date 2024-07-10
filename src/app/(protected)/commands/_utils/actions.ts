"use server";

import { CustomError, createSafeAction } from "@/actions/utils";
import { db } from "@/lib/db";
import {
  TData,
  TCreateInput,
  createInputSchema,
  createInputSchemaforUpdate,
  TData2,
} from "./schemas";
import { ActionType, EntityType, Prisma } from "@prisma/client";
import { logHistory } from "../../History/_utils/action";
import { comma } from "postcss/lib/list";
import { revalidatePath } from "next/cache";

const defaultParams: Record<string, string> = {
  page: "1",
  perPage: "10",
};

const getOrderBy = (orderBy = "createdAt", or = "desc") => {
  const order: "asc" | "desc" = or === "desc" ? "desc" : "asc";
  if (orderBy === "createdAt") return { createdAt: order };
  if (orderBy === "target") return { target: order };
  if (orderBy === "product") return { product: { name: order } };
  if (orderBy === "project") return { project: { name: order } };
  if (orderBy === "deadline") return { deadline: order };
  return { createdAt: "desc" as "desc" };
};

export async function findMany(params = defaultParams): Promise<{
  data: TData;
  total: number;
}> {
  const page = parseInt(params.page) || 1;
  const perPage = parseInt(params.perPage) || 10;
  const skip = (page - 1) * perPage;
  const take = perPage;

  const where: Prisma.CommandWhereInput = {
    OR: params.search
      ? [
          {
            reference: { contains: params.search, mode: "insensitive" },
          },
          {
            client: { name: { contains: params.search, mode: "insensitive" } },
          },
        ]
      : undefined,
  };
  const [result, total] = await Promise.all([
    db.command.findMany({
      where,
      take,
      skip,
      orderBy: getOrderBy(params.orderBy, params.order),
      select: {
        id: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },

        reference: true,
        client: { select: { id: true, name: true, image: true } },
        commandProjects: {
          select: {
            project: { select: { name: true, status: true } },
            target: true,
            endDate: true,
            status: true,
          },
        },
      },
    }),
    db.command.count({ where }),
  ]);

  const data = result;
  return { data, total };
}

export async function deleteById(id: string, userId: string) {
  await db.commandProject.deleteMany({ where: { commandId: id } });

  const deletedCommand = await db.command.delete({ where: { id } });

  await logHistory(
    ActionType.DELETE,
    `Command ${deletedCommand.reference} deleted`,
    EntityType.COMMAND,
    id,
    userId,
  );
}
const handler = async (data: TCreateInput) => {
  const user = await db.command.create({
    data: {
      reference: data.reference,
      client: data.clientId ? { connect: { id: data.clientId } } : undefined,
      commandProjects: {
        createMany: {
          data: data.commandProjects.map((cp) => ({
            endDate: cp.endDate,
            projectId: cp.projectId,
            target: cp.target,
          })),
        },
      },
    },
  });
  return user;
};

export const create = createSafeAction({ scheme: createInputSchema, handler });

interface CreateCommandInput {
  reference: string;
  clientId: string;
  commandProjects: {
    projectId: string;
    target: number;
    endDate: Date;
  }[];
  userId: string;
}

export async function createCommandd({
  reference,
  clientId,
  commandProjects,
  userId,
}: CreateCommandInput): Promise<{
  result?: any;
  error?: string;
  fieldErrors?: Record<string, string>;
}> {
  const command = await db.command.create({
    data: {
      reference,
      client: clientId ? { connect: { id: clientId } } : undefined,
      commandProjects: {
        createMany: {
          data: commandProjects.map((cp) => ({
            endDate: cp.endDate,
            projectId: cp.projectId,
            target: cp.target,
          })),
        },
      },
      user: userId ? { connect: { id: userId } } : undefined,
    },
  });
  await logHistory(
    ActionType.CREATE,
    "command created",
    EntityType.COMMAND,

    command.id,
    userId,
  );
  return { result: command };
}

export async function getProjectsNames() {
  return await db.project.findMany({
    select: { id: true, name: true },
  });
}

export async function getCommands() {
  return await db.command.findMany({
    select: { reference: true, id: true },
  });
}
export async function getProjects() {
  return await db.project.findMany({
    select: { name: true, id: true },
  });
}

export async function getClients() {
  return await db.user.findMany({
    select: { name: true, id: true, image: true },
    where: { role: "CLIENT" },
  });
}

export interface TEditInput {
  commandId?: string;
  reference: string;
  clientId: string;
}

const createCommandHandler = async (data: TEditInput) => {
  const user = await db.command.create({
    data: {
      reference: data.reference,
      client: data.clientId ? { connect: { id: data.clientId } } : undefined,
    },
  });
  return user;
};

export const createCommand = createSafeAction({
  scheme: createInputSchemaforUpdate,
  handler: createCommandHandler,
});

const editCommandHandler = async ({ commandId, ...data }: TEditInput) => {
  const { ...rest } = data;
  const result = await db.command.update({
    where: { id: commandId },
    data: {
      ...rest,
    },
  });
  return result;
};

export const edit = createSafeAction({
  scheme: createInputSchemaforUpdate,
  handler: editCommandHandler,
});
export async function handleDelete(id: string, userId: string) {
  await deleteById(id, userId);
  revalidatePath("/commands");
}
