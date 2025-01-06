"use server";

import { db } from "@/lib/db";

export async function getOperationsHistory() {
  return await db.operationHistory.findMany({
    select: {
      id: true,
      planning: {
        select: {
          id: true,
          commandProject: {
            select: { id: true, project: { select: { id: true, name: true } } },
          },
          operation: { select: { id: true, name: true, isFinal: true } },
          operator: { select: { id: true, name: true } },
          post: { select: { id: true } },
        },
      },
      createdAt: true,
    },
  });
}

export async function getProjectOverview(commandProjectId: string) {
  try {
    const projectData = await db.commandProject.findUnique({
      where: { id: commandProjectId },
      include: {
        project: true,
        command: {
          include: {
            client: true,
          },
        },
      },
    });

    if (!projectData) {
      throw new Error("Project not found");
    }

    const plannings = await db.planning.findMany({
      where: { commandProjectId: commandProjectId },
      include: {
        operation: true,
        operationHistory: {
          orderBy: {
            createdAt: "desc",
          },
        },
        post: true,
        operator: true,
      },
    });

    return {
      ...projectData,
      plannings,
    };
  } catch (error) {
    console.error("Error fetching project overview:", error);
    return null;
  }
}

export async function getOperationName(operationId: string) {
  try {
    const operation = await db.operation.findUnique({
      where: { id: operationId },
      select: { name: true },
    });
    return operation?.name || "Unnamed Operation";
  } catch (error) {
    console.error("Error fetching operation name:", error);
    return "Unnamed Operation";
  }
}
