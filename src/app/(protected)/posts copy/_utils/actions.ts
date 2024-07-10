"use server";

import { createSafeAction } from "@/actions/utils";
import { db } from "@/lib/db";
import {
  TData,
  TCreateInput,
  createInputSchema,
  TOperator,
  TExpertise,
  TAddPlanningInput,
  addPlanningSchema,
  TPlanning,
  editInputSchema,
} from "./schemas";
import { Planning, Prisma } from "@prisma/client";

const defaultParams: Record<string, string> = {
  page: "1",
  perPage: "10",
};

const getOrderBy = (orderBy = "createdAt", or = "desc") => {
  const order: "asc" | "desc" = or === "desc" ? "desc" : "asc";
  if (orderBy === "createdAt") return { createdAt: order };
  if (orderBy === "name") return { name: order };
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

  const where: Prisma.PostWhereInput = {
    OR: params.search
      ? [
          {
            name: { contains: params.search, mode: "insensitive" },
          },
        ]
      : undefined,
  };

  const [result, total] = await Promise.all([
    db.post.findMany({
      where,
      take,
      skip,
      orderBy: getOrderBy(params.orderBy, params.order),
      select: {
        id: true,
        name: true,
        createdAt: true,
        expertises: {
          select: {
            id: true,
            name: true,
            operations: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        plannings: {
          where: { endDate: { gt: new Date() }, startDate: { lt: new Date() } },
          select: {
            commandProject: {
              select: { id: true, project: { select: { name: true } } },
            },
            operation: { select: { id: true, name: true } },
            operator: { select: { id: true, name: true, image: true } },
            startDate: true,
            endDate: true,
          },
        },
      },
    }),
    db.post.count({ where }),
  ]);

  const data = result;

  return { data, total };
}

export async function deleteById(id: string) {
  return await db.post.delete({ where: { id } });
}

const handler = async ({ expertises, ...data }: TCreateInput) => {
  const { ...rest } = data;
  const result = await db.post.create({
    data: {
      ...rest,
      expertises: { connect: expertises.map((id) => ({ id })) },
    },
  });
  return result;
};

export const create = createSafeAction({ scheme: createInputSchema, handler });
export interface TEditInput extends TCreateInput {
  postId: string;
}
const editPostHandler = async ({ postId, expertises, ...data }: TEditInput) => {
  const { ...rest } = data;
  const result = await db.post.update({
    where: { id: postId },
    data: {
      ...rest,
      expertises: { connect: expertises.map((id) => ({ id })) },
    },
  });
  return result;
};
export const edit = createSafeAction({
  scheme: editInputSchema,
  handler: editPostHandler,
});

const addPlanningHandler = async ({
  planningId,
  ...data
}: TAddPlanningInput) => {
  const select = {
    id: true,
    startDate: true,
    endDate: true,
    operator: { select: { name: true, image: true, id: true } },
    operation: { select: { name: true, id: true } },
  };
  if (!planningId)
    return await db.planning.create({
      data,
      select,
    });
  return await db.planning.update({ where: { id: planningId }, data, select });
};

export const addPlanning = createSafeAction({
  scheme: addPlanningSchema,
  handler: addPlanningHandler,
});

export async function getOperations({
  operationsInExpertises = [],
}: {
  operationsInExpertises?: string[];
}): Promise<TExpertise[]> {
  if (operationsInExpertises.length === 0)
    return await db.operation.findMany({
      select: { name: true, id: true },
    });
  return await db.operation.findMany({
    select: { name: true, id: true },
    where: { id: { in: operationsInExpertises } },
  });
}

export async function getOperators({
  operatorsInExperises = [],
}: {
  operatorsInExperises?: string[];
}) {
  if (operatorsInExperises.length === 0)
    return await db.user.findMany({
      select: {
        name: true,
        id: true,
        image: true,
      },
      where: {
        role: "OPERATOR",
      },
    });
  return await db.user.findMany({
    select: {
      name: true,
      id: true,
      image: true,
    },
    where: {
      role: "OPERATOR",
      expertises: { some: { id: { in: operatorsInExperises } } },
    },
  });
}

export async function getCommands() {
  return await db.command.findMany({ select: { reference: true, id: true } });
}
export async function getCommandProjects() {
  return await db.commandProject.findMany({
    select: { project: { select: { name: true, id: true } }, id: true },
  });
}

export async function getPlannings({
  postId,
}: {
  postId?: string;
}): Promise<TPlanning[]> {
  return await db.planning.findMany({
    where: { postId, endDate: { gt: new Date() } },
    select: {
      id: true,
      startDate: true,
      endDate: true,
      operator: { select: { name: true, image: true, id: true } },
      operation: { select: { name: true, id: true } },
      commandProject: {
        select: { project: { select: { id: true, name: true } }, id: true },
      },
    },
  });
}

export async function deletePlanning(id: string) {
  return await db.planning.delete({ where: { id } });
}

export async function getExpertises() {
  return await db.expertise.findMany({ select: { name: true, id: true } });
}
export async function createOperationHistory(
  command_project_id: string,
  post_id: string,
  operation_id: string,
  operator_id: string,
  count: number,
) {
  const operationHistory = await db.operationHistory.create({
    data: {
      commandProjectId: command_project_id,
      postId: post_id,
      operationId: operation_id,
      operatorId: operator_id,
      count: +count,
    },
  });
  // const operationHistory = await prisma.post.findMany({});
  console.log(operationHistory);
}
