import { getOperationProgress } from "@/actions/operation-progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export async function WeeklyProgressCard({
  commandProjectId,
}: {
  commandProjectId: string;
}) {
  const data = await getOperationProgress(commandProjectId);
  const { weeklyProgress } = data;

  const weeklyProgressPercentage = weeklyProgress.weeklyTarget
    ? (weeklyProgress.weeklyCompleted / weeklyProgress.weeklyTarget) * 100
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Progress value={weeklyProgressPercentage} />
          <div className="flex justify-between text-sm text-muted-foreground">
            <div>{weeklyProgress.weeklyCompleted} completed</div>
            <div>{weeklyProgress.weeklyTarget || "N/A"} target</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
