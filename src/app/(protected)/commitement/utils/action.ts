"use server";

import { getServerSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function getPlanningData() {
  const session = await getServerSession();
  if (!session || !session.user || session.user.role !== "OPERATOR") {
    throw new Error("Unauthorized");
  }

  try {
    const plannings = await db.planning.findMany({
      where: {
        operatorId: session.user.id,
      },
      include: {
        post: true,
      },
      orderBy: {
        startDate: "asc",
      },
    });

    return plannings;
  } catch (error) {
    console.error("Error fetching planning data:", error);
    throw new Error("Failed to fetch planning data");
  }
}

export async function getOperationDetails(operationId: string) {
  try {
    const operation = await db.operation.findUnique({
      where: { id: operationId },
    });
    return operation;
  } catch (error) {
    console.error("Error fetching operation details:", error);
    throw new Error("Failed to fetch operation details");
  }
}

export async function getCommandProjectDetails(commandProjectId: string) {
  try {
    const commandProject = await db.commandProject.findUnique({
      where: { id: commandProjectId },
      include: {
        project: true,
        command: true,
      },
    });
    return commandProject;
  } catch (error) {
    console.error("Error fetching command project details:", error);
    throw new Error("Failed to fetch command project details");
  }
}

export async function updateOperationHistory(
  planningId: string,
  newCount: number,
) {
  const session = await getServerSession();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  try {
    const operationHistory = await db.operationHistory.create({
      data: {
        planningId: planningId,
        count: newCount,
        createdAt: new Date(),
      },
    });

    return operationHistory;
  } catch (error) {
    console.error("Error creating operation history:", error);
    throw new Error("Failed to create operation history");
  }
}

export async function getPlanningById(id: string) {
  const planning = await db.planning.findUnique({
    where: { id },
    include: {
      post: true,
      commandProject: {
        include: {
          project: true,
          command: true,
        },
      },
      operation: true,
      operationHistory: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return planning;
}
