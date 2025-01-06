import { notFound } from "next/navigation";
import {
  getCommandProjectDetails,
  getOperationDetails,
  getPlanningById,
} from "../utils/action";
import MainHeader from "../component/MainheaderC";
import PlanningDetailView from "../component/PlanningDetailView";
import { db } from "@/lib/db";

export default async function PlanningDetailPage({
  params,
}: {
  params: { id: string };
}) {
  let planning;
  planning = await getPlanningById(params.id);
  if (planning === null) {
    return notFound();
  }

  const [operation, commandProject, operationHistory] = await Promise.all([
    getOperationDetails(planning.operationId),
    getCommandProjectDetails(planning.commandProjectId),
    db.operationHistory.findFirst({
      where: { planningId: planning.id },
    }),
  ]);

  const planningWithDetails = {
    ...planning,
    operation,
    commandProject,
    operationHistory,
  };
  planning = planningWithDetails;

  return (
    <>
      <MainHeader name="Planning Details" />
      <PlanningDetailView planning={planning} />
    </>
  );
}
