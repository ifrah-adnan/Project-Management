"use client";

import { getOperationName } from "@/app/(protected)/(home)/_utils/actions";
import { getCommandProjectDetails } from "@/app/(protected)/commitement/utils/action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { useEffect, useState } from "react";

interface PlanningItem {
  operator: { name: string };
  operationId: string;
  commandProjectId: string;
  startDate: Date;
  endDate: Date;
}

interface CommandProject {
  id: string;
  project: {
    name: string;
  };
  command: {
    reference: string;
  };
}

interface PlanningDisplayProps {
  planning: PlanningItem[];
}

export function PlanningDisplay({ planning }: PlanningDisplayProps) {
  const [operationNames, setOperationNames] = useState<Record<string, string>>(
    {},
  );
  const [commandProjects, setCommandProjects] = useState<
    Record<string, CommandProject | null>
  >({});

  useEffect(() => {
    const fetchData = async () => {
      const names: Record<string, string> = {};
      const projects: Record<string, CommandProject | null> = {};

      for (const item of planning) {
        const [name, project] = await Promise.all([
          getOperationName(item.operationId),
          getCommandProjectDetails(item.commandProjectId),
        ]);

        names[item.operationId] = name;
        projects[item.commandProjectId] = project;
      }

      setOperationNames(names);
      setCommandProjects(projects);
    };

    fetchData();
  }, [planning]);

  return (
    <div className="space-y-4">
      {planning.map((item, index) => {
        const commandProject = commandProjects[item.commandProjectId];

        return (
          <Card key={index} className="mx-auto w-full max-w-4xl">
            <CardHeader>
              <CardTitle>Planning {index + 1}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <strong>Operator:</strong> {item.operator.name}
              </div>
              <div>
                <strong>Operation:</strong>{" "}
                {operationNames[item.operationId] || item.operationId}
              </div>
              {commandProject && (
                <>
                  <div>
                    <strong>Project:</strong> {commandProject.project.name}
                  </div>
                  {/* <div>
                    <strong>Command Reference:</strong>{" "}
                    {commandProject.command.reference}
                  </div> */}
                </>
              )}
              <div>
                <strong>Start Date:</strong>{" "}
                {format(new Date(item.startDate), "PPP")}
              </div>
              <div>
                <strong>End Date:</strong>{" "}
                {format(new Date(item.endDate), "PPP")}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
