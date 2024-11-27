import { getOperationProgress } from "@/actions/operation-progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

export async function OperationProgressChart({
  commandProjectId,
}: {
  commandProjectId: string;
}) {
  const data = await getOperationProgress(commandProjectId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Operation Progress</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data.operationDetails}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Bar dataKey="progress" fill="#8884d8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
