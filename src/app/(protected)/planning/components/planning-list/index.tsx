import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface PlanningDisplayProps {
  planning: Array<{
    operator: { name: string };
    operation: { name: string }[];
    commandProject: {
      command: { reference: string };
      project: { name: string };
    }[];
    startDate: Date;
    endDate: Date;
  }>;
}

export function PlanningDisplay({ planning }: PlanningDisplayProps) {
  return (
    <div className="space-y-4">
      {planning.map((item, index) => (
        <Card key={index} className="mx-auto w-full max-w-4xl">
          <CardHeader>
            <CardTitle>Planning {index + 1}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <strong>Operator:</strong> {item.operator.name}
            </div>
            <div>
              <strong>Operation:</strong> {item.operation.map((op) => op.name)}
            </div>
            <div>
              <strong>Command Project:</strong>{" "}
              {item.commandProject.map((cp) => cp.command.reference)} -{" "}
              {item.commandProject.map((cp) => cp.project.name)}
            </div>
            <div>
              <strong>Start Date:</strong>{" "}
              {format(new Date(item.startDate), "PPP")}
            </div>
            <div>
              <strong>End Date:</strong> {format(new Date(item.endDate), "PPP")}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
