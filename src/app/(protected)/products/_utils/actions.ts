"use server";

import { createSafeAction } from "@/actions/utils";
import { db } from "@/lib/db";
import {
  TData,
  TCreateInput,
  createInputSchema,
  TUpdateInput,
} from "./schemas";
import { Prisma } from "@prisma/client";
import { getServerSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { log } from "console";

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
  const session = await getServerSession();
  const organizationId =
    session?.user.organizationId || session?.user.organization?.id;

  const page = parseInt(params.page) || 1;
  const perPage = parseInt(params.perPage) || 10;
  const skip = (page - 1) * perPage;
  const take = perPage;

  const where: Prisma.ProjectWhereInput = {
    organizationId,
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
  const session = await getServerSession();
  const organizationId =
    session?.user.organizationId || session?.user.organization?.id;
  const project = await db.project.findFirst({
    where: {
      id,
      organizationId: organizationId,
    },
    include: {
      projectOperations: true,
    },
  });

  if (!project) {
    throw new Error(
      "Project not found or you don't have permission to delete it",
    );
  }
  await db.projectOperation.deleteMany({
    where: {
      projectId: id,
    },
  });

  return await db.project.delete({ where: { id } });
}
export async function deleteProductAndRevalidate(id: string) {
  await deleteById(id);
  revalidatePath("/projects");
}

// const handler = async (data: TCreateInput) => {
//   const session = await getServerSession();
//   const organizationId =
//     session?.user.organizationId || session?.user.organization?.id;

//   if (!organizationId) {
//     throw new Error("Organization ID is not available");
//   }

//   const result = await db.project.create({
//     data: {
//       ...data,
//       organizationId,
//     },
//   });
//   return result;
// };

// export const create = createSafeAction({ scheme: createInputSchema, handler });

const handler = async (data: TCreateInput) => {
  console.log("data", data);
  const session = await getServerSession();
  const organizationId =
    session?.user.organizationId || session?.user.organization?.id;

  if (!organizationId) {
    throw new Error("Organization ID is not available");
  }

  const result = await db.$transaction(async (prisma) => {
    // Create the project
    const project = await prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        code: data.code,
        organizationId,
      },
    });

    // Create the workflow
    const workflow = await prisma.workFlow.create({
      data: {
        project: {
          connect: { id: project.id },
        },
      },
    });

    // Create workflow nodes and project operations
    const createdNodes = await Promise.all(
      data.operations.map(async (operation, index) => {
        const node = await prisma.workFlowNode.create({
          data: {
            workFlowId: workflow.id,
            operationId: operation.id,
            data: {
              time: operation.time,
              position: { x: index * 200, y: 100 }, // Add default position
            },
          },
        });

        await prisma.projectOperation.create({
          data: {
            projectId: project.id,
            operationId: operation.id,
            description: operation.description,
            time: operation.time,
          },
        });

        return node;
      }),
    );

    // Create workflow edges
    if (createdNodes.length > 1) {
      for (let i = 0; i < createdNodes.length - 1; i++) {
        await prisma.workFlowEdge.create({
          data: {
            workFlowId: workflow.id,
            sourceId: createdNodes[i].id,
            targetId: createdNodes[i + 1].id,
            data: {},
          },
        });
      }
    }

    // Fetch the created project with all related data
    return await prisma.project.findUnique({
      where: { id: project.id },
      include: {
        workFlow: {
          include: {
            WorkflowNode: {
              include: {
                operation: true,
              },
            },
            WorkFlowEdge: true,
          },
        },
        projectOperations: {
          include: {
            operation: true,
          },
        },
      },
    });
  });

  return result;
};

export const create = createSafeAction({ scheme: createInputSchema, handler });

// export async function getProjectWithOperations(id: string) {
//   return db.project.findUnique({
//     where: { id },
//     include: {
//       workFlow: {
//         include: {
//           WorkflowNode: {
//             include: {
//               operation: true,
//               sourceEdges: {
//                 include: {
//                   target: {
//                     include: {
//                       operation: true,
//                     },
//                   },
//                 },
//               },
//             },
//           },
//         },
//       },
//       projectOperations: {
//         include: {
//           operation: true,
//         },
//       },
//     },
//   });
// }

