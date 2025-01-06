"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getOperationName } from "../_utils/actions";

type ProjectData = Awaited<
  ReturnType<typeof import("../_utils/actions").getProjectOverview>
>;

export function ProjectOverviewDashboard({
  projectData,
}: {
  projectData: ProjectData;
}) {
  const [operationNames, setOperationNames] = useState<Record<string, string>>(
    {},
  );

  useEffect(() => {
    const fetchOperationNames = async () => {
      const names: Record<string, string> = {};
      for (const planning of projectData?.plannings || []) {
        if (planning.operationId) {
          names[planning.operationId] = await getOperationName(
            planning.operationId,
          );
        }
      }
      setOperationNames(names);
    };

    fetchOperationNames();
  }, [projectData?.plannings]);

  if (!projectData) {
    return <div>No project data available.</div>;
  }

  const totalOperationCount =
    projectData.plannings?.reduce(
      (sum, planning) =>
        sum +
        (planning.operationHistory?.reduce(
          (total, history) => total + (history.count || 0),
          0,
        ) || 0),
      0,
    ) || 0;

  const progress = projectData.target
    ? (totalOperationCount / projectData.target) * 100
    : 0;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>
            {projectData.project?.name || "Unnamed Project"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Client: {projectData.command?.client?.name || "N/A"}</p>
          <p>Reference: {projectData.command?.reference || "N/A"}</p>
          <p>Target: {projectData.target || 0}</p>
          <p>
            Progress: {totalOperationCount} / {projectData.target || 0}
          </p>
          <Progress value={progress} className="mt-2" />
        </CardContent>
      </Card>

      <Tabs defaultValue="operations">
        <TabsList>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="history">Operation History</TabsTrigger>
        </TabsList>
        <TabsContent value="operations">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projectData.plannings?.map((planning) => (
              <Card key={planning.id}>
                <CardHeader>
                  <CardTitle>
                    {operationNames[planning.operationId] ||
                      "Unnamed Operation"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Post: {planning.post?.name || "N/A"}</p>
                  <p>Operator: {planning.operator?.name || "N/A"}</p>
                  <p>
                    Start Date:{" "}
                    {planning.startDate
                      ? new Date(planning.startDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <p>
                    End Date:{" "}
                    {planning.endDate
                      ? new Date(planning.endDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <p>
                    Total Count:{" "}
                    {planning.operationHistory?.reduce(
                      (sum, history) => sum + (history.count || 0),
                      0,
                    ) || 0}
                  </p>
                </CardContent>
              </Card>
            )) || <p>No operations available.</p>}
          </div>
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardContent>
              {projectData.plannings && projectData.plannings.length > 0 ? (
                <ul className="space-y-2">
                  {projectData.plannings.flatMap(
                    (planning) =>
                      planning.operationHistory?.map((history) => (
                        <li
                          key={history.id}
                          className="flex items-center justify-between"
                        >
                          <span>
                            {operationNames[planning.operationId] ||
                              "Unnamed Operation"}
                          </span>
                          <span>Count: {history.count || 0}</span>
                          <span>
                            {history.createdAt
                              ? new Date(history.createdAt).toLocaleString()
                              : "N/A"}
                          </span>
                        </li>
                      )) || [],
                  )}
                </ul>
              ) : (
                <p>No operation history available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
