"use server";

import { createSafeAction } from "@/actions/utils";
import { db } from "@/lib/db";
import { TData, TCreateInput, createInputSchema } from "./schemas";
import { Prisma } from "@prisma/client";

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

  const where: Prisma.ProjectWhereInput = {
    OR: params.search
      ? [{ name: { contains: params.search, mode: "insensitive" } }]
      : undefined,
  };
  const orderBy = getOrderBy(params.orderBy, params.order);

  const result = await db.project.findMany({
    where,
    select: {
      id: true,
      name: true,
      workFlowId: true,
      status: true,
      // commandProjects: true,
      createdAt: true,
    },
    orderBy,
    take,
    skip,
  });

  const total = await db.project.count({ where });

  const data = result;

  return { data, total };
}

export async function deleteById(id: string) {
  return await db.project.delete({ where: { id } });
}

const handler = async (data: TCreateInput) => {
  const result = await db.project.create({
    data,
  });
  return result;
};

export const create = createSafeAction({ scheme: createInputSchema, handler });