// export async function saveWorkflow(
//   projectId: string,
//   nodes: Array<{
//     id: string;
//     operationId: string;
//     data: { label: string; time: number };
//   }>,
//   edges: Array<{
//     id: string;
//     sourceId: string;
//     targetId: string;
//     count: number;
//   }>,
// ) {
//   console.log("saveWorkflow", nodes);
//   return db.$transaction(async (tx) => {
//     // Create or update the workflow
//     const workflow = await tx.workFlow.upsert({
//       where: { id: projectId },
//       update: {},
//       create: { id: projectId },
//     });

//     // Upsert nodes
//     const createdNodes = await Promise.all(
//       nodes.map((node) =>
//         tx.workFlowNode.upsert({
//           where: { id: node.id },
//           update: {
//             data: node.data,
//             operationId: node.operationId,
//             workFlowId: workflow.id,
//           },
//           create: {
//             id: node.id,
//             data: node.data,
//             operationId: node.operationId,
//             workFlowId: workflow.id,
//           },
//         }),
//       ),
//     );

//     // Delete nodes that are no longer in the workflow
//     await tx.workFlowNode.deleteMany({
//       where: {
//         workFlowId: workflow.id,
//         id: { notIn: nodes.map((n) => n.id) },
//       },
//     });

//     // Upsert edges
//     await Promise.all(
//       edges.map((edge) =>
//         tx.workFlowEdge.upsert({
//           where: { id: edge.id },
//           update: {
//             sourceId: edge.sourceId,
//             targetId: edge.targetId,
//             count: edge.count,
//             data: {},
//           },
//           create: {
//             id: edge.id,
//             sourceId: edge.sourceId,
//             targetId: edge.targetId,
//             count: edge.count,
//             data: {},
//             workFlowId: workflow.id,
//           },
//         }),
//       ),
//     );

//     // Delete edges that are no longer in the workflow
//     await tx.workFlowEdge.deleteMany({
//       where: {
//         workFlowId: workflow.id,
//         id: { notIn: edges.map((e) => e.id) },
//       },
//     });

//     // Update the project with the new workflow
//     await tx.project.update({
//       where: { id: projectId },
//       data: { workFlowId: workflow.id },
//     });

//     return workflow;
//   });
// }

// export async function saveWorkflow(
//   projectId: string,
//   nodes: Array<{
//     id: string;
//     operationId: string;
//     data: { label: string; time: number };
//   }>,
//   edges: Array<{
//     id: string;
//     sourceId: string;
//     targetId: string;
//     count: number;
//   }>,
// ) {
//   console.log("saveWorkflow", nodes, edges);
//   return db.$transaction(async (tx) => {
//     // Create or update the workflow
//     const workflow = await tx.workFlow.upsert({
//       where: { id: projectId },
//       update: {},
//       create: { id: projectId },
//     });

//     // Upsert nodes
//     const createdNodes = await Promise.all(
//       nodes.map((node) =>
//         tx.workFlowNode.upsert({
//           where: { id: node.id },
//           update: {
//             data: node.data,
//             operationId: node.operationId,
//             workFlowId: workflow.id,
//           },
//           create: {
//             id: node.id,
//             data: node.data,
//             operationId: node.operationId,
//             workFlowId: workflow.id,
//           },
//         }),
//       ),
//     );

//     // Delete nodes that are no longer in the workflow
//     await tx.workFlowNode.deleteMany({
//       where: {
//         workFlowId: workflow.id,
//         id: { notIn: nodes.map((n) => n.id) },
//       },
//     });

//     // Upsert edges
//     await Promise.all(
//       edges.map((edge) =>
//         tx.workFlowEdge.upsert({
//           where: { id: edge.id },
//           update: {
//             sourceId: edge.sourceId,
//             targetId: edge.targetId,
//             count: edge.count,
//             data: {},
//           },
//           create: {
//             id: edge.id,
//             sourceId: edge.sourceId,
//             targetId: edge.targetId,
//             count: edge.count,
//             data: {},
//             workFlowId: workflow.id,
//           },
//         }),
//       ),
//     );

