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
import bcrypt from "bcrypt";
import { Session, getServerSession } from "@/lib/auth";
import { uploadFile } from "@/actions/upload";
import { roleSchema } from "@/utils";
import { ActionType, EntityType, Prisma, Role } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { revalidatePath } from "next/cache";
import { logHistory } from "../../History/_utils/action";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

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
                expertise: {
                  name: {
                    contains: params.search,
                    mode: "insensitive",
                  },
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
        expertises: {
          select: {
            expertise: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        createdAt: true,
      },
    }),
    db.user.count({ where }),
  ]);

  // Transformer et filtrer les résultats pour correspondre à TData
  const transformedData: TData = result
    .filter(
      (user): user is typeof user & { organizationId: string } =>
        user.organizationId !== null,
    )
    .map((user) => ({
      id: user.id,
      role: user.role,
      organizationId: user.organizationId,
      name: user.name,
      email: user.email,
      image: user.image,
      expertises: user.expertises,
      createdAt: user.createdAt,
    }));

  return { data: transformedData, total };
}

export async function deleteById(id: string) {
  const session = await getServerSession();
  if (!session) throw new Error("Unauthorized");

  const user = await db.user.delete({
    where: {
      id,
    },
  });

  await logHistory(
    ActionType.DELETE,
    `User deleted: ${user.name}`,
    EntityType.USER,
    user.id,
    session.user.id,
  );

  return user;
}

const handler = async (data: TCreateInput, formData?: FormData | null) => {
  const session = await getServerSession();
  const organizationId =
    session?.user.organizationId || session?.user.organization?.id;

  if (!organizationId) {
    return { error: "Organization ID is not available" };
  }

  if (data.role === "SYS_ADMIN") {
    throw new Error("Cannot create SYS_ADMIN users");
  }

  const { password, expertise, ...rest } = data;
  const hashed = await bcrypt.hash(data.password, 12);

  const user = await db.user.create({
    data: {
      ...rest,
      password: hashed,
      organization: { connect: { id: organizationId } },
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

  await logHistory(
    ActionType.CREATE,
    `User created: ${user.name}`,
    EntityType.USER,
    user.id,
    session?.user.id,
  );

  return user;
};

// export const create = createSafeAction({ scheme: createInputSchema, handler });
interface CreateUser {
  name: string;
  email: string;
  password: string;
  role: Role;
  expertise?: string[];
}
export async function create({
  name,
  email,
  password,
  role,
  expertise,
}: CreateUser): Promise<{
  result?: any;
  error?: string;
  fieldErrors?: Record<string, string>;
}> {
  try {
    const session = await getServerSession();
    const organizationId =
      session?.user.organizationId || session?.user.organization?.id;

    if (!organizationId) {
      return { error: "Organization ID is not available" };
    }

    if (role === "SYS_ADMIN") {
      return { error: "Cannot create SYS_ADMIN users" };
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashed,
        role,
        organization: { connect: { id: organizationId } },
        expertises: expertise?.length
          ? { connect: expertise.map((id) => ({ id })) }
          : undefined,
      },
    });

    // Optionally log the creation
    // await logHistory(
    //   ActionType.CREATE,
    //   `User created: ${user.name}`,
    //   EntityType.USER,
    //   user.id,
    //   session?.user.id
    // );

    // Revalidate the users list page
    revalidatePath("/users");

    return { result: user };
  } catch (error: any) {
    console.error("Error creating user:", error);

    if (error.code === "P2002") {
      return { fieldErrors: { email: "This email is already in use." } };
    }

    return { error: error.message || "Failed to create user" };
  }
}

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
  console.log("this is oooo", organizationId);

  if (data.role === "SYS_ADMIN") {
    throw new Error("Cannot create SYS_ADMIN users");
  }

  const { password, ...rest } = data;
  const hashed = password ? await bcrypt.hash(password, 12) : undefined;

  // Créer l'objet 'where' conditionnellement
  const whereClause: any = { id: userId };
  if (organizationId) {
    whereClause.organizationId = organizationId;
  }

  const user = await db.user.update({
    where: whereClause,
    data: {
      ...rest,
      password: hashed,
      expertises: expertise?.length
        ? { connect: expertise.map((id) => ({ id })) }
        : undefined,
    },
  });

  await logHistory(
    ActionType.UPDATE,
    `User updated: ${user.name}`,
    EntityType.USER,
    user.id,
    session!.user.id,
  );

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
      expertises: {
        select: {
          expertise: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      createdAt: true,
    },
  });

  return user;
}

export async function handleDelete(id: string) {
  await deleteById(id);
  revalidatePath("/users");
}

export async function deleteOperationById(id: string) {
  const session = await getServerSession();
  const organizationId = await checkUserPermissions(session);

  const whereClause: any = { id };
  if (organizationId) {
    whereClause.organizationId = organizationId;
  }

  await db.$transaction(async (tx) => {
    await tx.projectOperation.deleteMany({
      where: { operationId: id },
    });

    await tx.operation.delete({ where: whereClause });
  });
}

export async function handleDeleteO(id: string) {
  await deleteOperationById(id);
  revalidatePath("/users");
}

export async function updateOperation({
  operationId,
  name,
  code,
  description,
  isFinal,
  // estimatedTime,
  user,
}: {
  operationId: string;
  name: string;
  code: string;
  description: string;
  isFinal: boolean;
  // estimatedTime: number;
  user: string;
}): Promise<{
  result?: any;
  error?: string;
  fieldErrors?: Record<string, string>;
}> {
  try {
    const operation = await db.operation.update({
      where: { id: operationId },
      data: {
        name,
        code,
        description,
        isFinal,
      },
    });

    // await logHistory(
    //   ActionType.UPDATE,
    //   `Operation updated: ${name} by user ${user}`,
    //   EntityType.OPERATION,
    //   operation.id,
    //   user,
    // );

    return { result: operation };
  } catch (error: any) {
    const fieldErrors: Record<string, string> = {};

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        fieldErrors[error.meta?.target as string] =
          "This value is already taken.";
      }
    }

    return { error: error.message, fieldErrors };
  }
}

const operationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  description: z.string().optional(),
  isFinal: z.boolean().default(false),
});

type OperationInput = z.infer<typeof operationSchema>;

export async function createOperation(data: OperationInput) {
  const session = await getServerSession();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const organizationId = session.user.organizationId;
  if (!organizationId) {
    throw new Error("User is not associated with an organization");
  }

  const validatedFields = operationSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { name, code, description, isFinal } = validatedFields.data;

  try {
    await db.operation.create({
      data: {
        id: uuidv4(),
        name,
        code,
        description,
        isFinal,
        organizationId,
      },
    });

    revalidatePath("/operations");
    return { success: true };
  } catch (error) {
    console.error("Error creating operation:", error);
    return { error: "Failed to create operation" };
  }
}
