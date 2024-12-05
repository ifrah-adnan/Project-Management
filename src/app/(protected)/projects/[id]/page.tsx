import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  GitBranchPlusIcon,
  Download,
  Filter,
  RefreshCw,
  ListIcon,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOperationProgress2, getProjectDetails } from "../_utils/actions";
import { useState } from "react";

export default async function ProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const project = await getProjectDetails(params.id);
  const result: any = await getOperationProgress2(params.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{project.projectName}</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center space-x-2">
              <ListIcon className="h-5 w-5" />
              <span>View Operations</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                Operations: {project.projectName}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                  <Button size="sm" variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {result.operations && result.operations.length > 0 ? (
                  result.operations.map((op: any) => (
                    <Card key={op.id} className="bg-card">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium">
                          {op.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="relative mx-auto mb-2 h-20 w-20">
                          <svg
                            className="h-full w-full"
                            viewBox="0 0 100 100"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="transparent"
                              stroke="#E6B3BA"
                              strokeWidth="4"
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="transparent"
                              stroke="#8D99AE"
                              strokeWidth="4"
                              strokeDasharray="251.2"
                              strokeDashoffset={
                                251.2 - (251.2 * op.progress) / 100
                              }
                              transform="rotate(-90 50 50)"
                            />
                            <text
                              x="50"
                              y="50"
                              textAnchor="middle"
                              dominantBaseline="middle"
                              className="fill-primary text-sm font-medium"
                            >
                              {op.progress.toFixed(2)}%
                            </text>
                          </svg>
                        </div>
                        <div className="space-y-1 text-center text-sm">
                          <p>Completed: {op.completedCount}</p>
                          <p>Target: {op.target || "N/A"}</p>
                          <p>Today: {op.todayCount}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full py-8 text-center">
                    No operations found for this project.
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <strong>Description:</strong>{" "}
              {project.projectDescription || "N/A"}
            </p>
            <p>
              <strong>Client:</strong> {project.client?.name || "N/A"}
            </p>
            <p>
              <strong>Reference:</strong> {project.command?.reference || "N/A"}
            </p>
            <p>
              <strong>Status:</strong> {project.status}
            </p>
            <p>
              <strong>Target:</strong> {project.target || "N/A"}
            </p>
            <p>
              <strong>Done:</strong> {project.done}
            </p>
            <p>
              <strong>Start Date:</strong>{" "}
              {project.startDate
                ? new Date(project.startDate).toLocaleDateString()
                : "N/A"}
            </p>
            <p>
              <strong>End Date:</strong>{" "}
              {project.endDate
                ? new Date(project.endDate).toLocaleDateString()
                : "N/A"}
            </p>
            <p>
              <strong>Assigned To:</strong> {project.user?.name || "N/A"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {project.workflow && (
              <Link href={`/projects/workflow/${project.workflow.id}`}>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <GitBranchPlusIcon size={16} />
                  <span>View Workflow</span>
                </Button>
              </Link>
            )}
            {project.workflow && (
              <div>
                <h3 className="mb-2 font-semibold">Workflow Details</h3>
                <p>Workflow ID: {project.workflow.id}</p>
                {/* You can add more workflow details here if needed */}
              </div>
            )}
            {project.sprint && (
              <div>
                <h3 className="mb-2 font-semibold">Sprint Details</h3>
                <p>Sprint ID: {project.sprint.id}</p>
                {/* Add more sprint details as needed */}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
