"use server";

import { createSafeAction } from "@/actions/utils";
import { db } from "@/lib/db";
import {
  // TData,
  // TPost,
  TCreateInput,
  createInputSchema,
  TdeviceConfigInput,
  deviceConfigInputSchema,
} from "./schemas";
import { ActionType, EntityType, Planning, Prisma } from "@prisma/client";
import { Session } from "@/lib/auth";
import { logHistory } from "../../History/_utils/action";
import { revalidatePath } from "next/cache";
import { getServerSession } from "@/lib/auth";

const defaultParams: Record<string, string> = {
  page: "1",
  perPage: "10",
};

const getOrderBy = (orderBy = "createdAt", or = "desc") => {
  const order: "asc" | "desc" = or === "desc" ? "desc" : "asc";
  if (orderBy === "createdAt") return { createdAt: order };
  if (orderBy === "name") return { name: order };
  return { createdAt: "desc" as const };
};

export type TData = {
  id: string;
  deviceId: string;
  count: number | null;
  createdAt: Date;
  post: {
    id: string;
    name: string;
    plannings: {
      id: string;
      startDate: Date;
      endDate: Date;
      operation: { id: string; name: string }[];
    }[];
    expertises: {
      id: string;
      name: string;
      operations: { id: string; name: string }[];
    }[];
  } | null;
  planning: {
    commandProject: { id: string; project: { name: string } }[];
    startDate: Date;
    endDate: Date;
    operation: { id: string; name: string }[];
    operator: { id: string; name: string; image: string | null };
  } | null;
  user: {
    id: string;
    name: string;
  };
}[];

export async function findMany(params = defaultParams): Promise<{
  data: TData;
  total: number;
}> {
  const session = await getServerSession();
  const organizationId =
    session?.user.organizationId || session?.user.organization?.id;

  const page = Number.parseInt(params.page) || 1;
  const perPage = Number.parseInt(params.perPage) || 10;
  const skip = (page - 1) * perPage;
  const take = perPage;

  const where: Prisma.DeviceWhereInput = {
    organizationId,
    OR: params.search
      ? [
          {
            deviceId: { contains: params.search, mode: "insensitive" },
          },
        ]
      : undefined,
  };

  const [result, total] = await Promise.all([
    db.device.findMany({
      where,
      take,
      skip,
      orderBy: getOrderBy(params.orderBy, params.order),
      select: {
        id: true,
        deviceId: true,
        count: true,
        createdAt: true,
        post: {
          select: {
            id: true,
            name: true,
            plannings: {
              select: {
                id: true,
                startDate: true,
                endDate: true,
                operation: {
                  select: { id: true, name: true },
                },
              },
            },
            expertises: {
              select: {
                id: true,
                name: true,
                operations: {
                  select: {
                    operation: {
                      select: { id: true, name: true },
                    },
                  },
                },
              },
            },
          },
        },
        planning: {
          select: {
            commandProject: {
              select: { id: true, project: { select: { name: true } } },
            },
            startDate: true,
            endDate: true,
            operation: {
              select: { id: true, name: true },
            },
            operator: { select: { id: true, name: true, image: true } },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
    db.device.count({ where }),
  ]);

  const data: any = result.map((device) => ({
    ...device,
    post: device.post
      ? {
          ...device.post,
          plannings: device.post.plannings.map((planning) => ({
            ...planning,
            operation: [planning.operation],
          })),
          expertises: device.post.expertises.map((expertise) => ({
            ...expertise,
            operations: expertise.operations.map((op) => op.operation),
          })),
        }
      : null,
    planning: device.planning
      ? {
          ...device.planning,
          commandProject: [device.planning.commandProject],
          operation: [device.planning.operation],
        }
      : null,
  }));

  return { data, total };
}

export async function deleteById(id: string, userId: string) {
  const session = await getServerSession();
  const organizationId =
    session?.user.organizationId || session?.user.organization?.id;
  // if (!organizationId) {
  //   throw new Error("Organization ID not found");
  // }
  await db.device.deleteMany({
    where: {
      id,
      organizationId,
    },
  });
  await logHistory(
    ActionType.DELETE,
    "device deleted",
    EntityType.DEVICE,
    id,
    userId,
  );
}

// const handler = async (data: TCreateInput, session?: Session | null) => {
//   console.log("dddddddddd", session?.user.id);
//   const result = await db.device.create({
//     data: {
//       ...data,
//       userId: session?.user.id,
//     },
//   });
//   await logHistory(
//     ActionType.CREATE,
//     "device created",
//     EntityType.DEVICE,

//     result.id,
//     session?.user.id || "5dfd06ee-3555-4e72-9f1c-0647cf9428b5",
//   );
//   return result;
// };

// export const create = createSafeAction({ scheme: createInputSchema, handler });
interface CreateDeviceInput {
  deviceId: string;
  userId: string;
}

export async function createDevice({
  deviceId,
  userId,
}: CreateDeviceInput): Promise<{
  result?: any;
  error?: string;
  fieldErrors?: Record<string, string>;
}> {
  const session = await getServerSession();
  const organizationId =
    session?.user.organizationId || session?.user.organization?.id;
  if (!organizationId) {
    return { error: "Organization ID not found" };
  }

  try {
    const device = await db.device.create({
      data: {
        userId,
        deviceId,
        organizationId,
      },
    });

    await logHistory(
      ActionType.CREATE,
      "device created",
      EntityType.DEVICE,
      device.id,
      userId,
    );

    return { result: device };
  } catch (error) {
    console.error("Error creating device:", error);
    return { error: "Failed to create device" };
  }
}

export async function getPosts() {
  const session = await getServerSession();
  const organizationId =
    session?.user.organizationId || session?.user.organization?.id;
  // if (!organizationId) {
  //   throw new Error("Organization ID not found");
  // }

  return await db.post.findMany({
    where: { organizationId },
    select: {
      id: true,
      name: true,
      expertises: {
        select: {
          id: true,
          name: true,
          operations: {
            select: {
              operation: {
                select: { id: true, name: true },
              },
            },
          },
        },
      },
      plannings: {
        select: {
          id: true,
          operation: { select: { id: true, name: true } },
          startDate: true,
          endDate: true,
        },
      },
    },
  });
}

const deviceConfigHandler = async (
  data: TdeviceConfigInput,
  session?: Session | null,
) => {
  const result = await db.device.update({
    where: {
      id: data.id,
    },
    data: {
      ...data,
    },
  });
  return result;
};

export const configure = createSafeAction({
  scheme: deviceConfigInputSchema,
  handler: deviceConfigHandler,
});

export async function handleDelete(id: string, userId: string) {
  await deleteById(id, userId);
  revalidatePath("/devices");
}
