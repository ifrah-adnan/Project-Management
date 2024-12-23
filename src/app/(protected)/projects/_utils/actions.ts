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
import { OperationProgressSummary } from "@/actions/operation-progress";

const defaultParams: Record<string, string> = {
  page: "1",
  perPage: "10",
};

export interface CommandProject {
  id: string;
  commandId: string;
  projectId: string;
  command?: {
    client: {
      name: string;
    } | null;
  };

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

// const configureSpringHandler = async (data: TConfigureSprint) => {
//   const serverSession = await getServerSession();
//   const organizationId =
//     serverSession?.user.organizationId || serverSession?.user.organization?.id;

//   const { commandProjectId } = data;
//   return db.sprint.upsert({
//     where: {
//       commandProjectId: "0a772f59-f98c-4ed3-9426-22dee6005dec",
//     },
//     update: {
//       target: 222,
//       days: 2,
//     },
//     create: {
//       target: 10022,
//       days: 1,
//       organization: {
//         connect: {
//           id: "736dd56d-498a-4ab5-b22d-07169760d0e7",
//         },
//       },
//       commandProject: {
//         connectOrCreate: {
//           where: {
//             id: "0a772f59-f98c-4ed3-9426-22dee6005dec",
//           },
//           create: {
//             id: "0a772f59-f98c-4ed3-9426-22dee6005dec",
//             target: 65,
//             endDate: "2024-07-18T22:45:25.386Z",
//             command: {
//               connect: { id: "00b2f1a7-7ac1-4a84-9e8b-aa841438cf84" },
//             },
//             project: {
//               connect: { id: "3efc40f4-2f91-4a16-9f29-c49ceaff935b" },
//             },
//             user: { connect: { id: serverSession?.user.id } },
//             organization: {
//               connect: { id: organizationId },
//             },
//           },
//         },
//       },
//     },
//   });
// };

// export const configureSprint = createSafeAction({
//   scheme: configureSpringSchema,
//   handler: configureSpringHandler,
// });
export async function configureSprint(data: TConfigureSprint) {
  try {
    const session = await getServerSession();
    if (!session || !session.user) {
      return { error: "Unauthorized" };
    }

    const organizationId =
      session.user.organization?.id || session.user.organizationId;
    if (!organizationId) {
      return { error: "Organization not found" };
    }

    const parsed = configureSpringSchema.safeParse(data);
    if (!parsed.success) {
      return { fieldErrors: parsed.error.flatten().fieldErrors };
    }

    const { commandProjectId, target, days } = parsed.data;

    const commandProject = await db.commandProject.findUnique({
      where: { id: commandProjectId, organizationId },
    });

    if (!commandProject) {
      return { error: "Command project not found" };
    }

    const sprint = await db.sprint.upsert({
      where: { commandProjectId },
      update: { target, days },
      create: {
        target,
        days,
        commandProjectId,
        organizationId,
      },
    });

    return { result: sprint };
  } catch (error) {
    console.error("Error configuring sprint:", error);
    return { error: "An unexpected error occurred" };
  }
}

// const handler = async (data: TCreateInput) => {
//   const user = await db.commandProject.create({
//     data: {
//       commandId: data.command_id,
//       projectId: data.project_id,
//       target: data.target,
//       endDate: data.endDate,
//     },
//   });
//   return user;
// };

// export const create = createSafeAction({ scheme: createInputSchema, handler });

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
  const session = await getServerSession();
  const organizationId =
    session?.user.organizationId || session?.user.organization?.id;
  const { ...rest } = data;
  const user = await db.commandProject.update({
    where: { id: projectToUpdateId, organizationId },
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
          organizationId,
        },
      },
    },
  });
}

export async function deleteCommandProjectById(id: string) {
  return await db.$transaction(async (tx) => {
    await tx.sprint.deleteMany({
      where: { commandProjectId: id },
    });

    return tx.commandProject.delete({ where: { id } });
  });
}

