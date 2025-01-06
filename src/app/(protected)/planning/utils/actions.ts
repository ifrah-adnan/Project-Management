"use server";

import { db } from "@/lib/db";

export async function getCommandProjects() {
  try {
    const commandProjects = await db.commandProject.findMany({
      where: {
        status: "ACTIVE",
      },
      include: {
        command: true,
        project: true,
      },
    });
    return { success: true, data: commandProjects };
  } catch (error) {
    return { success: false, error: "Failed to fetch command projects" };
  }
}

export async function getOperations(commandProjectId: string) {
  try {
    const project = await db.commandProject.findUnique({
      where: { id: commandProjectId },
      include: {
        project: {
          include: {
            workFlow: {
              include: {
                WorkflowNode: {
                  include: {
                    operation: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!project?.project?.workFlow) {
      return { success: false, error: "No workflow found for this project" };
    }

    const operations = project.project.workFlow.WorkflowNode.map(
      (node) => node.operation,
    );
    return { success: true, data: operations };
  } catch (error) {
    return { success: false, error: "Failed to fetch operations" };
  }
}

export async function getOperators() {
  try {
    const operators = await db.user.findMany({
      where: {
        role: "OPERATOR",
      },
    });
    return { success: true, data: operators };
  } catch (error) {
    return { success: false, error: "Failed to fetch operators" };
  }
}

export async function getPostPlanning(postId: string) {
  try {
    const planning = await db.planning.findMany({
      where: { postId },
      include: {
        operator: true,
        operation: true,
        commandProject: {
          include: {
            command: true,
            project: true,
          },
        },
      },
    });

    return { success: true, data: planning };
  } catch (error) {
    return { success: false, error: "Failed to fetch post planning" };
  }
}

export async function createPlanning(data: {
  postId: string;
  operatorId: string;
  operationId: string;
  commandProjectId: string;
  startDate: Date;
  endDate: Date;
}) {
  try {
    const planning = await db.planning.create({
      data: {
        postId: data.postId,
        operatorId: data.operatorId,
        operationId: data.operationId,

        commandProjectId: data.commandProjectId,
        startDate: data.startDate,
        endDate: data.endDate,
      },
    });
    return { success: true, data: planning };
  } catch (error) {
    return { success: false, error: "Failed to create planning" };
  }
}

export async function updatePlanning(data: {
  id: string;
  postId: string;
  operatorId: string;
  operationId: string;
  commandProjectId: string;
  startDate: Date;
  endDate: Date;
}) {
  try {
    const planning = await db.planning.update({
      where: { id: data.id },
      data: {
        postId: data.postId,
        operatorId: data.operatorId,
        operationId: data.operationId,
        commandProjectId: data.commandProjectId,
        startDate: data.startDate,
        endDate: data.endDate,
      },
    });
    return { success: true, data: planning };
  } catch (error) {
    return { success: false, error: "Failed to update planning" };
  }
}

export async function deletePlanning(id: string) {
  try {
    await db.planning.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete planning" };
  }
}

// Keep other existing functions (getCommandProjects, getOperations, getOperators) as they are
