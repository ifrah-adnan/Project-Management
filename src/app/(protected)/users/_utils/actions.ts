"use server";

import { createSafeAction } from "@/actions/utils";
import { db } from "@/lib/db";
import {
  TData,
  TCreateInput,
  createInputSchema,
  updateInputSchema,
  TUpdateInput,
} from "./schemas";
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import { Session, getServerSession } from "@/lib/auth";
import { uploadFile } from "@/actions/upload";
import { roleSchema } from "@/utils";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { revalidatePath } from "next/cache";

const defaultParams: Record<string, string> = {
  page: "1",
  perPage: "10",
};

const getOrderBy = (orderBy = "createdAt", or = "desc") => {
  const order: "asc" | "desc" = or === "desc" ? "desc" : "asc";
  if (orderBy === "createdAt") return { createdAt: order };
  if (orderBy === "name") return { name: order };
  if (orderBy === "email") return { email: order };
  return { createdAt: "desc" as "desc" };
};

async function checkUserPermissions(session: Session | null) {
  if (!session || !["SYS_ADMIN", "ADMIN"].includes(session.user.role)) {
    throw new Error("Insufficient permissions");
  }
  return session.user.organization?.id;
}

export async function findMany(params = defaultParams): Promise<{
  data: TData;
  total: number;
}> {
  const session = await getServerSession();

  const page = parseInt(params.page) || 1;
  const perPage = parseInt(params.perPage) || 10;
  const skip = (page - 1) * perPage;
  const take = perPage;

  const parsedRole = roleSchema.safeParse(params.role);

  const where: Prisma.UserWhereInput = {
    OR: params.search
      ? [
          {
            name: { contains: params.search, mode: "insensitive" },
          },
          {
            email: { contains: params.search, mode: "insensitive" },
          },
          {
            expertises: {
              some: {
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

  const [result, total] = await Promise.all([
    db.user.findMany({
      where,
      take,
      skip,
      orderBy: getOrderBy(params.orderBy, params.order),
      select: {
        id: true,
        role: true,
        organizationId: true,
        name: true,
        email: true,
        image: true,
        password: true,
        expertises: { select: { name: true, id: true } },
        createdAt: true,
      },
    }),
    db.user.count({ where }),
  ]);

  return { data: result, total };
}

export async function deleteById(id: string) {
  return await db.user.delete({
    where: {
      id,
    },
  });
}

const handler = async (data: TCreateInput, formData?: FormData | null) => {
  const sessionUser = await getServerSession();

  const { password, expertise, ...rest } = data;
  const hashed = await bcrypt.hash(data.password, 12);

  const user = await db.user.create({
    data: {
      ...rest,
      password: hashed,
      organization: { connect: { id: sessionUser?.user.organizationId } },

      expertises: expertise?.length
        ? { connect: expertise.map((id) => ({ id })) }
        : undefined,
    },
  });

  const image = formData?.get("file") as File | undefined;
  if (image) {
    const { url } = await uploadFile(image);
    await db.user.update({
      where: { id: user.id },
      data: { image: url },
    });
  }
  return user;
};

export const create = createSafeAction({ scheme: createInputSchema, handler });

export async function getPosts() {
  const session = await getServerSession();
  const organizationId = await checkUserPermissions(session);

  return await db.post.findMany({
    where: { organizationId },
    select: { id: true, name: true },
  });
}

export async function getExpertises() {
  const session = await getServerSession();
  const organizationId = await checkUserPermissions(session);

  return await db.expertise.findMany({
    where: { organizationId },
    select: { id: true, name: true },
  });
}
export interface TEditInput extends TCreateInput {
  userId: string;
}

const editHandler = async ({ userId, expertise, ...data }: TUpdateInput) => {
  const session = await getServerSession();
  const organizationId = await checkUserPermissions(session);

  const { password, ...rest } = data;
  const hashed = password ? await bcrypt.hash(password, 12) : undefined;
  const user = await db.user.update({
    where: { id: userId, organizationId },
    data: {
      ...rest,
      password: hashed,
      expertises: expertise?.length
        ? { connect: expertise.map((id) => ({ id })) }
        : undefined,
    },
  });
  return user;
};

export const update = createSafeAction({
  scheme: updateInputSchema,
  handler: editHandler,
});
export async function findUserById(id: string): Promise<any> {
  const user = await db.user.findUnique({
    where: { id },
    select: {
      id: true,
      role: true,
      name: true,
      email: true,
      image: true,
      expertises: { select: { name: true, id: true } },
      createdAt: true,
    },
  });

  return user;
}

export async function handleDelete(id: string) {
  await deleteById(id);
  revalidatePath("/users");
}
