import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  getPlanningData,
  getOperationDetails,
  getCommandProjectDetails,
} from "./utils/action";
import MainHeader from "./component/MainheaderC";
import PlanningSelect from "./component/PlanningSelect";

export default async function CommitementPage() {
  let plannings;
  let error;

  try {
    const rawPlannings = await getPlanningData();
    plannings = await Promise.all(
      rawPlannings.map(async (planning) => {
        const [operation, commandProject] = await Promise.all([
          getOperationDetails(planning.operationId),
          getCommandProjectDetails(planning.commandProjectId),
        ]);
        return { ...planning, operation, commandProject };
      }),
    );
  } catch (e) {
    error = e instanceof Error ? e.message : "An error occurred";
  }

  return (
    <>
      <MainHeader name="Commitement Planning" />
      <div className="container mx-auto p-6">
        {error ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-red-500">Error: {error}</p>
            </CardContent>
          </Card>
        ) : (
          <Suspense fallback={<div>Loading...</div>}>
            {plannings && <PlanningSelect plannings={plannings} />}
          </Suspense>
        )}
      </div>
    </>
  );
}
