"use server";

import { db } from "@/lib/db";
import { format } from "date-fns";

export async function getOperatorHistory(operatorId: string) {
  try {
    const operationHistory = await db.operationHistory.findMany({
      where: {
        planning: {
          operatorId: operatorId,
        },
      },
      include: {
        planning: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const countsByDate: Record<string, number> = {};
    const planningDetails: Record<string, { startDate: Date; endDate: Date }> =
      {};

    operationHistory.forEach((history) => {
      const dateStr = format(history.createdAt, "yyyy-MM-dd");
      countsByDate[dateStr] = (countsByDate[dateStr] || 0) + history.count;
      if (!planningDetails[dateStr]) {
        planningDetails[dateStr] = {
          startDate: history.planning.startDate,
          endDate: history.planning.endDate,
        };
      }
    });

    return { countsByDate, planningDetails };
  } catch (error) {
    console.error("Error fetching operator history:", error);
    throw new Error("Failed to fetch operator history");
  }
}