export async function handleDeleteCommandProject(itemId: string) {
  try {
    await deleteCommandProjectById(itemId);
    revalidatePath("/projects");
  } catch (error) {
    console.error("Erreur lors de la suppression du CommandProject:", error);
    throw error;
  }
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
      command: {
        select: {
          client: {
            select: {
              name: true,
            },
          },
        },
      },
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
export async function getOrganizationDetails(organizationId: string) {
  try {
    const organization = await db.organization.findUnique({
      where: { id: organizationId },
      include: {
        _count: {
          select: {
            users: true,
            posts: true,
            expertises: true,
            projects: true,
            commands: true,
            devices: true,
          },
        },
      },
    });

    if (!organization) {
      throw new Error("Organization not found");
    }

    return {
      id: organization.id,
      name: organization.name,
      description: organization.description,
      imagePath: organization.imagePath,
      address: organization.address,
      createdAt: organization.createdAt,
      userCount: organization._count.users,
      postCount: organization._count.posts,
      expertiseCount: organization._count.expertises,
      projectCount: organization._count.projects,
      commandCount: organization._count.commands,
      deviceCount: organization._count.devices,
    };
  } catch (error) {
    console.error("Error fetching organization details:", error);
    throw error;
  }
}

export async function updateDoneValue(id: string, newValue: number) {
  try {
    const updatedProject = await db.commandProject.update({
      where: { id },
      data: { done: newValue },
    });

    revalidatePath("/projects");

    return { success: true, data: updatedProject };
  } catch (error) {
    console.error("Failed to update done value:", error);
    return { success: false, error: "Failed to update done value" };
  }
}
export interface Operation {
  id: string;
  name: string;
  code: string;
  icon: string;
  description?: string;
  isFinal: boolean;
  estimatedTime: number;
}

export interface OperationsResponse {
  operations?: Operation[];
  error?: string;
}
export async function getOperationsForCommandProject(
  commandProjectId: string,
): Promise<OperationsResponse> {
  try {
    const commandProject = await db.commandProject.findUnique({
      where: { id: commandProjectId },
      include: {
        planings: {
          include: {
            operation: true,
          },
        },
      },
    });

    if (!commandProject) {
      return { error: "CommandProject not found" };
    }

    // Extract unique operations from all plannings
    const uniqueOperations = commandProject.planings.reduce((acc, planning) => {
      if (planning.operation && planning.operation.length > 0) {
        planning.operation.forEach((op) => {
          if (!acc.some((existingOp) => existingOp.id === op.id)) {
            acc.push({
              id: op.id,
              name: op.name,
              code: op.code,
              icon: op.icon,
              description: op.description ?? undefined,
              isFinal: op.isFinal,
              estimatedTime: op.estimatedTime,
            });
          }
        });
      }
      return acc;
    }, [] as Operation[]);

    return { operations: uniqueOperations };
  } catch (error) {
    console.error("Error fetching operations:", error);
    return { error: "Failed to fetch operations" };
  }
}

export async function calculateOperationTargetss(commandProjectId: string) {
  try {
    const commandProject = await db.commandProject.findUnique({
      where: { id: commandProjectId },
      include: { project: { include: { workFlow: true } } },
    });

    if (!commandProject || !commandProject.project.workFlow) {
      throw new Error("Command project or workflow not found");
    }

    const { target: projectTarget } = commandProject;
    const workFlowId = commandProject.project.workFlow.id;

    const workflowNodes = await db.workFlowNode.findMany({
      where: { workFlowId },
      include: {
        operation: true,
        targetEdges: true,
      },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    let totalCompleted = 0;

    const operationTargets = await Promise.all(
      workflowNodes.map(async (node) => {
        const { operation, targetEdges } = node;
        let operationTarget = 0;

        if (operation.isFinal) {
          operationTarget = projectTarget;
        } else {
          const totalCount = targetEdges.reduce(
            (sum: number, edge) => sum + edge.count,
            0,
          );
          operationTarget = totalCount * projectTarget;
        }

        const deviceIds = await db.device
          .findMany({
            where: {
              planning: {
                commandProjectId: commandProjectId,
                operationId: node.operation.id,
              },
            },
            select: {
              id: true,
            },
          })
          .then((devices) => devices.map((device) => device.id));

        const [totalCount, todayCount, lastWeekCount, lastMonthCount] =
          await Promise.all([
            db.operationRecord.aggregate({
              where: { deviceId: { in: deviceIds } },
              _sum: { count: true },
            }),
            db.operationRecord.aggregate({
              where: {
                deviceId: { in: deviceIds },
                createdAt: { gte: today },
              },
              _sum: { count: true },
            }),
            db.operationRecord.aggregate({
              where: {
                deviceId: { in: deviceIds },
                createdAt: { gte: lastWeek },
              },
              _sum: { count: true },
            }),
            db.operationRecord.aggregate({
              where: {
                deviceId: { in: deviceIds },
                createdAt: { gte: lastMonth },
              },
              _sum: { count: true },
            }),
          ]);

        const completedCount = totalCount._sum.count || 0;
        totalCompleted += completedCount;

        const progress = (completedCount / operationTarget) * 100;

        return {
          operationId: operation.id,
          operationName: operation.name,
          target: operationTarget,
          completed: completedCount,
          todayCount: todayCount._sum.count || 0,
          lastWeekCount: lastWeekCount._sum.count || 0,
          lastMonthCount: lastMonthCount._sum.count || 0,
          progress: progress,
        };
      }),
    );

    return {
      operationTargets,
      totalCompleted,
      totalTarget: projectTarget,
      totalProgress: (totalCompleted / projectTarget) * 100,
    };
  } catch (error) {
    console.error("Error calculating operation targets:", error);
    throw error;
  }
}

export async function getOperationProgress2(
  commandProjectId: string,
): Promise<OperationProgressSummary> {
  const workflow = await db.workFlow.findFirst({
    where: {
      project: {
        commandProjects: {
          some: { id: commandProjectId },
        },
      },
    },
    include: {
      WorkflowNode: {
        include: {
          operation: true,
          targetEdges: true,
          sourceEdges: true,
        },
      },
      WorkFlowEdge: true,
    },
  });

  if (!workflow) {
    throw new Error("Workflow not found for the given command project");
  }

  const finalOperation = workflow.WorkflowNode.find(
    (node) => node.operation.isFinal,
  );
  const hasFinalOperation = !!finalOperation;

  const sprint = await db.sprint.findUnique({
    where: { commandProjectId },
  });
  const hasSprint = !!sprint;

  const weeklyTarget = hasSprint
    ? Math.ceil((sprint!.target / sprint!.days) * 7)
    : null;

  let weeklyCompleted = 0;

  if (hasFinalOperation) {
    const deviceIds = await db.device
      .findMany({
        where: {
          planning: {
            commandProjectId: commandProjectId,
            operationId: finalOperation!.operation.id,
          },
        },
        select: {
          deviceId: true,
        },
      })
      .then((devices) => devices.map((device) => device.deviceId));

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weeklyCompletedResult = await db.operationRecord.aggregate({
      where: {
        deviceId: { in: deviceIds },
        createdAt: { gte: oneWeekAgo },
      },
      _sum: { count: true },
    });

    weeklyCompleted = weeklyCompletedResult._sum.count || 0;
  }

  const commandProject = await db.commandProject.findUnique({
    where: { id: commandProjectId },
  });

  if (!commandProject) {
    throw new Error("Command project not found");
  }

  const baseTarget = commandProject.target;

  const calculateNodeTarget = (
    nodeId: string,
    visited = new Set<string>(),
  ): number => {
    if (visited.has(nodeId)) return 0;
    visited.add(nodeId);

    const node = workflow.WorkflowNode.find((n) => n.id === nodeId);
    if (!node) return 0;

    const incomingEdges = workflow.WorkFlowEdge.filter(
      (e) => e.targetId === nodeId,
    );
    if (incomingEdges.length === 0) return baseTarget;

    const targets = incomingEdges.map((edge) => {
      const parentTarget = calculateNodeTarget(edge.sourceId, new Set(visited));
      return parentTarget * edge.count;
    });

    return Math.max(...targets);
  };

  let totalCompleted = 0;
  let totalTarget = 0;
  let totalEstimatedHours = 0;

  const today = new Date();
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const operationDetails = await Promise.all(
    workflow.WorkflowNode.map(async (node) => {
      const target = calculateNodeTarget(node.id);
      totalTarget += target;

      const deviceIds = await db.device
        .findMany({
          where: {
            planning: {
              commandProjectId: commandProjectId,
              operationId: node.operation.id,
            },
          },
          select: {
            deviceId: true,
          },
        })
        .then((devices) => devices.map((device) => device.deviceId));

      today.setHours(0, 0, 0, 0);

      const [totalCount, todayCount, lastWeekCount, lastMonthCount] =
        await Promise.all([
          db.operationRecord.aggregate({
            where: { deviceId: { in: deviceIds } },
            _sum: { count: true },
          }),
          db.operationRecord.aggregate({
            where: {
              deviceId: { in: deviceIds },
              createdAt: { gte: today },
            },
            _sum: { count: true },
          }),
          db.operationRecord.aggregate({
            where: {
              deviceId: { in: deviceIds },
              createdAt: { gte: lastWeek },
            },
            _sum: { count: true },
          }),
          db.operationRecord.aggregate({
            where: {
              deviceId: { in: deviceIds },
              createdAt: { gte: lastMonth },
            },
            _sum: { count: true },
          }),
        ]);

      const completedCount = totalCount._sum.count || 0;
      totalCompleted += completedCount;

      const progress = (completedCount / target) * 100;

      workflow.WorkflowNode.forEach((node) => {
        const nodeTarget = calculateNodeTarget(node.id);
        totalEstimatedHours += (node.operation.estimatedTime * nodeTarget) / 60;
      });

      return {
        id: node.operation.id,
        name: node.operation.name,
        progress: Math.min(progress, 100),
        target: target,
        completedCount: completedCount,
        todayCount: todayCount._sum.count || 0,
        lastWeekCount: lastWeekCount._sum.count || 0,
        lastMonthCount: lastMonthCount._sum.count || 0,
      };
    }),
  );

  const operationCount = workflow.WorkflowNode.length;
  const targets = await calculateOperationTargets(commandProjectId);

  return {
    operationDetails,
    totalCompleted,
    targets,
    totalTarget,
    weeklyProgress: {
      weeklyTarget,
      weeklyCompleted,
      hasSprint,
      hasFinalOperation,
    },
    totalEstimatedHours,
    operationCount,
  };
}
export async function calculateOperationTargets(commandProjectId: string) {
  // Récupérer le workflow et le projet associé
  const workflow = await db.workFlow.findFirst({
    where: {
      project: {
        commandProjects: {
          some: { id: commandProjectId },
        },
      },
    },
    include: {
      WorkflowNode: {
        include: {
          operation: true,
        },
      },
      WorkFlowEdge: true,
    },
  });

  if (!workflow) {
    throw new Error("Workflow not found for the given command project");
  }

  const commandProject = await db.commandProject.findUnique({
    where: { id: commandProjectId },
  });

  if (!commandProject) {
    throw new Error("Command project not found");
  }

  const baseTarget = commandProject.target;

  // Fonction récursive pour calculer la target de chaque nœud
  const calculateNodeTarget = (
    nodeId: string,
    parentTarget: number,
  ): number => {
    const node = workflow.WorkflowNode.find((n) => n.id === nodeId);
    if (!node) return 0;

    const incomingEdges = workflow.WorkFlowEdge.filter(
      (e) => e.targetId === nodeId,
    );

    if (incomingEdges.length === 0) {
      // C'est un nœud source, on utilise la target de base
      return baseTarget;
    }

    // Calculer la target en fonction du parent et du ratio de l'arête
    const edge = incomingEdges[0]; // On suppose une seule arête entrante par simplicité
    return parentTarget * edge.count;
  };

  // Trouver le nœud final
  const finalNode = workflow.WorkflowNode.find(
    (node) => node.operation.isFinal,
  );
  if (!finalNode) {
    throw new Error("Final operation not found in workflow");
  }

  // Calculer les targets en partant du nœud final
  const targets: { [key: string]: number } = {};
  const calculateTargets = (nodeId: string, target: number) => {
    const node = workflow.WorkflowNode.find((n) => n.id === nodeId);
    if (!node) return;

    targets[node.operation.id] = target;

    const incomingEdges = workflow.WorkFlowEdge.filter(
      (e) => e.targetId === nodeId,
    );
    incomingEdges.forEach((edge) => {
      const parentTarget = target * edge.count;
      calculateTargets(edge.sourceId, parentTarget);
    });
  };

  calculateTargets(finalNode.id, baseTarget);

  return targets;
}

export async function getProjectDetails(commandProjectId: string) {
  try {
    const commandProject = await db.commandProject.findUnique({
      where: { id: commandProjectId },
      include: {
        project: {
          include: {
            workFlow: true,
          },
        },
        command: {
          include: {
            client: true,
          },
        },
        user: true,
        organization: true,
        sprint: true,
      },
    });

    if (!commandProject) {
      throw new Error("Command Project not found");
    }

    // Reformat the data to match the structure expected by the frontend
    const formattedProject = {
      id: commandProject.id,
      projectName: commandProject.project.name,
      projectDescription: commandProject.project.description,
      status: commandProject.status,
      organization: commandProject.organization,
      createdAt: commandProject.createdAt,
      updatedAt: commandProject.updatedAt,
      command: commandProject.command,
      client: commandProject.command.client,
      target: commandProject.target,
      done: commandProject.done,
      startDate: commandProject.startDate,
      endDate: commandProject.endDate,
      sprint: commandProject.sprint,
      workflow: commandProject.project.workFlow,
      user: commandProject.user,
    };

    revalidatePath(`/project/${commandProjectId}`);
    return formattedProject;
  } catch (error) {
    console.error("Failed to fetch command project details:", error);
    throw new Error("Failed to fetch command project details");
  }
}
