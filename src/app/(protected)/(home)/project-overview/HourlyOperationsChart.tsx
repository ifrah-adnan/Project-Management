import { getHourlyOperation } from "@/actions/weekly-operations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

export async function HourlyOperationsChart({
  commandProjectId,
}: {
  commandProjectId: string;
}) {
  const data = await getHourlyOperation(commandProjectId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hourly Operations</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <XAxis
              dataKey="hour"
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
              tickFormatter={(value) => `${value}`}
            />
            <Line
              type="monotone"
              dataKey="Total"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
