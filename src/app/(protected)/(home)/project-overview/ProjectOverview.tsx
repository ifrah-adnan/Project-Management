import { getOperationProgress } from "@/actions/operation-progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ProjectOverview({
  commandProjectId,
}: {
  commandProjectId: string;
}) {
  const data = await getOperationProgress(commandProjectId);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalCompleted}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Target</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalTarget}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {((data.totalCompleted / data.totalTarget) * 100).toFixed(2)}%
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Estimated Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data.totalEstimatedHours.toFixed(2)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