//     // Delete edges that are no longer in the workflow
//     await tx.workFlowEdge.deleteMany({
//       where: {
//         workFlowId: workflow.id,
//         id: { notIn: edges.map((e) => e.id) },
//       },
//     });

//     // Update the project with the new workflow
//     await tx.project.update({
//       where: { id: projectId },
//       data: { workFlowId: workflow.id },
//     });

//     return workflow;
//   });
// }

export async function saveWorkflow(
  projectId: string,
  nodes: Array<{
    id: string;
    operationId: string;
    data: { label: string; time: number };
    position: { x: number; y: number };
  }>,
  edges: Array<{
    id: string;
    sourceId: string;
    targetId: string;
    count: number;
  }>,
) {
  console.log("saveWorkflow", nodes, edges);
  return db.$transaction(async (tx) => {
    // Create or update the workflow
    const workflow = await tx.workFlow.upsert({
      where: { id: projectId },
      update: {},
      create: { id: projectId },
    });

    // Upsert nodes
    const createdNodes = await Promise.all(
      nodes.map((node) =>
        tx.workFlowNode.upsert({
          where: { id: node.id },
          update: {
            data: { ...node.data, position: node.position },
            operationId: node.operationId,
            workFlowId: workflow.id,
          },
          create: {
            id: node.id,
            data: { ...node.data, position: node.position },
            operationId: node.operationId,
            workFlowId: workflow.id,
          },
        }),
      ),
    );

    // Delete nodes that are no longer in the workflow
    await tx.workFlowNode.deleteMany({
      where: {
        workFlowId: workflow.id,
        id: { notIn: nodes.map((n) => n.id) },
      },
    });

    // Upsert edges
    const createdEdges = await Promise.all(
      edges.map((edge) =>
        tx.workFlowEdge.upsert({
          where: { id: edge.id },
          update: {
            sourceId: edge.sourceId,
            targetId: edge.targetId,
            count: edge.count,
            data: {},
          },
          create: {
            id: edge.id,
            sourceId: edge.sourceId,
            targetId: edge.targetId,
            count: edge.count,
            data: {},
            workFlowId: workflow.id,
          },
        }),
      ),
    );

    // Delete edges that are no longer in the workflow
    await tx.workFlowEdge.deleteMany({
      where: {
        workFlowId: workflow.id,
        id: { notIn: edges.map((e) => e.id) },
      },
    });

    // Update the project with the new workflow
    await tx.project.update({
      where: { id: projectId },
      data: { workFlowId: workflow.id },
    });

    return workflow;
  });
}

export async function getProjectWithOperations(id: string) {
  return db.project.findUnique({
    where: { id },
    include: {
      projectOperations: {
        include: {
          operation: true,
        },
      },
      workFlow: {
        include: {
          WorkflowNode: {
            include: {
              operation: true,
            },
          },
          WorkFlowEdge: true,
        },
      },
    },
  });
}

export async function update(data: TUpdateInput) {
  try {
    console.log("dat eeeeeeeeeeea", data);
    const product = await db.project.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description,
        projectOperations: {
          deleteMany: {},
          create: data.operations.map((op) => ({
            operation: { connect: { id: op.id } },
            description: op.description,
            time: op.time,
          })),
        },
      },
    });

    revalidatePath("/products");
    return { result: product };
  } catch (error) {
    console.error("Error updating product:", error);
    return { error: "Failed to update product" };
  }
}

export async function getProductById(id: string): Promise<TUpdateInput | null> {
  try {
    const product = await db.project.findUnique({
      where: { id },
      include: {
        projectOperations: {
          select: {
            operation: { select: { id: true } },
            time: true,
            description: true,
          },
        },
      },
    });

    if (!product) {
      return null;
    }

    return {
      id: product.id,
      name: product.name,
      description: product.description || undefined,
      operations: product.projectOperations.map((po) => ({
        id: po.operation.id,
        time: po.time,
        description: po.description || "",
      })),
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}
